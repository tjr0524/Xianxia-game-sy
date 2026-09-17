(()=>{
'use strict';
if(window.__xianxiaExplorationMode?.version==='11.33.1')return;

const W=700,H=460,EXIT={x:350,y:415};
const $=s=>document.querySelector(s);
const game=$('#game');
const cv=$('#cv');
const ret=$('#ret');
if(!game||!cv)return;

const state={
  version:'11.33.1',active:false,camX:350,camY:230,ready:false,pressed:false,
  left:0,top:0,scale:1,viewW:W,viewH:H,lastPhase:'home',returning:false,
  prevPX:null,prevPY:null,leadX:0,leadY:0,hires:false,spritePatched:false
};
window.__xianxiaExplorationMode=state;

function installCss(){
  if($('#v1133ExplorationStyle'))return;
  const style=document.createElement('style');
  style.id='v1133ExplorationStyle';
  style.textContent=`
body.v1133-run{overflow:hidden!important;overscroll-behavior:none!important;background:#101713!important}
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
body.v1133-run .arena-card{position:fixed!important;z-index:1000!important;inset:0!important;width:100vw!important;height:100dvh!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;background:#101713!important;overflow:hidden!important}
body.v1133-run #game{position:absolute!important;inset:0!important;width:100vw!important;height:100dvh!important;border:0!important;border-radius:0!important;box-shadow:none!important;overflow:hidden!important;background:radial-gradient(circle at 50% 45%,#354039 0,#1d2924 52%,#101713 100%)!important}
body.v1133-run #game canvas{max-width:none!important;max-height:none!important;touch-action:none!important}
body.v1133-run #cv{opacity:0!important}
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
#v1133Return.returning{background:rgba(186,211,195,.88);border-color:rgba(79,119,102,.4)}
#v1133Return:active{transform:translateY(1px)}
#v1133Guide{position:absolute;z-index:26;display:none;width:42px;height:42px;margin:-21px 0 0 -21px;border-radius:50%;background:rgba(235,230,213,.86);border:1px solid rgba(74,98,86,.45);box-shadow:0 5px 17px rgba(20,28,24,.23);backdrop-filter:blur(5px);transform-origin:50% 50%;pointer-events:none}
#v1133Guide::before{content:"";position:absolute;left:14px;top:10px;width:0;height:0;border-top:11px solid transparent;border-bottom:11px solid transparent;border-left:17px solid #527a6d;filter:drop-shadow(0 1px 1px rgba(255,255,255,.5))}
#v1133GuideLabel{position:absolute;left:50%;top:46px;transform:translateX(-50%);padding:2px 6px;border-radius:999px;background:rgba(235,230,213,.82);font-size:8px;font-weight:800;white-space:nowrap;color:#385448}
@media(max-width:560px){
  #v1133Loot{left:calc(env(safe-area-inset-left) + 9px);top:calc(env(safe-area-inset-top) + 9px);min-width:112px;padding:7px 9px;font-size:10px}
  #v1133Timer{right:calc(env(safe-area-inset-right) + 9px);top:calc(env(safe-area-inset-top) + 9px);font-size:11px}
  #v1133Objective{left:calc(env(safe-area-inset-left) + 9px);top:calc(env(safe-area-inset-top) + 79px);max-width:64vw}
  #v1133Hp{width:min(300px,62vw);bottom:calc(env(safe-area-inset-bottom) + 12px)}
  #v1133Return{right:calc(env(safe-area-inset-right) + 9px);bottom:calc(env(safe-area-inset-bottom) + 10px);min-width:66px;min-height:38px}
  #v1133Guide{width:38px;height:38px;margin:-19px 0 0 -19px}
  #v1133Guide::before{left:13px;top:9px;border-top-width:10px;border-bottom-width:10px;border-left-width:15px}
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
    <div id="v1133Guide"><span id="v1133GuideLabel">귀환진</span></div>
  `;
  game.appendChild(hud);
  hud.querySelector('#v1133Return').onclick=ev=>{
    ev.preventDefault();ev.stopPropagation();
    state.returning=true;
    ret?.click();
  };
  return hud;
}

function layers(){return [cv,$('#v1131InkLayer'),$('#v1132GatherLayer')].filter(Boolean)}
function clearLayerStyles(){for(const layer of layers()){layer.style.position='';layer.style.left='';layer.style.top='';layer.style.width='';layer.style.height='';layer.style.maxWidth='';layer.style.maxHeight='';layer.style.transform='';layer.style.transformOrigin=''}}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}

function ensureHiDpiAndSpriteScale(){
  const ink=$('#v1131InkLayer');
  const runtime=window.__xianxiaInkRuntime;
  const ctx=runtime?.ctx;
  if(!ink||!ctx)return;
  if(!state.hires&&ink.width===W&&ink.height===H){
    const dpr=Math.min(2,Math.max(1.5,window.devicePixelRatio||1));
    ink.width=Math.round(W*dpr);ink.height=Math.round(H*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.imageSmoothingEnabled=true;
    state.hires=dpr;
  }
  if(!state.spritePatched){
    const original=ctx.drawImage.bind(ctx);
    ctx.drawImage=function(...args){
      if(state.active&&args.length===9){
        const img=args[0];
        const src=String(img?.currentSrc||img?.src||'');
        if(/player_core|qingyun_(stone_boar|wind_wolf)|blackwind_(horned_yak|ink_panther)|blood_(armored_bear|ember_fox)|thunder_(stone_rhino|lightning_leopard)/.test(src)){
          const k=.80;
          const dx=args[5],dy=args[6],dw=args[7],dh=args[8];
          const ground=dy+dh;
          args[7]=dw*k;args[8]=dh*k;
          args[5]=dx+(dw-args[7])/2;
          args[6]=ground-args[8];
        }
      }
      return original(...args);
    };
    state.spritePatched=true;
  }
}

function activate(s){
  if(state.active)return;
  state.active=true;state.ready=false;state.returning=false;
  state.camX=s?.P?.x??350;state.camY=s?.P?.y??230;
  state.prevPX=s?.P?.x??null;state.prevPY=s?.P?.y??null;state.leadX=0;state.leadY=0;
  document.body.classList.add('v1133-run');makeHud();ensureHiDpiAndSpriteScale();
}
function deactivate(){
  if(!state.active)return;
  state.active=false;state.ready=false;state.pressed=false;state.returning=false;
  state.prevPX=state.prevPY=null;state.leadX=state.leadY=0;
  document.body.classList.remove('v1133-run');clearLayerStyles();
  const guide=$('#v1133Guide');if(guide)guide.style.display='none';
}

function viewMetrics(){
  const vw=Math.max(1,window.innerWidth||document.documentElement.clientWidth||390);
  const vh=Math.max(1,window.innerHeight||document.documentElement.clientHeight||844);
  const base=Math.max(vw/W,vh/H);
  const portrait=vh>vw;
  const zoom=portrait?1.00:1.20;
  const scale=base*zoom;
  return {vw,vh,scale,viewW:vw/scale,viewH:vh/scale,portrait};
}

function updateLead(p,m){
  if(state.prevPX==null){state.prevPX=p.x;state.prevPY=p.y;return}
  const dx=p.x-state.prevPX,dy=p.y-state.prevPY;
  state.prevPX=p.x;state.prevPY=p.y;
  const mag=Math.hypot(dx,dy);
  let tx=0,ty=0;
  if(mag>.08){
    const lead=m.portrait?46:38;
    tx=dx/mag*lead;ty=dy/mag*lead;
  }
  state.leadX+=(tx-state.leadX)*.075;
  state.leadY+=(ty-state.leadY)*.075;
  if(mag<.03){state.leadX*=.94;state.leadY*=.94}
}

function updateCamera(s){
  const p=s.P||{x:350,y:230};
  const m=viewMetrics();
  updateLead(p,m);
  state.viewW=m.viewW;state.viewH=m.viewH;
  const focusX=p.x+state.leadX,focusY=p.y+state.leadY;
  if(!state.ready){state.camX=focusX;state.camY=focusY;state.ready=true}
  const deadX=m.viewW*.10,deadY=m.viewH*.085;
  let targetX=state.camX,targetY=state.camY;
  if(focusX<state.camX-deadX)targetX=focusX+deadX;
  else if(focusX>state.camX+deadX)targetX=focusX-deadX;
  if(focusY<state.camY-deadY)targetY=focusY+deadY;
  else if(focusY>state.camY+deadY)targetY=focusY-deadY;
  const halfW=m.viewW/2,halfH=m.viewH/2;
  const minX=halfW,maxX=W-halfW,minY=halfH,maxY=H-halfH;
  targetX=minX<=maxX?clamp(targetX,minX,maxX):W/2;
  targetY=minY<=maxY?clamp(targetY,minY,maxY):H/2;
  state.camX+=(targetX-state.camX)*.105;state.camY+=(targetY-state.camY)*.105;
  state.camX=minX<=maxX?clamp(state.camX,minX,maxX):W/2;
  state.camY=minY<=maxY?clamp(state.camY,minY,maxY):H/2;
  state.scale=m.scale;state.left=m.vw/2-state.camX*m.scale;state.top=m.vh/2-state.camY*m.scale;
  for(const layer of layers()){
    layer.style.position='absolute';layer.style.left=`${state.left}px`;layer.style.top=`${state.top}px`;
    layer.style.width=`${W*m.scale}px`;layer.style.height=`${H*m.scale}px`;
    layer.style.maxWidth='none';layer.style.maxHeight='none';layer.style.transform='none';layer.style.transformOrigin='0 0';
  }
}

function worldToScreen(x,y){return {x:state.left+x*state.scale,y:state.top+y*state.scale}}
function updateReturnGuide(s){
  const guide=$('#v1133Guide'),button=$('#v1133Return');
  if(button){button.classList.toggle('returning',state.returning);button.textContent=state.returning?'귀환 중':'귀환'}
  if(!guide||!state.returning){if(guide)guide.style.display='none';return}
  const p=s.P||{x:350,y:230};
  const target=worldToScreen(EXIT.x,EXIT.y),player=worldToScreen(p.x,p.y);
  const vw=window.innerWidth||390,vh=window.innerHeight||844;
  if(target.x>44&&target.x<vw-44&&target.y>54&&target.y<vh-72){guide.style.display='none';return}
  let dx=target.x-player.x,dy=target.y-player.y;
  const d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;
  const marginX=50,marginTop=68,marginBottom=82;
  const limits=[];
  if(dx>.001)limits.push((vw-marginX-player.x)/dx);else if(dx<-.001)limits.push((marginX-player.x)/dx);
  if(dy>.001)limits.push((vh-marginBottom-player.y)/dy);else if(dy<-.001)limits.push((marginTop-player.y)/dy);
  const positive=limits.filter(v=>v>0);const t=positive.length?Math.min(...positive):80;
  const gx=clamp(player.x+dx*t,marginX,vw-marginX),gy=clamp(player.y+dy*t,marginTop,vh-marginBottom);
  guide.style.display='block';guide.style.left=`${gx}px`;guide.style.top=`${gy}px`;
  guide.style.transform=`rotate(${Math.atan2(dy,dx)*180/Math.PI}deg)`;
  const label=$('#v1133GuideLabel');if(label)label.style.transform=`translateX(-50%) rotate(${-Math.atan2(dy,dx)*180/Math.PI}deg)`;
}

function updateHud(s){
  const r=s.run||{},p=s.P||{hp:0,max:1};
  const stone=$('#v1133Stone'),herbs=$('#v1133Herbs'),hpText=$('#v1133HpText'),hpFill=$('#v1133HpFill'),timer=$('#v1133Timer'),objective=$('#v1133Objective');
  if(stone)stone.textContent=`영석 ${Math.floor(r.s||0)}`;
  if(herbs)herbs.textContent=`영초 下${r.h0||0} · 中${r.h1||0} · 上${r.h2||0}`;
  if(hpText)hpText.textContent=`${Math.max(0,Math.ceil(p.hp||0))} / ${Math.max(1,Math.ceil(p.max||1))}`;
  if(hpFill)hpFill.style.width=`${clamp((p.hp||0)/Math.max(1,p.max||1)*100,0,100)}%`;
  const total=window.__xianxiaDebug?.constants?.RUN_TIME||25,remaining=Math.max(0,total-(s.elapsed||0));
  if(timer){timer.textContent=`${remaining.toFixed(1)}초`;timer.classList.toggle('warn',remaining<=10)}
  if(objective){const source=$('#objective');objective.textContent=(source?.textContent||'').replace(/\s+/g,' ').trim()}
  updateReturnGuide(s);
}

function screenToWorld(event){return {x:clamp((event.clientX-state.left)/state.scale,11,689),y:clamp((event.clientY-state.top)/state.scale,11,449)}}
function moveFromPointer(event){
  const D=window.__xianxiaDebug;if(!state.active||!D?.moveTo)return;
  state.returning=false;
  const p=screenToWorld(event);D.moveTo(p.x,p.y);
}
function interceptPointer(){
  cv.addEventListener('pointerdown',event=>{if(!state.active)return;event.preventDefault();event.stopImmediatePropagation();state.pressed=true;cv.setPointerCapture?.(event.pointerId);moveFromPointer(event)},{capture:true,passive:false});
  cv.addEventListener('pointermove',event=>{if(!state.active||!state.pressed)return;event.preventDefault();event.stopImmediatePropagation();moveFromPointer(event)},{capture:true,passive:false});
  const end=event=>{if(!state.active)return;event.preventDefault();event.stopImmediatePropagation();state.pressed=false};
  cv.addEventListener('pointerup',end,{capture:true,passive:false});cv.addEventListener('pointercancel',end,{capture:true,passive:false});
}

function frame(){
  const D=window.__xianxiaDebug;let s=null;try{s=D?.snapshot?.()}catch{}
  if(s?.phase==='run'){activate(s);ensureHiDpiAndSpriteScale();updateCamera(s);updateHud(s)}else deactivate();
  requestAnimationFrame(frame);
}

installCss();makeHud();interceptPointer();requestAnimationFrame(frame);
})();