(()=>{
'use strict';
const VERSION='11.50.1';
if(window.__xianxiaUiHygiene?.version===VERSION)return;
window.__xianxiaUiHygiene={version:VERSION};

const $=s=>document.querySelector(s);
let queued=false;

function normalizeDetail(detail){
  if(!detail)return;
  // Legacy popover passes can recreate their own close buttons after every detail render.
  // Own the close control here, but do not touch unrelated action buttons.
  const buttons=[...detail.querySelectorAll('button:not(.detail-action)')];
  let keep=buttons.find(button=>button.classList.contains('hygiene-close47'))||null;
  for(const button of buttons)if(button!==keep)button.remove();
  if(!keep){
    keep=document.createElement('button');
    keep.type='button';
    keep.className='detail-close38 hygiene-close47';
    keep.setAttribute('aria-label','상세정보 닫기');
    keep.textContent='×';
    keep.addEventListener('click',event=>{
      event.preventDefault();event.stopPropagation();
      detail.classList.remove('open');
    });
    detail.appendChild(keep);
  }else{
    keep.classList.add('detail-close38');
    keep.type='button';
    keep.setAttribute('aria-label','상세정보 닫기');
    if(keep.textContent!=='×')keep.textContent='×';
  }
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
  badge.setAttribute('aria-hidden','true');
  // IMPORTANT: this UI helper must never write the build number or __XIANXIA_BUILD__.
  // The canonical entrypoint owns the app build. Writing text here caused a
  // MutationObserver -> textContent -> MutationObserver feedback loop on Safari.
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
@media(max-width:560px){
  body.v25-theme .topbar{
    display:flex!important;
    flex-wrap:wrap!important;
    align-items:center!important;
    justify-content:flex-start!important;
    gap:8px!important;
  }
  body.v25-theme .brand{
    flex:1 1 100%!important;
    width:100%!important;
    min-width:0!important;
  }
  body.v25-theme .brand>div:last-child{min-width:0!important;flex:1 1 auto!important}
  body.v25-theme .brand-title-row{display:flex!important;align-items:baseline!important;gap:6px!important;min-width:0!important}
  body.v25-theme .brand-title-row h1{
    flex:0 0 auto!important;
    white-space:nowrap!important;
    word-break:keep-all!important;
  }
  body.v25-theme .resources{
    flex:1 1 100%!important;
    width:100%!important;
    display:grid!important;
    grid-template-columns:repeat(3,minmax(0,1fr))!important;
    gap:6px!important;
  }
  body.v25-theme .resource{min-width:0!important;width:auto!important}
  body.v25-theme .resource>span,
  body.v25-theme .resource>b{white-space:nowrap!important;word-break:keep-all!important}
}
`;
(document.head||document.documentElement).appendChild(style);

const observer=new MutationObserver(mutations=>{
  // Ignore pure text changes such as HUD/build labels. Only structural changes can
  // require remounting the close button or inline build element.
  if(mutations.some(m=>m.type==='childList'&&(m.addedNodes.length||m.removedNodes.length)))schedule();
});
observer.observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
else schedule();
})();
