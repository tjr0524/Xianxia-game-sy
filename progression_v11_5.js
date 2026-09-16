(()=>{
'use strict';

const P=window.__xianxiaProgression;
if(!P)return;
P.version='11.5';

const $=selector=>document.querySelector(selector);
const ROOT_Y={qingyun:100,blackwind:545,blood:1025,thunder:1560};
const WORLD_W=900;
const WORLD_H=2050;

function visible(el){
  if(!el)return false;
  const r=el.getBoundingClientRect();
  return r.width>40&&r.height>40;
}

function setRealmTransform(scale,x,y){
  const world=$('#realmProgWorld');
  if(!world)return;
  world.style.transform=`translate(${x}px,${y}px) scale(${scale})`;
}

function fitRealmAll(){
  const viewport=$('#realmProgViewport');
  if(!visible(viewport))return false;
  const r=viewport.getBoundingClientRect();
  const scale=Math.max(.12,Math.min(.82,(r.width-18)/WORLD_W,(r.height-18)/WORLD_H));
  const x=(r.width-WORLD_W*scale)/2;
  const y=Math.max(8,(r.height-WORLD_H*scale)/2);
  setRealmTransform(scale,x,y);
  return true;
}

function focusCurrentRealm({selectDetail=true}={}){
  const viewport=$('#realmProgViewport');
  const world=$('#realmProgWorld');
  const debug=window.__xianxiaDebug;
  if(!visible(viewport)||!world||!debug)return false;
  const area=debug.snapshot().M.area||'qingyun';
  const y=ROOT_Y[area]??ROOT_Y.qingyun;
  const r=viewport.getBoundingClientRect();
  const scale=.58;
  const x=r.width/2-(WORLD_W/2)*scale;
  const ty=r.height/2-(y+120)*scale;
  setRealmTransform(scale,x,ty);
  if(selectDetail){
    const current=world.querySelector('.prog-node.area-root.current');
    if(current)current.click();
  }
  return true;
}

function fitTrain(){
  const panel=$('[data-panel="train"]');
  if(!panel?.classList.contains('active'))return;
  const button=panel.querySelector('[data-cam="fit"]');
  button?.click();
}

function afterPaint(fn){
  requestAnimationFrame(()=>requestAnimationFrame(fn));
}

const trainTab=$('.tab-btn[data-tab="train"]');
const realmTab=$('.tab-btn[data-tab="tree"]');
trainTab?.addEventListener('click',()=>afterPaint(fitTrain));
realmTab?.addEventListener('click',()=>afterPaint(()=>focusCurrentRealm()));

const realmPanel=$('[data-panel="tree"]');
const fitButton=realmPanel?.querySelector('[data-cam="fit"]');
if(fitButton){
  fitButton.textContent='전체';
  fitButton.onclick=fitRealmAll;
}

const areaLabel=$('#area');
if(areaLabel){
  const observer=new MutationObserver(()=>afterPaint(()=>focusCurrentRealm()));
  observer.observe(areaLabel,{childList:true,subtree:true,characterData:true});
}

window.addEventListener('resize',()=>afterPaint(()=>{
  const treeActive=realmPanel?.classList.contains('active');
  if(treeActive)focusCurrentRealm({selectDetail:false});
  else fitTrain();
}));

// Initial load starts on the training panel. The realm graph is hidden at that
// moment, so its real viewport size is not known yet. Defer its camera setup
// until the tab is actually opened instead of caching a zero-sized transform.
afterPaint(()=>{
  if(realmPanel?.classList.contains('active'))focusCurrentRealm();
  else fitTrain();
});

P.fitRealmAll=fitRealmAll;
P.focusCurrentRealm=focusCurrentRealm;
})();
