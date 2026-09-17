(()=>{
'use strict';
const LOCAL_BUILD=String(window.__XIANXIA_BUILD__||'').trim()||'unknown';
let canonicalBuild=LOCAL_BUILD;
let checking=false;
let lastCheck=0;
let badgeObserver=null;
let pendingBuild='';

function pinBuildBadge(){
  const el=document.querySelector('#buildVersion');
  if(!el)return;
  const wanted=canonicalBuild&&canonicalBuild!=='unknown'?`BUILD ${canonicalBuild}`:el.textContent;
  if(wanted&&el.textContent!==wanted)el.textContent=wanted;
}

function installBuildBadgeLock(){
  pinBuildBadge();
  if(badgeObserver)return;
  const root=document.documentElement||document;
  badgeObserver=new MutationObserver(()=>pinBuildBadge());
  badgeObserver.observe(root,{subtree:true,childList:true,characterData:true});
}

function cleanLegacyRefreshParams(){
  try{
    const url=new URL(location.href);
    let changed=false;
    for(const key of ['__build','__refresh']){
      if(url.searchParams.has(key)){url.searchParams.delete(key);changed=true}
    }
    if(changed)history.replaceState(history.state,'',url.pathname+url.search+url.hash);
  }catch(_){ }
}

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
    // A paused/blank manifest must never redirect a live game. Previous builds used
    // location.replace here, which could interrupt a run and loop on stale Safari data.
    if(data.paused||!latest)return;
    if(latest===LOCAL_BUILD){
      canonicalBuild=latest;
      window.__XIANXIA_BUILD__=latest;
      pinBuildBadge();
      return;
    }
    pendingBuild=latest;
    window.__XIANXIA_PENDING_BUILD__=latest;
    console.info(`[update] ${LOCAL_BUILD} -> ${latest} available; deferred until manual reload`);
    // Deliberately do not reload automatically. An expedition must never be interrupted
    // by deployment/version checks. Fresh code is picked up on the user's next reload.
  }catch(error){
    console.warn('[update] version check skipped',error);
  }finally{
    checking=false;
  }
}

cleanLegacyRefreshParams();
installBuildBadgeLock();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installBuildBadgeLock,{once:true});
registerWorker().then(()=>checkForUpdate(true));
window.addEventListener('pageshow',()=>checkForUpdate(true));
window.addEventListener('focus',()=>checkForUpdate(false));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkForUpdate(true)});
window.__xianxiaUpdateGuard={
  build:LOCAL_BUILD,
  check:()=>checkForUpdate(true),
  pinBuildBadge,
  clearCaches:clearRuntimeCaches,
  get pendingBuild(){return pendingBuild}
};
})();
