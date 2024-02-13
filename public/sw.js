// sw.js

self.addEventListener('push', function(event) {
    const options = {
      body: event.data.text(),
      icon: 'favicon.png',
      requireInteraction: true
    };
  
    event.waitUntil(
      self.registration.showNotification('Test Notification', options)
    );
  });
  