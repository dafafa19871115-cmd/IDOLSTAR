import * as fb from './firebase.js';
const system = document.getElementById('system');
const authStatus = document.getElementById('auth-status');
const profileSection = document.getElementById('profile-section');
const notificationSection = document.getElementById('notification-section');
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const anonBtn = document.getElementById('anon-btn');
const logoutBtn = document.getElementById('logout-btn');
const displayNickname = document.getElementById('display-nickname');
const displayFav = document.getElementById('display-fav');
const nicknameInput = document.getElementById('nickname');
const favInput = document.getElementById('fav_idol');
const profileForm = document.getElementById('profile-form');
const avatarFile = document.getElementById('avatar-file');
const avatarImg = document.getElementById('avatar-img');
const fcmStatus = document.getElementById('fcm-status');
const fcmEnable = document.getElementById('fcm-enable');
let currentUid = null; let unsubscribeSnapshot = null;
function setSystem(msg, err=false){ system.textContent=msg; system.style.color = err ? 'crimson' : ''; }
fb.auth.onAuthStateChanged(async (user)=>{
  if(user){ currentUid=user.uid; authStatus.textContent=`已登入: ${currentUid.substring(0,8)}...`; profileSection.classList.remove('hidden'); notificationSection.classList.remove('hidden');
    if(unsubscribeSnapshot) unsubscribeSnapshot();
    unsubscribeSnapshot = fb.onUserSnapshot(currentUid, snap=>{
      if(snap.exists()){ const data=snap.data(); displayNickname.textContent=data.nickname||'-'; displayFav.textContent=data.fav_idol? '最喜歡：'+data.fav_idol : '最喜歡：-'; nicknameInput.value=data.nickname||''; favInput.value=data.fav_idol||''; if(data.avatarStorageUrl) avatarImg.src=data.avatarStorageUrl; else if(data.avatar) avatarImg.src=data.avatar; }
      else setSystem('尚無個人檔案，請填寫', false);
    }, err=> setSystem('監聽錯誤: '+err.message, true));
  } else { currentUid=null; authStatus.textContent='未登入'; profileSection.classList.add('hidden'); notificationSection.classList.add('hidden'); if(unsubscribeSnapshot) unsubscribeSnapshot(); }
});
signupForm.addEventListener('submit', async e=>{ e.preventDefault(); const email=document.getElementById('signup-email').value; const pw=document.getElementById('signup-pw').value; try{ await fb.signupEmail(email,pw); setSystem('註冊成功'); }catch(err){ setSystem('註冊失敗: '+(err.message||err), true); } });
loginForm.addEventListener('submit', async e=>{ e.preventDefault(); const email=document.getElementById('login-email').value; const pw=document.getElementById('login-pw').value; try{ await fb.loginEmail(email,pw); setSystem('登入成功'); }catch(err){ setSystem('登入失敗: '+(err.message||err), true); } });
anonBtn.addEventListener('click', async ()=>{ try{ await fb.anonymousLogin(); setSystem('已匿名登入'); }catch(e){ setSystem('匿名登入失敗: '+e.message, true); } });
logoutBtn && logoutBtn.addEventListener('click', async ()=>{ try{ await fb.doSignOut(); setSystem('已登出'); }catch(e){ setSystem('登出失敗', true); } });
profileForm.addEventListener('submit', async e=>{ e.preventDefault(); if(!currentUid) return setSystem('未登入', true); const nickname=nicknameInput.value.trim(); const fav=favInput.value.trim(); try{ await fb.setUserDoc(currentUid, { nickname, fav_idol: fav, updatedAt: new Date().toISOString() }); setSystem('個人檔案已儲存'); }catch(e){ setSystem('儲存失敗: '+e.message, true); } });
avatarFile && avatarFile.addEventListener('change', async e=>{ const f=e.target.files?.[0]; if(!f) return; if(f.size>2*1024*1024) return setSystem('請上傳小於 2MB 的圖片', true); const reader=new FileReader(); reader.onload=async ()=>{ const dataUrl=reader.result; try{ const url=await fb.uploadAvatarToStorage(currentUid, dataUrl); await fb.setUserDoc(currentUid, { avatarStorageUrl: url, updatedAt: new Date().toISOString() }); setSystem('頭像已上傳'); }catch(err){ setSystem('頭像上傳失敗: '+(err.message||err), true); } }; reader.readAsDataURL(f); });
fcmEnable && fcmEnable.addEventListener('click', async ()=>{ if(!currentUid) return setSystem('請先登入', true); try{ const token = await fb.requestFcmToken(); await fb.setUserDoc(currentUid, { fcmToken: token, fcmEnabled: true }); fcmStatus.textContent='已啟用'; setSystem('推播已啟用'); }catch(e){ setSystem('無法啟用推播: '+(e.message||e), true); } });
const themeBtn=document.getElementById('theme-toggle'); themeBtn && themeBtn.addEventListener('click', ()=>{ document.documentElement.classList.toggle('dark'); });
if('serviceWorker' in navigator){ window.addEventListener('load', async ()=>{ try{ await navigator.serviceWorker.register('/service-worker.js'); await navigator.serviceWorker.register('/firebase-messaging-sw.js'); }catch(e){ console.warn('SW register failed', e); } }); }
fb.onFcmMessage && fb.onFcmMessage(payload=> setSystem('收到推播: '+(payload?.notification?.title || '通知')));
