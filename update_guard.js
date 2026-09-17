(()=>{
'use strict';
const LOCAL_BUILD=String(window.__XIANXIA_BUILD__||'').trim()||'unknown';
const IOS_WEBKIT=/iP(?:hone|ad|od)/.test(navigator.userAgent)&&/WebKit/i.test(navigator.userAgent);

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

function loadIosStability(){
  if(!IOS_WEBKIT||window.__xianxiaIosStability)return;
  if(document.querySelector('script[data-ios-stability-48]'))return;
  const s=document.createElement('script');
  s.dataset.iosStability48='1';
  s.src='ios_stability_v11_48.js?v=11.48.1';
  s.async=true;
  s.onerror=()=>console.warn('[ios-stability] bootstrap failed');
  document.head.appendChild(s);
}

cleanLegacyRefreshParams();
retireLegacyUpdater();
loadIosStability();
window.__XIANXIA_PENDING_BUILD__='';
window.__xianxiaUpdateGuard={
  build:LOCAL_BUILD,
  disabled:true,
  autoReload:false,
  check:()=>Promise.resolve(false),
  retire:retireLegacyUpdater
};
})();
