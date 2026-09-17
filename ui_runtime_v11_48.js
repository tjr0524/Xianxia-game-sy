(()=>{
'use strict';
const VERSION='11.48.0';
if(window.__xianxiaUiRuntime?.version===VERSION)return;

const $=s=>document.querySelector(s);
const popovers=new Map();
let queued=false;

function compactName(raw){
  return String(raw||'').replace(/\s+\d+\/5\s*$/,'').replace(/\s*비경\s*$/,'').trim();
}

function installStyle(){
  if($('#v1148UiRuntimeStyle'))return;
  const style=document.createElement('style');
  style.id='v1148UiRuntimeStyle';
  style.textContent=`
#ascDetail.detail-popover38,#mapDetail.detail-popover38{position:absolute!important}
#ascDetail.detail-popover38>.detail-close38,#mapDetail.detail-popover38>.detail-close38{
  position:absolute!important;z-index:4!important;right:6px!important;top:6px!important;
  left:auto!important;bottom:auto!important;width:24px!important;height:24px!important;
  min-width:24px!important;min-height:24px!important;margin:0!important;padding:0!important;
  display:grid!important;place-items:center!important;border:1px solid rgba(91,111,102,.42)!important;
  border-radius:50%!important;background:rgba(249,247,239,.94)!important;color:#60716a!important;
  font:700 15px/1 sans-serif!important;box-shadow:none!important
}
`;
  (document.head||document.documentElement).appendChild(style);
}

function moveRecordsToAreaTab(){
  const records=$('#bestStone')?.closest('.section');
  const panel=$('[data-panel="areas"]');
  if(!records||!panel)return;
  records.classList.add('expedition-records38','v1140-area-records');
  let head=records.querySelector('.expedition-record-head38');
  if(!head){
    head=document.createElement('div');
    head.className='expedition-record-head38';
    records.prepend(head);
  }
  head.innerHTML='<b>비경 기록</b><span>현재 선택 비경 기준</span>';
  if(records.parentElement!==panel)panel.appendChild(records);
}

function normalizeClose(detail,close){
  if(!detail)return null;
  const buttons=[...detail.querySelectorAll(':scope > button')].filter(button=>{
    const text=(button.textContent||'').trim();
    return button.classList.contains('detail-close38')||
      button.getAttribute('aria-label')==='상세정보 닫기'||text==='×';
  });
  let keep=buttons.find(button=>button.classList.contains('detail-close38'))||buttons[0]||null;
  if(!keep){
    keep=document.createElement('button');
    keep.type='button';
    detail.appendChild(keep);
  }
  for(const button of buttons)if(button!==keep)button.remove();
  keep.className='detail-close38';
  keep.type='button';
  keep.setAttribute('aria-label','상세정보 닫기');
  keep.textContent='×';
  keep.onclick=event=>{event.preventDefault();event.stopPropagation();close()};
  return keep;
}

function positionPopover(entry){
  const {view,detail,node}=entry;
  if(!view||!detail||!node?.isConnected)return;
  const vr=view.getBoundingClientRect(),nr=node.getBoundingClientRect();
  const width=Math.min(205,Math.max(178,vr.width-18));
  detail.style.width=`${width}px`;
  detail.classList.add('open');
  const height=Math.min(detail.scrollHeight,160);
  let left=nr.left-vr.left+nr.width/2-width/2;
  left=Math.max(7,Math.min(vr.width-width-7,left));
  let top=nr.bottom-vr.top+6;
  if(top+height>vr.height-7)top=nr.top-vr.top-height-6;
  detail.style.left=`${left}px`;
  detail.style.top=`${Math.max(7,top)}px`;
}

function refreshPopover(entry){
  if(!entry)return;
  normalizeClose(entry.detail,entry.close);
  if(entry.node?.isConnected)positionPopover(entry);
}

function setupPopover(key,viewSelector,detailSelector,nodeSelector){
  const view=$(viewSelector),detail=$(detailSelector);
  if(!view||!detail)return;
  detail.dataset.v38Popover='1';
  detail.dataset.v1148Owner='ui-runtime';
  detail.classList.add('v17float','detail-popover38');
  detail.classList.remove('open');
  if(detail.parentElement!==view)view.appendChild(detail);

  const entry={key,view,detail,nodeSelector,node:null};
  entry.close=()=>{detail.classList.remove('open');entry.node=null};
  popovers.set(key,entry);

  for(const type of ['pointerdown','pointermove','pointerup','click']){
    detail.addEventListener(type,event=>event.stopPropagation());
  }
}

function sanitizeMapDetail(){
  const detail=$('#mapDetail');
  if(!detail)return;
  const expect=detail.querySelector('.node-expect');
  const button=detail.querySelector('.detail-action');
  const kicker=detail.querySelector('.node-kicker')?.textContent?.trim()||'';

  if(expect){
    const parts=expect.innerHTML.split(/<br\s*\/?\s*>/i);
    if(parts.length>1){
      const tmp=document.createElement('div');
      tmp.innerHTML=parts[parts.length-1];
      const status=(tmp.textContent||'').trim();
      if(expect.textContent.trim()!==status)expect.textContent=status;
    }
  }

  const status=expect?.textContent?.trim()||'';
  const capped=status.startsWith('현재 경지 상한');
  const complete=/완성/.test(status)||/·\s*5\/5\s*$/.test(kicker);
  if(button&&capped){
    button.disabled=true;
    button.textContent='다음 경지에서 개방';
    detail.querySelector('.cost-row')?.remove();
  }else if(button&&complete){
    button.disabled=true;
    button.textContent='완성';
  }else if(button&&button.disabled&&status){
    const label=status==='재료 부족'?'재료 부족':
      status.includes('선행')?'선행 조건 필요':
      status.includes('필요')||status.includes('미개방')?'조건 미충족':button.textContent;
    if(label)button.textContent=label;
  }

  const header=$('[data-panel="tree"] .section-head .small');
  if(header)header.textContent='노드를 눌러 개척 정보 확인';
}

function annotateMap(){
  const world=$('#mapWorld');
  if(!world)return;
  for(const node of world.querySelectorAll('.map-point')){
    const name=compactName(node.getAttribute('aria-label'));
    if(name&&name!=='개척 노드')node.dataset.v1140Label=name;
  }
}

function refresh(){
  queued=false;
  moveRecordsToAreaTab();
  sanitizeMapDetail();
  annotateMap();
  for(const entry of popovers.values())refreshPopover(entry);
}

function schedule(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>requestAnimationFrame(refresh));
}

document.addEventListener('click',event=>{
  for(const entry of popovers.values()){
    const node=event.target?.closest?.(entry.nodeSelector);
    if(node&&entry.view.contains(node)){
      entry.node=node;
      schedule();
      return;
    }
  }

  if(event.target?.closest?.('.detail-action')){
    schedule();
    return;
  }

  if(event.target?.closest?.('.tab-btn[data-tab="train"],.tab-btn[data-tab="tree"],.tab-btn[data-tab="areas"]')){
    schedule();
    return;
  }

  for(const entry of popovers.values()){
    if(entry.detail.classList.contains('open')&&!event.target?.closest?.('#ascDetail,#mapDetail,.camera')){
      entry.close();
    }
  }
},true);

document.addEventListener('xianxia:panel-open',schedule,true);

function boot(){
  installStyle();
  setupPopover('training','#ascViewport','#ascDetail','.asc-node');
  setupPopover('map','#mapViewport','#mapDetail','.map-node');
  refresh();
  setTimeout(schedule,80);
  setTimeout(schedule,260);
}

window.__xianxiaUiRuntime={
  version:VERSION,
  owner:'detail-popovers+records+map-detail',
  schedule,
  refresh
};

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();
