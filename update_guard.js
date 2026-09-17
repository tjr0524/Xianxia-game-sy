(()=>{
'use strict';
const LOCAL_BUILD=String(window.__XIANXIA_BUILD__||'').trim()||'unknown';

function pinBuildBadge(){
  const el=document.querySelector('#buildVersion');
  if(!el||LOCAL_BUILD==='unknown')return;
  const wanted=`BUILD ${LOCAL_BUILD}`;
  if(el.textContent!==wanted)el.textContent=wanted;
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

async function retireLegacyUpdater(){
  // Auto-update/reload is intentionally disabled. A deployment must never interrupt
  // an expedition. New code is picked up only when the player manually reloads/reopens.
  try{
    if('serviceWorker' in navigator){
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(reg=>reg.unregister()));
    }
  }catch(error){
    console.warn('[update] service worker retirement skipped',error);
  }
  try{
    const keys=await caches.keys();
    await Promise.all(keys.map(key=>caches.delete(key)));
  }catch(_){ }
}

cleanLegacyRefreshParams();
pinBuildBadge();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',pinBuildBadge,{once:true});
retireLegacyUpdater();

window.__XIANXIA_PENDING_BUILD__='';
window.__xianxiaUpdateGuard={
  build:LOCAL_BUILD,
  disabled:true,
  autoReload:false,
  check:()=>Promise.resolve(false),
  pinBuildBadge,
  retire:retireLegacyUpdater
};
})();
