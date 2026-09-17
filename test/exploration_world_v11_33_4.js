(()=>{
'use strict';
const VERSION='11.35.0';
const W=1800,H=2400,VISIBLE_H=960;
const SMOOTHING=.14,DEAD_X=.08,DEAD_Y=.06,LOOK_AHEAD=.08;
const $=s=>document.querySelector(s);
const camera={ready:false,x:W/2,y:H/2,prevX:null,prevY:null,leadX:0,leadY:0,lastTime:0};
let world=null;

function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function badge(){}

function installCss(){
  $('#v11334WorldStyle')?.remove();
  $('#v11335WorldStyle')?.remove();
  const style=document.createElement('style');
  style.id='v11335WorldStyle';
  style.textContent=`
#v11335World{display:none;position:absolute;z-index:1;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0;will-change:transform;pointer-events:none}
body.v1133-run #v11335World{display:block}
#v1133Backdrop{display:none!important}
#v11335World #cv,#v11335World #v1131InkLayer,#v11335World #v1132GatherLayer{position:absolute!important;left:0!important;top:0!important;right:auto!important;bottom:auto!important;inset:auto!important;width:${W}px!important;height:${H}px!important;max-width:none!important;max-height:none!important;transform:none!important;transform-origin:0 0!important}
#v11335World #cv{z-index:1!important}
#v11335World #v1131InkLayer{z-index:2!important}
#v11335World #v1132GatherLayer{z-index:3!important}
`;
  document.head.appendChild(style);
}

function ensureWorld(){
  const game=$('#game');
  if(!game)return null;
  if(!world){
    world=$('#v11335World');
    if(!world){world=document.createElement('div');world.id='v11335World';game.prepend(world)}
  }
  const nodes=[$('#cv'),$('#v1131InkLayer'),$('#v1132GatherLayer')].filter(Boolean);
  for(const node of nodes)if(node.parentElement!==world)world.appendChild(node);
  return world;
}

function resetCamera(){
  camera.ready=false;camera.prevX=camera.prevY=null;camera.leadX=camera.leadY=0;camera.lastTime=0;
  if(world)world.style.transform='';
}

function updateCamera(mode,snap){
  const p=snap?.P,w=ensureWorld();
  if(!p||!w)return;
  const vw=Math.max(1,window.innerWidth||document.documentElement.clientWidth||390);
  const vh=Math.max(1,window.innerHeight||document.documentElement.clientHeight||844);
  const scale=vh/VISIBLE_H;
  const viewW=vw/scale,viewH=VISIBLE_H;
  const now=performance.now();
  const dt=camera.lastTime?Math.min(.08,Math.max(.001,(now-camera.lastTime)/1000)):1/60;
  camera.lastTime=now;

  if(!camera.ready){
    camera.x=p.x;camera.y=p.y;camera.prevX=p.x;camera.prevY=p.y;camera.ready=true;
  }

  const dx=p.x-camera.prevX,dy=p.y-camera.prevY;
  camera.prevX=p.x;camera.prevY=p.y;
  const mag=Math.hypot(dx,dy);
  let wantLeadX=0,wantLeadY=0;
  if(mag>.02){wantLeadX=dx/mag*viewW*LOOK_AHEAD;wantLeadY=dy/mag*viewH*LOOK_AHEAD}
  const leadAlpha=1-Math.exp(-dt/.10);
  camera.leadX+=(wantLeadX-camera.leadX)*leadAlpha;
  camera.leadY+=(wantLeadY-camera.leadY)*leadAlpha;

  const focusX=p.x+camera.leadX,focusY=p.y+camera.leadY;
  const deadX=viewW*DEAD_X,deadY=viewH*DEAD_Y;
  let targetX=camera.x,targetY=camera.y;
  if(focusX<camera.x-deadX)targetX=focusX+deadX;
  else if(focusX>camera.x+deadX)targetX=focusX-deadX;
  if(focusY<camera.y-deadY)targetY=focusY+deadY;
  else if(focusY>camera.y+deadY)targetY=focusY-deadY;

  const halfW=viewW/2,halfH=viewH/2;
  targetX=clamp(targetX,halfW,W-halfW);
  targetY=clamp(targetY,halfH,H-halfH);
  const alpha=1-Math.exp(-dt/SMOOTHING);
  camera.x+=(targetX-camera.x)*alpha;
  camera.y+=(targetY-camera.y)*alpha;
  camera.x=clamp(camera.x,halfW,W-halfW);
  camera.y=clamp(camera.y,halfH,H-halfH);

  const left=vw*.5-camera.x*scale;
  const top=vh*.5-camera.y*scale;
  w.style.setProperty('transform',`matrix(${scale},0,0,${scale},${left},${top})`,'important');

  mode.camX=camera.x;mode.camY=camera.y;mode.left=left;mode.top=top;
  mode.scale=scale;mode.viewW=viewW;mode.viewH=viewH;
  badge(`BUILD ${VERSION} · CAM ${scale.toFixed(2)}× · 960H · WORLD ${W}×${H}`);
}

function frame(){
  const mode=window.__xianxiaExplorationMode,D=window.__xianxiaDebug;
  let snap=null;
  try{snap=D?.snapshot?.()}catch{}
  ensureWorld();
  if(mode?.active&&snap?.phase==='run')updateCamera(mode,snap);
  else{resetCamera();badge(`BUILD ${VERSION} · CAM ✓ · WORLD ${W}×${H}`)}
  requestAnimationFrame(frame);
}

installCss();ensureWorld();badge(`BUILD ${VERSION} · CAM ✓ · WORLD ${W}×${H}`);requestAnimationFrame(frame);
})();