(()=>{
'use strict';
if(window.__xianxiaLightVisualVersion==='11.24')return;
window.__xianxiaLightVisualVersion='11.24';

function boot(){
  document.documentElement.dataset.visualVersion='11.24';
  document.body.classList.add('v24-theme');
  const theme=document.querySelector('#v1124-theme');
  if(theme)document.head.appendChild(theme);
  const kicker=document.querySelector('.v23-kicker');
  if(kicker)kicker.textContent='水墨 비경도';
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();
