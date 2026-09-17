(()=>{
'use strict';
const PATCH_VERSION='11.37.1';
const BASE='balance_core_v11_37.js';
function load(path){const x=new XMLHttpRequest();x.open('GET',`${path}?v=${encodeURIComponent(PATCH_VERSION)}`,false);x.send(null);if(!((x.status>=200&&x.status<300)||x.status===0))throw new Error(`${path} load failed: ${x.status}`);return x.responseText}
function once(src,from,to,label){const i=src.indexOf(from);if(i<0)throw new Error(`encounter hotfix missing: ${label}`);if(src.indexOf(from,i+from.length)>=0)throw new Error(`encounter hotfix duplicate: ${label}`);return src.slice(0,i)+to+src.slice(i+from.length)}
try{
  let src=load(BASE);
  src=once(src,"const PATCH_VERSION='11.37.0';","const PATCH_VERSION='11.37.1';",'version');
  src=once(src,"return randomPoint(100)","return{x:100+Math.random()*(W-200),y:100+Math.random()*(H-200)}",'pack fallback');
  src=src.replaceAll('11.37.0','11.37.1');
  (0,eval)(src+'\n//# sourceURL=balance_core_v11_37_1.transformed.js');
  const e=document.querySelector('#buildVersion');if(e)e.textContent=`BUILD ${PATCH_VERSION} · BALANCE`;
  window.__xianxiaEncounterHotfix={version:PATCH_VERSION};
}catch(error){console.error(error);const e=document.querySelector('#buildVersion');if(e)e.textContent=`BUILD ${PATCH_VERSION} · ENC ERR`}
})();