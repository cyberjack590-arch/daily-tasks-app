// Service Worker for Daily Tasks PWA
const CACHE_NAME = 'daily-tasks-v3';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './favicon.svg',
    './icon-192.png',
    './icon-512.png',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching assets');
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests except for fonts and CDN
    if (!event.request.url.startsWith(self.location.origin) &&
        !event.request.url.includes('fonts.googleapis.com') &&
        !event.request.url.includes('fonts.gstatic.com') &&
        !event.request.url.includes('cdn.jsdelivr.net')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                
                return fetch(event.request).then((response) => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
            .catch(() => {
                return new Response('لا يوجد اتصال بالإنترنت', {
                    status: 503,
                    statusText: 'Service Unavailable'
                });
            })
    );
});

// Push notification event - for server push notifications
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push event received');
    
    let data = {};
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data = { body: event.data.text() };
        }
    }

    const options = {
        body: data.body || 'لديك إشعار جديد',
        icon: './icon-192.png',
        badge: './icon-192.png',
        vibrate: [100, 50, 100, 50, 200],
        data: {
            url: data.url || './index.html',
            dateOfArrival: Date.now()
        },
        actions: [
            { action: 'open', title: 'فتح التطبيق' },
            { action: 'close', title: 'إغلاق' }
        ],
        tag: data.tag || 'push-notification',
        renotify: true,
        requireInteraction: data.requireInteraction || false
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'المهام اليومية', options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked');
    event.notification.close();

    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || './index.html')
        );
    }
});

// Background sync for task reminders
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered:', event.tag);
    
    if (event.tag === 'check-task-reminders') {
        event.waitUntil(checkTaskReminders());
    }
});

// Check task reminders in background
async function checkTaskReminders() {
    try {
        // Get all clients
        const clients = await self.clients.matchAll();
        
        if (clients.length > 0) {
            // Send message to all open clients to check reminders
            clients.forEach(client => {
                client.postMessage({
                    type: 'CHECK_REMINDERS',
                    timestamp: Date.now()
                });
            });
        }
    } catch (error) {
        console.error('Error in background sync:', error);
    }
}

// Handle messages from the main app
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received:', event.data);
    
    if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
        // Schedule a notification using setTimeout in service worker
        const { title, body, delay, tag } = event.data;
        
        if (delay && delay > 0) {
            setTimeout(() => {
                self.registration.showNotification(title, {
                    body: body,
                    icon: './icon-192.png',
                    badge: './icon-192.png',
                    tag: tag || 'scheduled-notification',
                    vibrate: [100, 50, 100],
                    requireInteraction: false
                });
            }, delay);
        }
    }
    
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        // Show notification immediately
        const { title, body, tag, requireInteraction } = event.data;
        
        self.registration.showNotification(title, {
            body: body,
            icon: './icon-192.png',
            badge: './icon-192.png',
            tag: tag || 'app-notification',
            vibrate: [100, 50, 100],
            requireInteraction: requireInteraction || false
        });
    }
});

console.log('Service Worker: Loaded');

