(()=>{
'use strict';
const P=window.__xianxiaProgression;if(P)P.version='11.9-compat';
if(document.querySelector('script[data-v119-ui]'))return;
const s=document.createElement('script');
s.src='ui_v11_9.js?v=11.9';
s.dataset.v119Ui='1';
s.async=false;
document.head.appendChild(s);
})();