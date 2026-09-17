(()=>{
'use strict';

const BUILD=String(window.__xianxiaRuntime?.build||window.__XIANXIA_BUILD__||'11.45.0');
let pendingBuild='';

async function check(){
  try{
    const res=await fetch(`version.json?ts=${Date.now()}`,{cache:'no-store',headers:{'Cache-Control':'no-cache'}});
    if(!res.ok)return false;
    const data=await res.json();
    const latest=String(data.build||'').trim();
    if(data.paused||!latest||latest===BUILD){
      pendingBuild='';
      window.__XIANXIA_PENDING_BUILD__='';
      return false;
    }
    pendingBuild=latest;
    window.__XIANXIA_PENDING_BUILD__=latest;
    return true;
  }catch(error){
    console.warn('[update] manual check skipped',error);
    return false;
  }
}

window.__XIANXIA_PENDING_BUILD__='';
window.__xianxiaUpdateGuard={
  build:BUILD,
  disabled:true,
  autoReload:false,
  get pendingBuild(){return pendingBuild},
  check,
  pinBuildBadge:()=>window.__xianxiaRuntime?.pinBuildBadge?.()
};
})();