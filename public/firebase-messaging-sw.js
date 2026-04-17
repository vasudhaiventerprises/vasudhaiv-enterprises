// Firebase Service Worker — must use importScripts, NOT ES module imports
// Service workers can't use `import` statements

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'Vasudhaiv Solar';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification.',
    icon: '/logo.png',
    badge: '/logo.png',
    data: { url: payload.data?.url || '/' }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard';
  event.waitUntil(clients.openWindow(url));
});
