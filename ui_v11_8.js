(()=>{
'use strict';
function load13(){
  if(window.__xianxiaUiVersion==='11.13'||document.querySelector('script[data-v1113-ui]'))return;
  const s=document.createElement('script');
  s.src='ui_v11_13.js?v=11.13.1';
  s.dataset.v1113Ui='1';
  s.async=false;
  document.head.appendChild(s);
}
if(window.__xianxiaProgression?.version==='11.11'){
  load13();
  return;
}
if(document.querySelector('script[data-v1111-main]')){
  const wait=setInterval(()=>{
    if(window.__xianxiaProgression?.version==='11.11'){
      clearInterval(wait);
      load13();
    }
  },30);
  setTimeout(()=>clearInterval(wait),5000);
  return;
}
const s=document.createElement('script');
s.src='progression_v11_11.js?v=11.11.1';
s.dataset.v1111Main='1';
s.async=false;
s.onload=()=>{
  document.querySelector('#trainProgViewport')?.closest('.prog-section')?.remove();
  document.querySelector('#stagePathViewport')?.closest('.stagepath-section')?.remove();
  load13();
};
document.head.appendChild(s);
})();