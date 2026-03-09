const webpush = require('web-push');

const keys = webpush.generateVapidKeys();

console.log('=== VAPID Keys ===');
console.log('Public Key:');
console.log(keys.publicKey);
console.log('\nPrivate Key:');
console.log(keys.privateKey);
console.log('\n=== Add these to server.js ===');
console.log(`VAPID_PUBLIC_KEY = '${keys.publicKey}'`);
console.log(`VAPID_PRIVATE_KEY = '${keys.privateKey}'`);

