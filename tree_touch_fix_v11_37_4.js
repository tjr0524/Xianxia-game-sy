(()=>{
'use strict';
if(window.__xianxiaTreeTouchFix)return;
window.__xianxiaTreeTouchFix={version:'11.37.4-devmodal'};

const NODE_SELECTOR='.asc-node,.map-node,.s17node';
const VIEW_SELECTOR='#ascViewport,#mapViewport,#skillTreeViewport';
const DRAG_THRESHOLD=12;
const pointers=new Map();
const cancelledClicks=new WeakMap();
let devPlaceholder=null;

function closest(el,selector){return el&&typeof el.closest==='function'?el.closest(selector):null}
function dist(a,x,y){return Math.hypot(x-a.x,y-a.y)}

document.addEventListener('pointerdown',event=>{
  const node=closest(event.target,NODE_SELECTOR);
  if(node){
    pointers.set(event.pointerId,{kind:'node',node,x:event.clientX,y:event.clientY,moved:false});
    return;
  }
  const view=closest(event.target,VIEW_SELECTOR);
  if(view)pointers.set(event.pointerId,{kind:'view',view,x:event.clientX,y:event.clientY,moved:false});
},true);

document.addEventListener('pointermove',event=>{
  const p=pointers.get(event.pointerId);if(!p)return;
  if(!p.moved&&dist(p,event.clientX,event.clientY)>=DRAG_THRESHOLD)p.moved=true;
},true);

function flushOldCameraSuppress(view,x,y){
  setTimeout(()=>{
    try{
      view.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,clientX:x,clientY:y,view:window}));
    }catch(_){ }
  },0);
}

document.addEventListener('pointerup',event=>{
  const p=pointers.get(event.pointerId);if(!p)return;
  pointers.delete(event.pointerId);
  if(p.kind==='node'){
    if(p.moved){cancelledClicks.set(p.node,performance.now()+500);event.preventDefault()}
    return;
  }
  if(p.kind==='view'&&p.moved)flushOldCameraSuppress(p.view,event.clientX,event.clientY);
},true);

document.addEventListener('pointercancel',event=>{pointers.delete(event.pointerId)},true);

document.addEventListener('click',event=>{
  const node=closest(event.target,NODE_SELECTOR);if(!node)return;
  const until=cancelledClicks.get(node)||0;
  if(performance.now()<until){cancelledClicks.delete(node);event.preventDefault();event.stopImmediatePropagation()}
},true);

function ensureDeveloperModal(){
  let modal=document.querySelector('#buildDevModal');
  if(modal)return modal;
  modal=document.createElement('div');
  modal.id='buildDevModal';
  modal.innerHTML=`<div class="build-dev-backdrop" data-dev-close></div><section class="build-dev-sheet" role="dialog" aria-modal="true" aria-label="개발자 메뉴"><div class="build-dev-head"><div><b>개발자 메뉴</b><small id="buildDevVersion"></small></div><button type="button" data-dev-close aria-label="닫기">×</button></div><div id="buildDevContent" class="build-dev-content"></div></section>`;
  document.body.appendChild(modal);
  modal.addEventListener('pointerup',event=>{
    if(closest(event.target,'[data-dev-close]')){event.preventDefault();event.stopPropagation();closeDeveloperMenu()}
  },true);
  return modal;
}

function openDeveloperMenu(){
  const modal=ensureDeveloperModal();
  const content=modal.querySelector('#buildDevContent');
  const ver=modal.querySelector('#buildDevVersion');
  if(ver)ver.textContent=window.__XIANXIA_BUILD__?`BUILD ${window.__XIANXIA_BUILD__}`:'BUILD';
  const dev=document.querySelector('details.dev');
  if(dev&&dev.parentNode!==content){
    devPlaceholder=document.createComment('dev-tools-placeholder');
    dev.parentNode?.insertBefore(devPlaceholder,dev);
    content.replaceChildren(dev);
    dev.open=true;
  }else if(!dev){
    content.innerHTML='<div class="build-dev-empty">개발 도구를 불러오는 중입니다. 잠시 후 다시 눌러주세요.</div>';
  }
  modal.classList.add('open');
}

function closeDeveloperMenu(){
  const modal=document.querySelector('#buildDevModal');
  if(!modal)return;
  const dev=modal.querySelector('details.dev');
  if(dev&&devPlaceholder?.parentNode){devPlaceholder.parentNode.insertBefore(dev,devPlaceholder);devPlaceholder.remove();devPlaceholder=null}
  modal.classList.remove('open');
}

function developerTriggerFor(target){
  const testBadge=document.querySelector('#testChannelBadge');
  if(testBadge)return closest(target,'#testChannelBadge');
  return closest(target,'.brand-mark');
}

function developerTriggerClick(event){
  const trigger=developerTriggerFor(event.target);
  if(!trigger)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  openDeveloperMenu();
}

document.addEventListener('click',developerTriggerClick,true);
document.addEventListener('keydown',event=>{
  const trigger=developerTriggerFor(event.target);
  if(!trigger||!(event.key==='Enter'||event.key===' '))return;
  event.preventDefault();
  event.stopImmediatePropagation();
  openDeveloperMenu();
},true);

function setupDeveloperTrigger(){
  const testBadge=document.querySelector('#testChannelBadge');
  const brand=document.querySelector('.brand-mark');
  const trigger=testBadge||brand;

  if(trigger){
    trigger.setAttribute('role','button');
    trigger.setAttribute('aria-label','개발자 메뉴 열기');
    trigger.tabIndex=0;
  }

  if(testBadge&&brand){
    brand.removeAttribute('role');
    brand.removeAttribute('aria-label');
    brand.removeAttribute('tabindex');
  }

  const badge=document.querySelector('#buildVersion');
  if(badge){
    badge.removeAttribute('role');
    badge.removeAttribute('aria-label');
    badge.removeAttribute('tabindex');
    badge.setAttribute('aria-hidden','true');
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setupDeveloperTrigger,{once:true});
else setupDeveloperTrigger();

const style=document.createElement('style');
style.id='tree-touch-fix-v11-37-4';
style.textContent=`
${NODE_SELECTOR}{touch-action:manipulation!important;-webkit-user-select:none!important;user-select:none!important}
.brand-mark,#testChannelBadge{cursor:pointer!important;touch-action:manipulation!important}
#buildDevModal{position:fixed;inset:0;z-index:2147483640;display:none;pointer-events:none}
#buildDevModal.open{display:block;pointer-events:auto}
.build-dev-backdrop{position:absolute;inset:0;background:#020607b8;backdrop-filter:blur(3px)}
.build-dev-sheet{position:absolute;left:10px;right:10px;top:max(calc(env(safe-area-inset-top) + 54px),58px);max-height:calc(100dvh - max(calc(env(safe-area-inset-top) + 70px),74px) - env(safe-area-inset-bottom));overflow:auto;padding:12px;border:1px solid #536b6f;border-radius:14px;background:#0d181df8;box-shadow:0 18px 55px #000d;color:#edf5f1}
.build-dev-head{position:sticky;top:-12px;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:10px;margin:-12px -12px 10px;padding:11px 12px;border-bottom:1px solid #33484c;background:#0d181df4}
.build-dev-head b{display:block;font-size:14px}.build-dev-head small{display:block;margin-top:2px;color:#91a5a2;font-size:9px}.build-dev-head button{width:34px;height:34px;margin:0;border:1px solid #4a5d61;border-radius:50%;background:#162328;color:#edf5f1;font-size:20px}
.build-dev-content details.dev{display:block!important;margin:0!important;color:#a9bbb7!important;font-size:10px!important}.build-dev-content details.dev>summary{display:none!important}.build-dev-content details.dev button{min-height:38px!important;margin:5px 0!important;padding:8px 10px!important;font-size:10px!important}.build-dev-content .dev-milestones{margin-top:10px!important}.build-dev-content .dev-milestone-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:6px!important}.build-dev-empty{padding:20px 4px;text-align:center;color:#91a5a2;font-size:11px}
`;
(document.head||document.documentElement).appendChild(style);
})();
