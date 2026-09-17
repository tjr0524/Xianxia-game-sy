(()=>{
'use strict';
const LOCAL_BUILD=String(window.__XIANXIA_BUILD__||'').trim()||'unknown';

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
  try{
    if('serviceWorker' in navigator){
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(reg=>reg.unregister()));
    }
  }catch(error){console.warn('[update] service worker retirement skipped',error)}
  try{
    const keys=await caches.keys();
    await Promise.all(keys.map(key=>caches.delete(key)));
  }catch(_){ }
}

cleanLegacyRefreshParams();
retireLegacyUpdater();
// iOS stability is loaded exactly once by the core loader after __xianxiaDebug exists.
// Do not dynamically inject another copy here: old copies keep their RAF loop alive.
window.__XIANXIA_PENDING_BUILD__='';
window.__xianxiaUpdateGuard={
  build:LOCAL_BUILD,
  disabled:true,
  autoReload:false,
  check:()=>Promise.resolve(false),
  retire:retireLegacyUpdater
};
})();
