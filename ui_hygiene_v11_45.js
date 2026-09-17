(()=>{
'use strict';
const VERSION='11.50.2';
if(window.__xianxiaUiHygiene?.version===VERSION)return;
window.__xianxiaUiHygiene={version:VERSION,globalObserver:false};

function closeCandidates(detail){
  if(!detail)return[];
  return [...detail.querySelectorAll('button')].filter(button=>{
    const text=(button.textContent||'').trim();
    return button.classList.contains('detail-close38')||button.getAttribute('aria-label')==='상세정보 닫기'||text==='×';
  });
}
function normalizeDetail(detail){
  const buttons=closeCandidates(detail);
  if(buttons.length<2)return;
  const keep=buttons.find(button=>button.classList.contains('detail-close38'))||buttons[buttons.length-1];
  for(const button of buttons)if(button!==keep)button.remove();
}
function clean(){
  normalizeDetail(document.querySelector('#ascDetail'));
  normalizeDetail(document.querySelector('#mapDetail'));
}
function schedule(){
  requestAnimationFrame(clean);
  setTimeout(clean,40);
}

// Deliberately no document-wide MutationObserver. The previous observer reacted to
// popup DOM that it mutated itself and could enter a renderer/cleanup feedback loop.
document.addEventListener('click',event=>{
  if(event.target?.closest?.('.asc-node,.map-node'))schedule();
},true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clean,{once:true});
else clean();
})();