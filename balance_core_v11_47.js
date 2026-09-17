(()=>{
'use strict';
const VERSION='11.47.0';
function load(path){
  const x=new XMLHttpRequest();
  x.open('GET',`${path}?v=${encodeURIComponent(VERSION)}&ts=${Date.now()}`,false);
  x.setRequestHeader('Cache-Control','no-cache');
  x.send(null);
  if(!((x.status>=200&&x.status<300)||x.status===0))throw new Error(`${path} load failed: ${x.status}`);
  return x.responseText;
}
function once(src,from,to,label){
  const i=src.indexOf(from);
  if(i<0)throw new Error(`v11.47 wrapper missing: ${label}`);
  if(src.indexOf(from,i+from.length)>=0)throw new Error(`v11.47 wrapper duplicate: ${label}`);
  return src.slice(0,i)+to+src.slice(i+from.length);
}
try{
  let src=load('balance_core_v11_37.js');
  // Propagate a fresh version through the nested balance loader so its synchronous
  // XHRs also fetch the updated world-scale/herb spatial patch instead of a cached copy.
  src=once(src,"const PATCH_VERSION='11.37.2';","const PATCH_VERSION='11.47.0';",'outer version');
  src=once(src,"src=once(src,\"const PATCH_VERSION='11.36.0';\",\"const PATCH_VERSION='11.37.2';\",'version');","src=once(src,\"const PATCH_VERSION='11.36.0';\",\"const PATCH_VERSION='11.47.0';\",'version');",'nested version');
  (0,eval)(src+'\n//# sourceURL=balance_core_v11_47.runtime.js');
  window.__xianxiaBalanceWrapper={version:VERSION,herbSpatialFix:true};
}catch(error){
  console.error(error);
  const e=document.querySelector('#buildVersion');
  if(e)e.textContent=`BUILD ${VERSION} · BAL LOAD ERR`;
}
})();