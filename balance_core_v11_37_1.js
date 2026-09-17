(()=>{
'use strict';
const PATCH_VERSION='11.37.3';
const BASE='balance_core_v11_37.js';
const SAVE_KEY='xianxia_proto_v11';
window.__XIANXIA_BUILD__=PATCH_VERSION;

function load(path,version=PATCH_VERSION){
  const x=new XMLHttpRequest();
  x.open('GET',`${path}?v=${encodeURIComponent(version)}&ts=${Date.now()}`,false);
  x.setRequestHeader('Cache-Control','no-cache');
  x.send(null);
  if(!((x.status>=200&&x.status<300)||x.status===0))throw new Error(`${path} load failed: ${x.status}`);
  return x.responseText;
}

// Core loadState() builds its initial skill table before progression registers the
// synthetic "basic" skill. Capture it before core boot can normalize/save it away.
let persistedBasic=null;
try{
  const raw=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');
  if(raw?.skills?.basic&&typeof raw.skills.basic==='object'){
    persistedBasic={...raw.skills.basic};
  }
}catch(error){
  console.warn('[save-fix] basic snapshot failed',error);
}

function restorePersistedBasic(attempt=0){
  if(!persistedBasic)return;
  const D=window.__xianxiaDebug;
  const P=window.__xianxiaProgression;
  if((!D||!P)&&attempt<30){
    setTimeout(()=>restorePersistedBasic(attempt+1),0);
    return;
  }
  if(!D)return;
  try{
    const snap=D.snapshot();
    const M=snap?.M;
    if(!M)return;
    M.skills||={};
    const current=M.skills.basic||{};
    M.skills.basic={
      u:1,
      pow:Math.max(+current.pow||0,+persistedBasic.pow||0),
      range:Math.max(+current.range||0,+persistedBasic.range||0),
      cycle:Math.max(+current.cycle||0,+persistedBasic.cycle||0),
      ...persistedBasic,
      u:1
    };
    D.replaceState(M);
    console.info('[save-fix] restored basic attack progression',M.skills.basic);
    persistedBasic=null;
  }catch(error){
    console.warn('[save-fix] basic restore failed',error);
  }
}

try{
  try{(0,eval)(load('update_guard.js')+'\n//# sourceURL=update_guard.runtime.js')}catch(updateError){console.warn('[update] guard load failed',updateError)}
  const src=load(BASE);
  (0,eval)(src+'\n//# sourceURL=balance_core_v11_37_3.runtime.js');
  setTimeout(()=>restorePersistedBasic(),0);
  const e=document.querySelector('#buildVersion');if(e)e.textContent=`BUILD ${PATCH_VERSION}`;
  window.__xianxiaEncounterHotfix={version:PATCH_VERSION,compatEntrypoint:'11.37.1',basicSaveFix:true};
}catch(error){
  console.error(error);
  const e=document.querySelector('#buildVersion');if(e)e.textContent=`BUILD ${PATCH_VERSION}`;
}
})();
