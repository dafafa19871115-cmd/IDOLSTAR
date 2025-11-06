importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging.js');
const firebaseConfig = {
  apiKey: "AIzaSyD6spXAZxteQADlg7DUwwpLZbqTm4OR5QE",
  authDomain: "idolstar-fanclub.firebaseapp.com",
  projectId: "idolstar-fanclub",
  storageBucket: "idolstar-fanclub.firebasestorage.app",
  messagingSenderId: "630308306753",
  appId: "1:630308306753:web:2f82144d918fde262f2bc0"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function(payload) {
  const title = payload.notification?.title || 'IDOLSTAR';
  const options = { body: payload.notification?.body || '', icon: '/icons/icon-192.png' };
  self.registration.showNotification(title, options);
});
