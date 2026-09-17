(()=>{
'use strict';
const VERSION='11.34.0',W=1120,H=1200;
function load(path){const x=new XMLHttpRequest();x.open('GET',`${path}?v=${encodeURIComponent(VERSION)}`,false);x.send(null);if(!((x.status>=200&&x.status<300)||x.status===0))throw new Error(`${path} load failed: ${x.status}`);return x.responseText}
function once(src,from,to,label){const i=src.indexOf(from);if(i<0)throw new Error(`progression patch missing: ${label}`);return src.slice(0,i)+to+src.slice(i+from.length)}
try{
  let src=load('progression_extras_v11_32.js');
  src=once(src,`c.width=700;c.height=460;`,`c.width=${W};c.height=${H};`,'gather canvas');
  src=once(src,`x.clearRect(0,0,700,460);`,`x.clearRect(0,0,${W},${H});`,'gather clear');
  (0,eval)(`${src}\n//# sourceURL=progression_extras_v11_32.worldscale.js`);
}catch(error){console.error(error);const e=document.querySelector('#buildVersion');if(e)e.textContent=`BUILD ${VERSION} · PROG ERR`}
})();