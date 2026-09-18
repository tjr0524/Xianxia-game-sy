(()=>{
'use strict';
const VERSION='11.49.1-test6';
const SAVE_KEY='xianxia_proto_v11';
let persistedBasic=null;
try{
  const raw=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');
  if(raw?.skills?.basic&&typeof raw.skills.basic==='object')persistedBasic={...raw.skills.basic};
}catch(error){
  console.warn('[flat-runtime] basic snapshot failed',error);
}
function restoreBasic(attempt=0){
  if(!persistedBasic)return true;
  const D=window.__xianxiaDebug;
  const P=window.__xianxiaProgression;
  if((!D||!P)&&attempt<30){
    setTimeout(()=>restoreBasic(attempt+1),0);
    return false;
  }
  if(!D)return false;
  try{
    const snap=D.snapshot();
    const M=snap?.M;
    if(!M)return false;
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
    persistedBasic=null;
    return true;
  }catch(error){
    console.warn('[flat-runtime] basic restore failed',error);
    return false;
  }
}
window.__xianxiaFlatPreflight={version:VERSION,restoreBasic};
})();
