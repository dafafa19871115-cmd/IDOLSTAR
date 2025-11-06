/* firebase.js - ES module to initialize Firebase and export utilities
  Note: These values were taken from the original file you provided. Replace if needed.
*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getStorage, ref as storageRef, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging.js";

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD6spXAZxteQADlg7DUwwpLZbqTm4OR5QE",
  authDomain: "idolstar-fanclub.firebaseapp.com",
  projectId: "idolstar-fanclub",
  storageBucket: "idolstar-fanclub.firebasestorage.app",
  messagingSenderId: "630308306753",
  appId: "1:630308306753:web:2f82144d918fde262f2bc0"
};

export const VAPID_KEY = "REPLACE_WITH_YOUR_VAPID_KEY";

export const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
enableIndexedDbPersistence(db).catch(e=>console.warn('persistence:',e));
export const messaging = getMessaging(app);

export async function signupEmail(email,password){return createUserWithEmailAndPassword(auth,email,password);}
export async function loginEmail(email,password){return signInWithEmailAndPassword(auth,email,password);}
export async function anonymousLogin(){return signInAnonymously(auth);}
export async function doSignOut(){return signOut(auth);}

export function userDocRef(uid){return doc(db, `users/${uid}`);}
export async function setUserDoc(uid,data){return setDoc(userDocRef(uid), data, {merge:true});}
export function onUserSnapshot(uid, cb, errcb){return onSnapshot(userDocRef(uid), cb, errcb);}

export async function uploadAvatarToStorage(uid, dataUrl){
  const path = `avatars/${uid}-${Date.now()}.jpg`;
  const r = storageRef(storage, path);
  await uploadString(r, dataUrl, 'data_url');
  return await getDownloadURL(r);
}

export async function requestFcmToken(vapidKey){ return getToken(messaging, {vapidKey}); }
export function onFcmMessage(cb){ onMessage(messaging, cb); }
