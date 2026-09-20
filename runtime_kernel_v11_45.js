(()=>{
'use strict';

const BUILD='11.51.33';
const SESSION_KEY='xianxia_runtime_safety_11_49_9_test';

function setCanonicalBuild(){
  try{
    Object.defineProperty(window,'__XIANXIA_BUILD__',{
      configurable:true,
      enumerable:true,
      get(){return BUILD},
      set(_value){}
    });
  }catch(_){
    window.__XIANXIA_BUILD__=BUILD;
  }
}

function pinBuildBadge(){
  const badge=document.querySelector('#buildVersion');
  if(badge&&badge.textContent!==`BUILD ${BUILD}`)badge.textContent=`BUILD ${BUILD}`;
}

function cleanLegacyRefreshParams(){
  try{
    const url=new URL(location.href);
    let changed=false;
    for(const key of ['__build','__refresh']){
      if(url.searchParams.has(key)){url.searchParams.delete(key);changed=true}
    }
    if(changed)history.replaceState(history.state,'',url.pathname+url.search+url.hash);
  }catch(_){}
}

async function retireLegacyWorkers(){
  try{
    if('serviceWorker' in navigator){
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(reg=>reg.unregister()));
    }
  }catch(error){
    console.warn('[runtime] service worker retirement skipped',error);
  }
  try{
    const keys=await caches.keys();
    await Promise.all(keys.map(key=>caches.delete(key)));
  }catch(_){}
}

setCanonicalBuild();
cleanLegacyRefreshParams();
pinBuildBadge();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',pinBuildBadge,{once:true});

try{
  if(sessionStorage.getItem(SESSION_KEY)!=='1'){
    sessionStorage.setItem(SESSION_KEY,'1');
    retireLegacyWorkers();
  }
}catch(_){
  retireLegacyWorkers();
}

window.__xianxiaRuntime={
  build:BUILD,
  updateMode:'manual',
  autoReload:false,
  pinBuildBadge,
  retireLegacyWorkers
};
})();
