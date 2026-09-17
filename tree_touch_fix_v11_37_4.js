(()=>{
'use strict';
if(window.__xianxiaTreeTouchFix)return;
window.__xianxiaTreeTouchFix={version:'11.37.4-devmodal'};

const NODE_SELECTOR='.asc-node,.map-node,.s17node';
const VIEW_SELECTOR='#ascViewport,#mapViewport,#skillTreeViewport';
const DRAG_THRESHOLD=12;
const pointers=new Map();
const cancelledClicks=new WeakMap();

function closest(el,selector){return el&&typeof el.closest==='function'?el.closest(selector):null}
function dist(a,x,y){return Math.hypot(x-a.x,y-a.y)}

document.addEventListener('pointerdown',event=>{
  const node=closest(event.target,NODE_SELECTOR);
  if(node){
    pointers.set(event.pointerId,{kind:'node',node,x:event.clientX,y:event.clientY,moved:false});
    event.stopPropagation();
    return;
  }
  const view=closest(event.target,VIEW_SELECTOR);
  if(view)pointers.set(event.pointerId,{kind:'view',view,x:event.clientX,y:event.clientY,moved:false});
},true);

document.addEventListener('pointermove',event=>{
  const p=pointers.get(event.pointerId);if(!p)return;
  if(!p.moved&&dist(p,event.clientX,event.clientY)>=DRAG_THRESHOLD)p.moved=true;
  if(p.kind==='node')event.stopPropagation();
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
    event.stopPropagation();
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

const style=document.createElement('style');
style.id='tree-touch-fix-v11-37-4';
style.textContent=`
${NODE_SELECTOR}{touch-action:manipulation!important;-webkit-user-select:none!important;user-select:none!important}
`;
(document.head||document.documentElement).appendChild(style);
})();
