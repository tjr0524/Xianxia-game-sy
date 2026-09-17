(()=>{
'use strict';
const VERSION='11.46.0';
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
  const keep=buttons.find(button=>button.classList.contains('detail-close38'))||buttons[buttons.length-1];
  for(const button of buttons)if(button!==keep)button.remove();
  keep.classList.add('detail-close38');
  keep.type='button';
  keep.setAttribute('aria-label','상세정보 닫기');
  keep.textContent='×';
}

function mountBuildBadge(){
  const badge=$('#buildVersion'),title=$('.brand h1');
  if(!badge||!title)return;
  let row=title.parentElement?.querySelector(':scope > .brand-title-row');
  if(!row){
    row=document.createElement('div');
    row.className='brand-title-row';
    title.parentNode.insertBefore(row,title);
    row.appendChild(title);
  }
  if(badge.parentElement!==row)row.appendChild(badge);
  badge.textContent=`BUILD ${VERSION}`;
  badge.setAttribute('aria-hidden','true');
}

function clean(){
  queued=false;
  normalizeDetail($('#ascDetail'));
  normalizeDetail($('#mapDetail'));
  mountBuildBadge();
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
  position:absolute!important;z-index:4!important;right:6px!important;top:6px!important;left:auto!important;bottom:auto!important;
  width:24px!important;height:24px!important;min-width:24px!important;min-height:24px!important;margin:0!important;padding:0!important;
  display:grid!important;place-items:center!important;border:1px solid rgba(91,111,102,.42)!important;border-radius:50%!important;
  background:rgba(249,247,239,.94)!important;color:#60716a!important;font:700 15px/1 sans-serif!important;box-shadow:none!important
}
.brand-title-row{display:flex!important;align-items:baseline!important;gap:7px!important;min-width:0!important}
#buildVersion.build-version{position:static!important;z-index:auto!important;transform:none!important;display:inline!important;min-width:0!important;min-height:0!important;width:auto!important;height:auto!important;margin:0!important;padding:0!important;border:0!important;background:none!important;box-shadow:none!important;backdrop-filter:none!important;color:#8b918e!important;font-size:8px!important;font-weight:600!important;line-height:1.2!important;letter-spacing:.04em!important;white-space:nowrap!important;pointer-events:none!important;opacity:.82!important}
body.v22-combat-mode #buildVersion{display:none!important}
`;
(document.head||document.documentElement).appendChild(style);

const observer=new MutationObserver(schedule);
observer.observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
else schedule();
})();
