// sw.js — Service Worker for 每小時回顧 PWA
const CACHE = 'hourly-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  clients.claim();
});

// Receive alarm trigger from main page
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'HOUR_ALARM') {
    const hour = e.data.hour;
    self.registration.showNotification('整點到了 🔔', {
      body: `${String(hour).padStart(2,'0')}:00 — 這一小時過得怎麼樣？點此記錄`,
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="%232c2416"/><text x="32" y="46" font-size="36" text-anchor="middle">🕐</text></svg>',
      badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="%232c2416"/><text x="32" y="46" font-size="36" text-anchor="middle">🕐</text></svg>',
      vibrate: [200, 100, 200, 100, 400],
      requireInteraction: true,
      tag: 'hour-alarm',
      renotify: true,
      data: { url: self.registration.scope }
    });
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      if (list.length > 0) {
        list[0].focus();
        list[0].postMessage({ type: 'OPEN_FORM' });
      } else {
        clients.openWindow(e.notification.data.url || './');
      }
    })
  );
});
