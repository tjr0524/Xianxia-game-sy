(()=>{
'use strict';
if(window.__xianxiaProgression?.version==='11.11')return;
if(document.querySelector('script[data-v1111-main]'))return;
const s=document.createElement('script');
s.src='progression_v11_11.js?v=11.11.1';
s.dataset.v1111Main='1';
s.async=false;
s.onload=()=>{
  document.querySelector('#trainProgViewport')?.closest('.prog-section')?.remove();
  document.querySelector('#stagePathViewport')?.closest('.stagepath-section')?.remove();
};
document.head.appendChild(s);
})();
