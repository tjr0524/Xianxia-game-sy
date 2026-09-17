(()=>{
'use strict';
const VERSION='11.45.0';
if(window.__xianxiaUiHygiene?.version===VERSION)return;
window.__xianxiaUiHygiene={version:VERSION};
window.__XIANXIA_BUILD__=VERSION;

const $=s=>document.querySelector(s);
let queued=false;

function normalizeDetail(detail){
  if(!detail)return;
  const buttons=[...detail.querySelectorAll(':scope > button')].filter(button=>{
    const text=(button.textContent||'').trim();
    return button.classList.contains('detail-close38')||button.getAttribute('aria-label')==='상세정보 닫기'||text==='×';
  });
  if(!buttons.length)return;

  // Keep exactly one close button. Older popover passes could each append their own
  // control after renderTrainDetail()/renderMapDetail() replaced the panel contents.
  const keep=buttons.find(button=>button.classList.contains('detail-close38'))||buttons[buttons.length-1];
  for(const button of buttons)if(button!==keep)button.remove();
  keep.classList.add('detail-close38');
  keep.type='button';
  keep.setAttribute('aria-label','상세정보 닫기');
  keep.textContent='×';
}

function clean(){
  queued=false;
  normalizeDetail($('#ascDetail'));
  normalizeDetail($('#mapDetail'));
  const badge=$('#buildVersion');
  if(badge)badge.textContent=`BUILD ${VERSION}`;
}
function schedule(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(clean);
}

const style=document.createElement('style');
style.id='ui-hygiene-v11-45';
style.textContent=`
#ascDetail.detail-popover38,#mapDetail.detail-popover38{position:absolute!important}
#ascDetail.detail-popover38>.detail-close38,#mapDetail.detail-popover38>.detail-close38{
  position:absolute!important;
  z-index:4!important;
  right:6px!important;
  top:6px!important;
  left:auto!important;
  bottom:auto!important;
  width:24px!important;
  height:24px!important;
  min-width:24px!important;
  min-height:24px!important;
  margin:0!important;
  padding:0!important;
  display:grid!important;
  place-items:center!important;
  border:1px solid rgba(91,111,102,.42)!important;
  border-radius:50%!important;
  background:rgba(249,247,239,.94)!important;
  color:#60716a!important;
  font:700 15px/1 sans-serif!important;
  box-shadow:none!important;
}
`;
(document.head||document.documentElement).appendChild(style);

const observer=new MutationObserver(schedule);
observer.observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
else schedule();
})();