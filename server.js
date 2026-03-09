const express = require('express');
const webpush = require('web-push');
const path = require('path');
const fs = require('fs');

// Generate VAPID keys on first run
let vapidKeys;
const keysFile = path.join(__dirname, 'vapid-keys.json');

if (fs.existsSync(keysFile)) {
    vapidKeys = JSON.parse(fs.readFileSync(keysFile, 'utf8'));
} else {
    vapidKeys = webpush.generateVapidKeys();
    fs.writeFileSync(keysFile, JSON.stringify(vapidKeys, null, 2));
    console.log('New VAPID keys generated and saved!');
}

console.log('VAPID Public Key:', vapidKeys.publicKey);

// Configure VAPID details
webpush.setVapidDetails(
    'mailto:admin@dailytasks.local',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// In-memory storage for subscriptions (in production, use a database)
const subscriptions = new Map();

// Store subscription
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    const endpoint = subscription.endpoint;
    
    subscriptions.set(endpoint, subscription);
    console.log(`New subscription: ${endpoint.substring(0, 50)}...`);
    console.log(`Total subscriptions: ${subscriptions.size}`);
    
    res.status(200).json({ message: 'Subscribed successfully!' });
});

// Remove subscription
app.post('/unsubscribe', (req, res) => {
    const subscription = req.body;
    const endpoint = subscription.endpoint;
    
    subscriptions.delete(endpoint);
    console.log(`Unsubscribed: ${endpoint.substring(0, 50)}...`);
    
    res.status(200).json({ message: 'Unsubscribed successfully!' });
});

// Send notification to all subscribers
app.post('/send-notification', (req, res) => {
    const { title, message, tag } = req.body;
    
    if (subscriptions.size === 0) {
        return res.status(400).json({ error: 'No subscriptions available' });
    }
    
    const notificationPayload = JSON.stringify({
        title: title || 'إشعار جديد',
        body: message || 'لديك إشعار جديد',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: tag || 'general-notification',
        vibrate: [100, 50, 100],
        actions: [
            { action: 'open', title: 'فتح' },
            { action: 'close', title: 'إغلاق' }
        ]
    });
    
    const sendPromises = subscriptions.forEach((subscription) => {
        webpush.sendNotification(subscription, notificationPayload)
            .then(() => console.log('Notification sent successfully'))
            .catch((err) => {
                console.error('Error sending notification:', err.message);
                if (err.statusCode === 410) {
                    // Remove expired subscription
                    subscriptions.delete(subscription.endpoint);
                    console.log('Expired subscription removed');
                }
            });
    });
    
    res.status(200).json({ 
        message: 'Notifications sent',
        count: subscriptions.size 
    });
});

// Send notification to specific user
app.post('/notify', (req, res) => {
    const { endpoint, title, message } = req.body;
    
    if (!endpoint) {
        return res.status(400).json({ error: 'Endpoint required' });
    }
    
    const subscription = subscriptions.get(endpoint);
    
    if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' });
    }
    
    const notificationPayload = JSON.stringify({
        title: title || 'تذكير بالمهمة',
        body: message || 'لديك مهمة معلقة',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'task-reminder',
        vibrate: [100, 50, 100]
    });
    
    webpush.sendNotification(subscription, notificationPayload)
        .then(() => res.status(200).json({ message: 'Notification sent' }))
        .catch((err) => {
            console.error('Error:', err.message);
            res.status(500).json({ error: err.message });
        });
});

// Get VAPID public key for client
app.get('/vapid-public-key', (req, res) => {
    res.status(200).json({ publicKey: vapidKeys.publicKey });
});

// Check server status
app.get('/status', (req, res) => {
    res.status(200).json({ 
        status: 'running',
        subscriptions: subscriptions.size
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Open in browser: http://localhost:${PORT}/index.html`);
    console.log(`VAPID Public Key (for client): ${vapidKeys.publicKey}`);
});

