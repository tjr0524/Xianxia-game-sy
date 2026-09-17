(()=>{
'use strict';
if(window.__xianxiaExplorationMode?.version==='11.33.0')return;

const W=700,H=460;
const $=s=>document.querySelector(s);
const game=$('#game');
const cv=$('#cv');
const ret=$('#ret');
if(!game||!cv)return;

const state={
  version:'11.33.0',
  active:false,
  camX:350,
  camY:230,
  ready:false,
  pressed:false,
  left:0,
  top:0,
  scale:1,
  lastPhase:'home'
};
window.__xianxiaExplorationMode=state;

function installCss(){
  if($('#v1133ExplorationStyle'))return;
  const style=document.createElement('style');
  style.id='v1133ExplorationStyle';
  style.textContent=`
body.v1133-run{overflow:hidden!important;overscroll-behavior:none!important;background:#0b1110!important}
body.v1133-run .shell{width:100%!important;max-width:none!important;margin:0!important;padding:0!important}
body.v1133-run .topbar,
body.v1133-run .arena-head,
body.v1133-run .arena-card>.hud,
body.v1133-run .arena-card>.objective,
body.v1133-run .arena-card>.run-row,
body.v1133-run .arena-card>.notice,
body.v1133-run .controls,
body.v1133-run .footer{display:none!important}
body.v1133-run .layout{display:block!important;width:100%!important;height:100%!important;margin:0!important}
body.v1133-run .arena-card{position:fixed!important;z-index:1000!important;inset:0!important;width:100vw!important;height:100dvh!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;background:#0a1110!important;overflow:hidden!important}
body.v1133-run #game{position:absolute!important;inset:0!important;width:100vw!important;height:100dvh!important;border:0!important;border-radius:0!important;box-shadow:none!important;overflow:hidden!important;background:#0a1110!important}
body.v1133-run #game canvas{max-width:none!important;max-height:none!important;touch-action:none!important}
body.v1133-run .danger-label{left:50%!important;top:calc(env(safe-area-inset-top) + 14px)!important;transform:translateX(-50%);font-size:11px!important;white-space:nowrap}
#v1133Hud{position:absolute;z-index:24;inset:0;pointer-events:none;display:none;color:#24332e;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Pretendard",sans-serif}
body.v1133-run #v1133Hud{display:block}
#v1133Loot{position:absolute;left:calc(env(safe-area-inset-left) + 14px);top:calc(env(safe-area-inset-top) + 14px);min-width:126px;padding:9px 11px;border:1px solid rgba(235,228,205,.52);border-radius:12px;background:rgba(238,231,212,.78);box-shadow:0 5px 18px rgba(24,31,28,.18);backdrop-filter:blur(5px);font-size:11px;line-height:1.45;text-shadow:0 1px rgba(255,255,255,.45)}
#v1133Loot b{display:block;font-size:12px;margin-bottom:3px}
#v1133Timer{position:absolute;right:calc(env(safe-area-inset-right) + 14px);top:calc(env(safe-area-inset-top) + 14px);padding:7px 10px;border-radius:999px;background:rgba(238,231,212,.76);border:1px solid rgba(235,228,205,.5);font-weight:800;font-size:12px;box-shadow:0 4px 14px rgba(24,31,28,.15);backdrop-filter:blur(5px)}
#v1133Timer.warn{color:#9c3f35;background:rgba(244,222,205,.86)}
#v1133Objective{position:absolute;left:calc(env(safe-area-inset-left) + 14px);top:calc(env(safe-area-inset-top) + 92px);max-width:min(310px,70vw);padding:5px 8px;border-radius:8px;background:rgba(232,226,209,.56);font-size:9px;line-height:1.35;color:#50605a;backdrop-filter:blur(3px)}
#v1133Hp{position:absolute;left:50%;bottom:calc(env(safe-area-inset-bottom) + 18px);transform:translateX(-50%);width:min(380px,58vw);min-width:190px;text-align:center}
#v1133HpText{display:inline-block;margin-bottom:5px;padding:3px 8px;border-radius:999px;background:rgba(236,229,211,.74);font-size:10px;font-weight:800;box-shadow:0 3px 10px rgba(24,31,28,.14)}
#v1133HpTrack{height:12px;padding:2px;border:1px solid rgba(244,239,219,.65);border-radius:999px;background:rgba(35,45,41,.58);box-shadow:0 4px 16px rgba(12,18,16,.25)}
#v1133HpFill{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#8b3e36,#bd6957);transition:width .12s linear}
#v1133Return{position:absolute;right:calc(env(safe-area-inset-right) + 14px);bottom:calc(env(safe-area-inset-bottom) + 18px);pointer-events:auto;min-width:74px;min-height:42px;padding:7px 12px;border:1px solid rgba(238,232,214,.62);border-radius:12px;background:rgba(238,231,212,.82);color:#2b3b35;font-weight:800;font-size:11px;box-shadow:0 5px 18px rgba(20,28,24,.2);backdrop-filter:blur(5px)}
#v1133Return:active{transform:translateY(1px)}
@media(max-width:560px){
  #v1133Loot{left:calc(env(safe-area-inset-left) + 9px);top:calc(env(safe-area-inset-top) + 9px);min-width:112px;padding:7px 9px;font-size:10px}
  #v1133Timer{right:calc(env(safe-area-inset-right) + 9px);top:calc(env(safe-area-inset-top) + 9px);font-size:11px}
  #v1133Objective{left:calc(env(safe-area-inset-left) + 9px);top:calc(env(safe-area-inset-top) + 79px);max-width:64vw}
  #v1133Hp{width:min(300px,62vw);bottom:calc(env(safe-area-inset-bottom) + 12px)}
  #v1133Return{right:calc(env(safe-area-inset-right) + 9px);bottom:calc(env(safe-area-inset-bottom) + 10px);min-width:66px;min-height:38px}
}
`;
  document.head.appendChild(style);
}

function makeHud(){
  let hud=$('#v1133Hud');
  if(hud)return hud;
  hud=document.createElement('div');
  hud.id='v1133Hud';
  hud.innerHTML=`
    <div id="v1133Loot"><b>이번 원정</b><div id="v1133Stone">영석 0</div><div id="v1133Herbs">영초 下0 · 中0 · 上0</div></div>
    <div id="v1133Timer">25.0초</div>
    <div id="v1133Objective"></div>
    <div id="v1133Hp"><div id="v1133HpText">36 / 36</div><div id="v1133HpTrack"><i id="v1133HpFill"></i></div></div>
    <button id="v1133Return" type="button">귀환</button>
  `;
  game.appendChild(hud);
  hud.querySelector('#v1133Return').onclick=ev=>{
    ev.preventDefault();
    ev.stopPropagation();
    ret?.click();
  };
  return hud;
}

function layers(){
  return [cv,$('#v1131InkLayer'),$('#v1132GatherLayer')].filter(Boolean);
}

function clearLayerStyles(){
  for(const layer of layers()){
    layer.style.position='';
    layer.style.left='';
    layer.style.top='';
    layer.style.width='';
    layer.style.height='';
    layer.style.maxWidth='';
    layer.style.maxHeight='';
    layer.style.transform='';
    layer.style.transformOrigin='';
  }
}

function activate(s){
  if(state.active)return;
  state.active=true;
  state.ready=false;
  state.camX=s?.P?.x??350;
  state.camY=s?.P?.y??230;
  document.body.classList.add('v1133-run');
  makeHud();
}

function deactivate(){
  if(!state.active)return;
  state.active=false;
  state.ready=false;
  state.pressed=false;
  document.body.classList.remove('v1133-run');
  clearLayerStyles();
}

function clamp(v,a,b){return Math.max(a,Math.min(b,v))}

function viewMetrics(){
  const vw=Math.max(1,window.innerWidth||document.documentElement.clientWidth||390);
  const vh=Math.max(1,window.innerHeight||document.documentElement.clientHeight||844);
  const base=Math.max(vw/W,vh/H);
  const portrait=vh>vw;
  const zoom=portrait?1.08:1.34;
  const scale=base*zoom;
  return {vw,vh,scale,viewW:vw/scale,viewH:vh/scale};
}

function updateCamera(s){
  const p=s.P||{x:350,y:230};
  const m=viewMetrics();
  if(!state.ready){
    state.camX=p.x;
    state.camY=p.y;
    state.ready=true;
  }
  const deadX=m.viewW*.13;
  const deadY=m.viewH*.11;
  let targetX=state.camX;
  let targetY=state.camY;
  if(p.x<state.camX-deadX)targetX=p.x+deadX;
  else if(p.x>state.camX+deadX)targetX=p.x-deadX;
  if(p.y<state.camY-deadY)targetY=p.y+deadY;
  else if(p.y>state.camY+deadY)targetY=p.y-deadY;

  const halfW=m.viewW/2;
  const halfH=m.viewH/2;
  const minX=halfW,maxX=W-halfW;
  const minY=halfH,maxY=H-halfH;
  targetX=minX<=maxX?clamp(targetX,minX,maxX):W/2;
  targetY=minY<=maxY?clamp(targetY,minY,maxY):H/2;

  state.camX+=(targetX-state.camX)*.14;
  state.camY+=(targetY-state.camY)*.14;
  state.camX=minX<=maxX?clamp(state.camX,minX,maxX):W/2;
  state.camY=minY<=maxY?clamp(state.camY,minY,maxY):H/2;

  state.scale=m.scale;
  state.left=m.vw/2-state.camX*m.scale;
  state.top=m.vh/2-state.camY*m.scale;

  for(const layer of layers()){
    layer.style.position='absolute';
    layer.style.left=`${state.left}px`;
    layer.style.top=`${state.top}px`;
    layer.style.width=`${W*m.scale}px`;
    layer.style.height=`${H*m.scale}px`;
    layer.style.maxWidth='none';
    layer.style.maxHeight='none';
    layer.style.transform='none';
    layer.style.transformOrigin='0 0';
  }
}

function updateHud(s){
  const r=s.run||{};
  const p=s.P||{hp:0,max:1};
  const stone=$('#v1133Stone');
  const herbs=$('#v1133Herbs');
  const hpText=$('#v1133HpText');
  const hpFill=$('#v1133HpFill');
  const timer=$('#v1133Timer');
  const objective=$('#v1133Objective');
  if(stone)stone.textContent=`영석 ${Math.floor(r.s||0)}`;
  if(herbs)herbs.textContent=`영초 下${r.h0||0} · 中${r.h1||0} · 上${r.h2||0}`;
  if(hpText)hpText.textContent=`${Math.max(0,Math.ceil(p.hp||0))} / ${Math.max(1,Math.ceil(p.max||1))}`;
  if(hpFill)hpFill.style.width=`${clamp((p.hp||0)/Math.max(1,p.max||1)*100,0,100)}%`;
  const total=window.__xianxiaDebug?.constants?.RUN_TIME||25;
  const remaining=Math.max(0,total-(s.elapsed||0));
  if(timer){
    timer.textContent=`${remaining.toFixed(1)}초`;
    timer.classList.toggle('warn',remaining<=10);
  }
  if(objective){
    const source=$('#objective');
    objective.textContent=(source?.textContent||'').replace(/\s+/g,' ').trim();
  }
}

function screenToWorld(event){
  return {
    x:clamp((event.clientX-state.left)/state.scale,11,689),
    y:clamp((event.clientY-state.top)/state.scale,11,449)
  };
}

function moveFromPointer(event){
  const D=window.__xianxiaDebug;
  if(!state.active||!D?.moveTo)return;
  const p=screenToWorld(event);
  D.moveTo(p.x,p.y);
}

function interceptPointer(){
  cv.addEventListener('pointerdown',event=>{
    if(!state.active)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    state.pressed=true;
    cv.setPointerCapture?.(event.pointerId);
    moveFromPointer(event);
  },{capture:true,passive:false});
  cv.addEventListener('pointermove',event=>{
    if(!state.active||!state.pressed)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    moveFromPointer(event);
  },{capture:true,passive:false});
  const end=event=>{
    if(!state.active)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    state.pressed=false;
  };
  cv.addEventListener('pointerup',end,{capture:true,passive:false});
  cv.addEventListener('pointercancel',end,{capture:true,passive:false});
}

function frame(){
  const D=window.__xianxiaDebug;
  let s=null;
  try{s=D?.snapshot?.()}catch{}
  if(s?.phase==='run'){
    activate(s);
    updateCamera(s);
    updateHud(s);
  }else{
    deactivate();
  }
  requestAnimationFrame(frame);
}

installCss();
makeHud();
interceptPointer();
requestAnimationFrame(frame);
})();