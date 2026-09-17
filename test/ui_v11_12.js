(()=>{
'use strict';
if(window.__xianxiaUiVersion==='11.13')return;
if(document.querySelector('script[data-v1113-ui]'))return;
const s=document.createElement('script');
s.src='ui_v11_13.js?v=11.13.1';
s.dataset.v1113Ui='1';
s.async=false;
document.head.appendChild(s);
})();