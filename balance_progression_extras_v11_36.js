(()=>{
'use strict';
const VERSION='11.49.0',W=1800,H=2400;
const IOS_WEBKIT=/iP(?:hone|ad|od)/.test(navigator.userAgent)&&/WebKit/i.test(navigator.userAgent);
function load(path){const x=new XMLHttpRequest();x.open('GET',path+'?v='+encodeURIComponent(VERSION),false);x.send(null);if(!((x.status>=200&&x.status<300)||x.status===0))throw new Error(path+' load failed: '+x.status);return x.responseText}
function once(src,from,to,label){const i=src.indexOf(from);if(i<0)throw new Error('extras balance patch missing: '+label);return src.slice(0,i)+to+src.slice(i+from.length)}
try{
 let src=load('progression_extras_v11_32.js');
 src=src.replace(/const EXTRA=\[[\s\S]*?\n\];\nconst POS=/,`const EXTRA=[];\nconst POS=`);
 src=once(src,'c.width=700;c.height=460;',`c.width=${IOS_WEBKIT?3:W};c.height=${IOS_WEBKIT?4:H};`,'gather canvas');
 src=once(src,"x.clearRect(0,0,700,460);if(s.phase==='run')for","if(s.phase!=='run'){requestAnimationFrame(drawGatherRings);return}x.clearRect(0,0,700,460);for",'idle gather skip');
 src=once(src,'x.clearRect(0,0,700,460);',`x.clearRect(0,0,${W},${H});`,'gather clear');
 (0,eval)(src+'\n//# sourceURL=progression_extras_v11_32.balance.js');
 window.__xianxiaProgressionExtrasBalanceVersion=VERSION;
}catch(error){console.error(error);const e=document.querySelector('#buildVersion');if(e)e.textContent='BUILD '+VERSION+' · EXTRA BAL ERR'}
})();
