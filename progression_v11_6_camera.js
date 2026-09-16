(()=>{
'use strict';
const P=window.__xianxiaProgression;
if(!P)return;
const $=selector=>document.querySelector(selector);
const ROOT_Y={qingyun:100,blackwind:545,blood:1025,thunder:1560};
const WORLD_W=900,WORLD_H=2050;
function visible(el){if(!el)return false;const r=el.getBoundingClientRect();return r.width>40&&r.height>40}
function setRealmTransform(scale,x,y){const world=$('#realmProgWorld');if(world)world.style.transform=`translate(${x}px,${y}px) scale(${scale})`}
function fitRealmAll(){const viewport=$('#realmProgViewport');if(!visible(viewport))return false;const r=viewport.getBoundingClientRect(),scale=Math.max(.12,Math.min(.82,(r.width-18)/WORLD_W,(r.height-18)/WORLD_H));setRealmTransform(scale,(r.width-WORLD_W*scale)/2,Math.max(8,(r.height-WORLD_H*scale)/2));return true}
function focusCurrentRealm({selectDetail=true}={}){const viewport=$('#realmProgViewport'),world=$('#realmProgWorld'),debug=window.__xianxiaDebug;if(!visible(viewport)||!world||!debug)return false;const area=debug.snapshot().M.area||'qingyun',y=ROOT_Y[area]??ROOT_Y.qingyun,r=viewport.getBoundingClientRect(),scale=.58;setRealmTransform(scale,r.width/2-(WORLD_W/2)*scale,r.height/2-(y+120)*scale);if(selectDetail)world.querySelector('.prog-node.area-root.current')?.click();return true}
function fitTrain(){const panel=$('[data-panel="train"]');if(!panel?.classList.contains('active'))return;panel.querySelector('[data-cam="fit"]')?.click()}
const afterPaint=fn=>requestAnimationFrame(()=>requestAnimationFrame(fn));
$('.tab-btn[data-tab="train"]')?.addEventListener('click',()=>afterPaint(fitTrain));
$('.tab-btn[data-tab="tree"]')?.addEventListener('click',()=>afterPaint(()=>focusCurrentRealm()));
const realmPanel=$('[data-panel="tree"]'),fitButton=realmPanel?.querySelector('[data-cam="fit"]');
if(fitButton){fitButton.textContent='전체';fitButton.onclick=fitRealmAll}
const areaLabel=$('#area');if(areaLabel)new MutationObserver(()=>afterPaint(()=>focusCurrentRealm())).observe(areaLabel,{childList:true,subtree:true,characterData:true});
window.addEventListener('resize',()=>afterPaint(()=>realmPanel?.classList.contains('active')?focusCurrentRealm({selectDetail:false}):fitTrain()));
afterPaint(()=>realmPanel?.classList.contains('active')?focusCurrentRealm():fitTrain());
P.fitRealmAll=fitRealmAll;P.focusCurrentRealm=focusCurrentRealm;
})();
