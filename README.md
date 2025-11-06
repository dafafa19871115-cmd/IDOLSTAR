IDOLSTAR — Pro (Vercel deployable)
==================================

Contents:
- index.html
- firebase.js
- main.js
- service-worker.js
- firebase-messaging-sw.js
- admin.html (Admin UI - replace ADMIN_UID)
- firestore.rules (suggested rules)
- vercel.json (Vercel config)

Quick steps to deploy on Vercel:
1. Unzip this package.
2. Edit firebase.js: replace VAPID_KEY with your FCM VAPID key if you want web push.
3. (Optional) Edit admin.html: replace ADMIN_UID with the UID of your admin user.
4. Go to https://vercel.com → New Project → Import (Deploy manually) → Upload the folder root.
5. Deploy. After live, make sure your Firebase Console has Authentication/Firestore/Storage/Cloud Messaging enabled.
6. In Firebase Console -> Firestore -> Rules, paste the contents of firestore.rules (and modify ADMIN UID logic if desired).
7. For FCM to work, ensure firebase-messaging-sw.js is served from the root of your domain (Vercel will do this if file is in project root).

Notes:
- This package uses client-side Storage uploads and Firestore. For production, tighten security rules and consider server-side validation.
- If you want me to automatically inject your Firebase Config and VAPID key into the files, paste them here and I will rebuild the ZIP for you.
