(()=>{
'use strict';
function load13(){
  if(window.__xianxiaUiVersion==='11.13'||document.querySelector('script[data-v1113-ui]'))return;
  const n=document.createElement('script');n.src='ui_v11_13.js?v=11.13.1';n.dataset.v1113Ui='1';n.async=false;document.head.appendChild(n);
}
if(window.__xianxiaProgression?.version==='11.11'){load13();return}
if(document.querySelector('script[data-v1111-main]')){const w=setInterval(()=>{if(window.__xianxiaProgression?.version==='11.11'){clearInterval(w);load13()}},30);setTimeout(()=>clearInterval(w),5000);return}
const s=document.createElement('script');s.src='progression_v11_11.js?v=11.11.1';s.dataset.v1111Main='1';s.async=false;s.onload=load13;document.head.appendChild(s);
})();