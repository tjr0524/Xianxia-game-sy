(()=>{
'use strict';
const LOCAL_BUILD=window.__XIANXIA_BUILD__||'11.37.2';
let checking=false;
let lastCheck=0;

async function clearRuntimeCaches(){
  try{
    const keys=await caches.keys();
    await Promise.all(keys.map(key=>caches.delete(key)));
  }catch(_){ }
  try{
    if(navigator.serviceWorker?.controller){
      navigator.serviceWorker.controller.postMessage({type:'CLEAR_CACHES'});
    }
  }catch(_){ }
}

async function registerWorker(){
  if(!('serviceWorker' in navigator))return;
  try{
    const reg=await navigator.serviceWorker.register(`sw.js?v=${encodeURIComponent(LOCAL_BUILD)}`,{updateViaCache:'none'});
    await reg.update();
  }catch(error){
    console.warn('[update] service worker registration failed',error);
  }
}

async function checkForUpdate(force=false){
  const now=Date.now();
  if(checking)return;
  if(!force&&now-lastCheck<15000)return;
  checking=true;
  lastCheck=now;
  try{
    const res=await fetch(`version.json?ts=${now}`,{cache:'no-store',headers:{'Cache-Control':'no-cache'}});
    if(!res.ok)throw new Error(`version check failed: ${res.status}`);
    const data=await res.json();
    const latest=String(data.build||'').trim();
    if(!latest||latest===LOCAL_BUILD)return;

    console.info(`[update] ${LOCAL_BUILD} -> ${latest}`);
    await clearRuntimeCaches();
    const url=new URL(location.href);
    url.searchParams.set('__build',latest);
    url.searchParams.set('__refresh',Date.now().toString(36));
    location.replace(url.toString());
  }catch(error){
    console.warn('[update] version check skipped',error);
  }finally{
    checking=false;
  }
}

registerWorker().then(()=>checkForUpdate(true));
window.addEventListener('pageshow',()=>checkForUpdate(true));
window.addEventListener('focus',()=>checkForUpdate(false));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkForUpdate(true)});
window.__xianxiaUpdateGuard={build:LOCAL_BUILD,check:()=>checkForUpdate(true)};
})();
