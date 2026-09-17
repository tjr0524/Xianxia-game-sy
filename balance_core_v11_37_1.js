(()=>{
'use strict';
const PATCH_VERSION='11.37.3';
const BASE='balance_core_v11_37.js';
window.__XIANXIA_BUILD__=PATCH_VERSION;
function load(path,version=PATCH_VERSION){
  const x=new XMLHttpRequest();
  x.open('GET',`${path}?v=${encodeURIComponent(version)}&ts=${Date.now()}`,false);
  x.setRequestHeader('Cache-Control','no-cache');
  x.send(null);
  if(!((x.status>=200&&x.status<300)||x.status===0))throw new Error(`${path} load failed: ${x.status}`);
  return x.responseText;
}
try{
  try{(0,eval)(load('update_guard.js')+'\n//# sourceURL=update_guard.runtime.js')}catch(updateError){console.warn('[update] guard load failed',updateError)}
  const src=load(BASE);
  (0,eval)(src+'\n//# sourceURL=balance_core_v11_37_3.runtime.js');
  const e=document.querySelector('#buildVersion');if(e)e.textContent=`BUILD ${PATCH_VERSION}`;
  window.__xianxiaEncounterHotfix={version:PATCH_VERSION,compatEntrypoint:'11.37.1'};
}catch(error){
  console.error(error);
  const e=document.querySelector('#buildVersion');if(e)e.textContent=`BUILD ${PATCH_VERSION}`;
}
})();
