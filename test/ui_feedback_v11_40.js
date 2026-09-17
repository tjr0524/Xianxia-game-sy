(()=>{
'use strict';
const VERSION='11.40.0';
if(window.__xianxiaFeedbackPatch?.version===VERSION)return;
window.__xianxiaFeedbackPatch={version:VERSION};

const $=s=>document.querySelector(s);
let mapObserver=null;
let priorPhase=null;
let lastRunFrame=null;
let deathActive=false;

function badge(){}

function installStyles(){
  if($('#v1140FeedbackStyle'))return;
  const style=document.createElement('style');
  style.id='v1140FeedbackStyle';
  style.textContent=`
/* v11.40 feedback pass: compact information hierarchy */
.v25-theme [data-panel="train"] .record-grid{margin:0!important}
.v25-theme .v1140-area-records{
  margin:8px 0 0!important;
  padding:8px!important;
  border:1px solid #c7cec8!important;
  border-radius:8px 2px 8px 2px!important;
  background:rgba(255,253,247,.78)!important;
  box-shadow:none!important;
}
.v25-theme .v1140-area-records .expedition-record-head38{margin-bottom:6px!important}
.v25-theme .v1140-area-records .record-grid{gap:5px!important}
.v25-theme .v1140-area-records .record-grid div{min-height:45px!important;padding:6px 4px!important}
.v25-theme .v1140-area-records #runCount{display:block!important;margin-top:5px!important;text-align:left!important}

/* 상세정보는 선택한 노드 옆에 뜨는 소형 팝오버로 제한 */
.v25-theme .detail-popover38.v17float,
.v25-theme #ascDetail.v17float,
.v25-theme #mapDetail.v17float{
  width:min(218px,calc(100% - 18px))!important;
  max-width:218px!important;
  max-height:172px!important;
  min-height:0!important;
  padding:9px 9px 8px!important;
  border-radius:8px 2px 8px 2px!important;
  box-shadow:0 10px 24px rgba(43,57,56,.22)!important;
}
.v25-theme .detail-popover38 .node-effect{font-size:12px!important;margin:4px 0 5px!important}
.v25-theme .detail-popover38 .node-expect{font-size:8.5px!important;line-height:1.35!important}
.v25-theme .detail-popover38 .detail-action{min-height:29px!important;margin-top:6px!important}
.v25-theme .detail-close38{width:21px!important;height:21px!important;font-size:14px!important}

/* 법술첩은 긴 본문이 아니라 한눈에 상태를 읽는 카드 묶음 */
.v25-theme .spellbook38{display:grid!important;gap:7px!important;font-family:var(--v25-body)!important}
.v25-theme .spellbook38-intro{display:grid!important;min-height:62px!important;padding:8px 9px!important}
.v25-theme .spellbook38-intro p{font-size:9px!important;line-height:1.35!important}
.v25-theme .spellbook38-note{display:flex!important;padding:6px 8px!important}
.v25-theme .spell-card38{display:grid!important;padding:8px!important;gap:8px!important}
.v25-theme .spell-desc38{margin:5px 0 6px!important;line-height:1.4!important}
.v25-theme .spell-rank38{margin-bottom:6px!important}
.v25-theme .spell-actions38{gap:5px!important}

/* 비경 지도: 배경은 더 얕게, 현재/개방 가능 노드는 더 또렷하게 */
.v25-theme .map-viewport{
  background:linear-gradient(rgba(250,247,238,.84),rgba(239,233,219,.84)),url("assets/ink_v1/runtime/ui/world_map.png") center/cover no-repeat!important;
  border:1px solid rgba(86,108,99,.28)!important;
  border-radius:10px 3px 10px 3px!important;
}
.v25-theme .map-zone{border-color:rgba(83,105,97,.10)!important;background:rgba(255,253,247,.08)!important}
.v25-theme .map-zone span{font-size:12px!important;border-left-width:2px!important;background:rgba(250,247,238,.56)!important}
.v25-theme .map-point{width:50px!important;height:50px!important;overflow:visible!important}
.v25-theme .map-point-glyph38{font-size:18px!important}
.v25-theme .map-point .rank{min-width:27px!important;height:18px!important;font-size:8px!important;line-height:14px!important}
.v25-theme .map-root{width:102px!important;height:50px!important}
.v25-theme .map-gate{width:82px!important;height:43px!important}
.v25-theme .map-point[data-v1140-label]::after{
  content:attr(data-v1140-label);
  position:absolute;
  left:50%;
  top:calc(100% + 5px);
  transform:translateX(-50%);
  display:none;
  max-width:92px;
  padding:2px 5px;
  border:1px solid rgba(115,128,121,.32);
  border-radius:99px;
  color:#42534e;
  background:rgba(250,248,240,.92);
  font:700 7.5px/1.2 var(--v25-body);
  white-space:nowrap;
  pointer-events:none;
  box-shadow:0 2px 6px rgba(46,60,55,.08);
}
.v25-theme .map-point.on[data-v1140-label]::after,
.v25-theme .map-point.available[data-v1140-label]::after,
.v25-theme .map-point.current[data-v1140-label]::after{display:block}
.v25-theme .map-point.available{animation:v1140MapReady 1.8s ease-in-out infinite}
@keyframes v1140MapReady{0%,100%{outline:0 solid rgba(172,132,52,0)}50%{outline:4px solid rgba(172,132,52,.11)}}

/* 전투 체력바는 캐릭터를 따라다니는 소형 월드 HUD */
#v1133Hp{
  z-index:38!important;
  width:94px!important;
  min-width:0!important;
  bottom:auto!important;
  right:auto!important;
  transform:translate(-50%,-100%)!important;
  text-align:center!important;
  pointer-events:none!important;
  transition:opacity .12s linear!important;
}
#v1133HpText{
  margin:0 0 3px!important;
  padding:2px 5px!important;
  border-radius:999px!important;
  background:rgba(242,236,219,.84)!important;
  color:#293832!important;
  font-size:8px!important;
  line-height:1.1!important;
  box-shadow:0 2px 7px rgba(20,28,24,.14)!important;
}
#v1133HpTrack{
  height:8px!important;
  padding:1px!important;
  border-color:rgba(244,239,219,.78)!important;
  background:rgba(34,43,39,.72)!important;
  box-shadow:0 2px 8px rgba(12,18,16,.24)!important;
}
#v1133HpFill{transition:width .08s linear!important}

/* 사망은 즉시 홈으로 튀지 않고 실제 마지막 위치에서 쓰러진 뒤 결과창으로 전환 */
#v1140DeathFx{position:fixed;z-index:30000;inset:0;overflow:hidden;pointer-events:auto;background:radial-gradient(circle at 50% 52%,rgba(92,30,27,.10),rgba(8,12,10,.46) 76%);animation:v1140DeathVeil 1.28s ease forwards}
#v1140DeathFx::before{content:"";position:absolute;inset:0;box-shadow:inset 0 0 120px rgba(91,23,20,.55);animation:v1140DeathPulse .58s ease-out both}
.v1140-death-actor{position:fixed;width:136px;height:150px;transform-origin:50% 74%;transform:translate(-50%,-74%);filter:drop-shadow(0 8px 8px rgba(0,0,0,.34));animation:v1140Fall .92s cubic-bezier(.2,.7,.18,1) forwards}
.v1140-death-copy{position:absolute;left:50%;top:62%;transform:translate(-50%,12px);min-width:190px;padding:9px 13px;border:1px solid rgba(226,205,183,.42);border-radius:10px 3px 10px 3px;background:rgba(28,30,26,.70);color:#f3eadb;text-align:center;backdrop-filter:blur(5px);opacity:0;animation:v1140DeathCopy .9s .34s ease forwards}
.v1140-death-copy b{display:block;margin-bottom:3px;font:800 17px/1.15 var(--v25-serif,serif);letter-spacing:.08em}
.v1140-death-copy span{font-size:9px;color:#d8cabd}
@keyframes v1140Fall{0%{transform:translate(-50%,-74%) rotate(0deg) scale(1);opacity:1}18%{transform:translate(-50%,-78%) rotate(-7deg) scale(1.02)}100%{transform:translate(-42%,-42%) rotate(78deg) scale(.96);opacity:.78;filter:grayscale(.45) brightness(.66) drop-shadow(10px 10px 8px rgba(0,0,0,.35))}}
@keyframes v1140DeathPulse{0%{background:rgba(146,37,29,.38);opacity:1}100%{background:rgba(146,37,29,0);opacity:.3}}
@keyframes v1140DeathCopy{to{opacity:1;transform:translate(-50%,0)}}
@keyframes v1140DeathVeil{0%,76%{opacity:1}100%{opacity:0}}

@media(max-width:560px){
  .v25-theme .detail-popover38.v17float,.v25-theme #ascDetail.v17float,.v25-theme #mapDetail.v17float{max-width:205px!important;max-height:160px!important}
  .v25-theme .map-point{width:47px!important;height:47px!important}
  #v1133Hp{width:88px!important}
  .v1140-death-copy{top:64%}
}
`;
  document.head.appendChild(style);
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

function compactName(raw){
  return String(raw||'').replace(/\s+\d+\/5\s*$/,'').replace(/\s*비경\s*$/,'').trim();
}
function annotateMap(){
  const world=$('#mapWorld');
  if(!world)return;
  for(const node of world.querySelectorAll('.map-point')){
    const name=compactName(node.getAttribute('aria-label'));
    if(name&&name!=='개척 노드')node.dataset.v1140Label=name;
  }
}
function observeMap(){
  const world=$('#mapWorld');
  if(!world||mapObserver)return;
  mapObserver=new MutationObserver(()=>requestAnimationFrame(annotateMap));
  mapObserver.observe(world,{childList:true,subtree:true,attributes:true,attributeFilter:['aria-label','class']});
}

function ensureCompactPopover(viewSelector,detailSelector,nodeSelector){
  const view=$(viewSelector),detail=$(detailSelector);
  if(!view||!detail||detail.dataset.v38Popover)return;
  detail.dataset.v38Popover='1';
  detail.classList.add('v17float','detail-popover38');
  detail.classList.remove('open');
  view.appendChild(detail);
  const close=()=>detail.classList.remove('open');
  const closeButton=()=>{
    let b=detail.querySelector('.detail-close38');
    if(b)return b;
    b=document.createElement('button');
    b.type='button';b.className='detail-close38';b.textContent='×';b.setAttribute('aria-label','상세정보 닫기');
    b.onclick=e=>{e.preventDefault();e.stopPropagation();close()};
    detail.appendChild(b);return b;
  };
  const place=node=>{
    const vr=view.getBoundingClientRect(),nr=node.getBoundingClientRect();
    const width=Math.min(205,Math.max(178,vr.width-18));
    detail.style.width=`${width}px`;
    detail.classList.add('open');
    const height=Math.min(detail.scrollHeight,160);
    let left=nr.left-vr.left+nr.width/2-width/2;
    left=Math.max(7,Math.min(vr.width-width-7,left));
    let top=nr.bottom-vr.top+6;
    if(top+height>vr.height-7)top=nr.top-vr.top-height-6;
    detail.style.left=`${left}px`;detail.style.top=`${Math.max(7,top)}px`;
  };
  view.addEventListener('click',event=>{
    const node=event.target.closest(nodeSelector);
    if(node){requestAnimationFrame(()=>{closeButton();place(node)});return}
    if(!event.target.closest(detailSelector)&&!event.target.closest('.camera'))close();
  },true);
  for(const type of ['pointerdown','pointermove','pointerup','click'])detail.addEventListener(type,e=>e.stopPropagation());
}

function playerScreen(mode,p){
  if(!mode||!p)return null;
  return {x:mode.left+p.x*mode.scale,y:mode.top+p.y*mode.scale};
}
function followPlayerHp(snapshot){
  const hp=$('#v1133Hp');
  const mode=window.__xianxiaExplorationMode;
  const p=snapshot?.P;
  if(!hp||!mode?.active||!p)return;
  const q=playerScreen(mode,p);
  if(!q)return;
  const offset=Math.max(42,68*(mode.scale||1));
  hp.style.left=`${q.x}px`;
  hp.style.top=`${q.y-offset}px`;
  const vw=window.innerWidth||390,vh=window.innerHeight||844;
  hp.style.opacity=q.x>35&&q.x<vw-35&&q.y>55&&q.y<vh-28?'1':'0';
  lastRunFrame={
    p:{x:p.x,y:p.y},hp:+p.hp||0,max:+p.max||1,
    screen:{x:q.x,y:q.y},scale:mode.scale||1
  };
}

function copyActorCrop(canvas,p){
  const sources=[$('#v1131InkLayer'),$('#cv')].filter(Boolean);
  const ctx=canvas.getContext('2d');
  for(const src of sources){
    try{
      if(!src.width||!src.height)continue;
      const w=150,h=170;
      const sx=Math.max(0,Math.min(src.width-w,p.x-w/2));
      const sy=Math.max(0,Math.min(src.height-h,p.y-h*.68));
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(src,sx,sy,w,h,0,0,canvas.width,canvas.height);
      return true;
    }catch{}
  }
  return false;
}
function showDeath(){
  if(deathActive)return;
  deathActive=true;
  $('#v1140DeathFx')?.remove();
  const info=lastRunFrame||{p:{x:900,y:1200},screen:{x:(innerWidth||390)/2,y:(innerHeight||844)/2},scale:1};
  const layer=document.createElement('div');
  layer.id='v1140DeathFx';
  const actor=document.createElement('canvas');
  actor.className='v1140-death-actor';actor.width=150;actor.height=170;
  actor.style.left=`${Math.max(45,Math.min((innerWidth||390)-45,info.screen.x))}px`;
  actor.style.top=`${Math.max(90,Math.min((innerHeight||844)-90,info.screen.y))}px`;
  if(!copyActorCrop(actor,info.p)){
    const ctx=actor.getContext('2d');
    ctx.font='700 58px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='rgba(242,235,215,.9)';ctx.fillText('劍',75,85);
  }
  const copy=document.createElement('div');
  copy.className='v1140-death-copy';
  copy.innerHTML='<b>전투 불능</b><span>체력이 다해 쓰러졌습니다 · 잠시 후 결과로 돌아갑니다</span>';
  layer.append(actor,copy);document.body.appendChild(layer);
  setTimeout(()=>{layer.remove();deathActive=false},1320);
}

function frame(s){
  const phase=s?.phase||null;
  if(phase==='run'){
    followPlayerHp(s);
  }else if(priorPhase==='run'){
    const dead=(+s?.P?.hp||0)<=0 || $('#ot')?.textContent?.includes('육신 중상');
    if(dead)showDeath();
  }
  priorPhase=phase;
}
function subscribeFrame(){
  const hub=window.__xianxiaFrameHub;
  if(hub?.subscribe){
    hub.subscribe('player-feedback',frame,40);
    return;
  }
  function fallback(){
    let s=null;try{s=window.__xianxiaDebug?.snapshot?.()||null}catch{}
    frame(s);requestAnimationFrame(fallback);
  }
  requestAnimationFrame(fallback);
}

function boot(){
  installStyles();
  badge();
  subscribeFrame();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();