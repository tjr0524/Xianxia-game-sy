(()=>{
'use strict';
const VERSION='11.49.5-viewport';
const W=1800,H=2400,VISIBLE_H=960;
const SMOOTHING=.14,DEAD_X=.08,DEAD_Y=.06,LOOK_AHEAD=.08;
const $=s=>document.querySelector(s);
const camera={ready:false,x:W/2,y:H/2,prevX:null,prevY:null,leadX:0,leadY:0,lastTime:0};

function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function badge(){}

function retireWorldWrapper(){
  const game=$('#game'),old=$('#v11335World');
  if(!game||!old)return;
  const overlay=$('#ov');
  for(const node of [$('#cv'),$('#v1131InkLayer')].filter(Boolean)){
    if(node.parentElement===old){
      if(overlay&&overlay.parentElement===game)game.insertBefore(node,overlay);
      else game.appendChild(node);
    }
  }
  old.remove();
}

function installCss(){
  $('#v11334WorldStyle')?.remove();
  $('#v11335WorldStyle')?.remove();
  const style=document.createElement('style');
  style.id='v11335WorldStyle';
  style.textContent=`
#v11335World{display:none!important}
body.v1133-run #cv{display:none!important}
body.v1133-run #v1131InkLayer{
  display:block!important;position:absolute!important;z-index:2!important;
  inset:0!important;width:100%!important;height:100%!important;
  max-width:none!important;max-height:none!important;
  transform:none!important;transform-origin:0 0!important;
  pointer-events:none!important;contain:strict
}
`;
  document.head.appendChild(style);
}

function resetCamera(mode){
  camera.ready=false;camera.prevX=camera.prevY=null;camera.leadX=camera.leadY=0;camera.lastTime=0;
  if(mode){
    mode.left=0;mode.top=0;mode.scale=1;mode.viewW=W;mode.viewH=H;
    mode.viewportW=0;mode.viewportH=0;mode.cameraOwner='viewport-renderer';
  }
}

function viewportSize(){
  const game=$('#game');
  const rect=game?.getBoundingClientRect?.();
  const vw=Math.max(1,rect?.width||window.innerWidth||document.documentElement.clientWidth||390);
  const vh=Math.max(1,rect?.height||window.innerHeight||document.documentElement.clientHeight||844);
  return {vw,vh};
}

function updateCamera(mode,snap){
  const p=snap?.P;
  if(!p)return;
  const {vw,vh}=viewportSize();
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
  mode.camX=camera.x;mode.camY=camera.y;mode.left=left;mode.top=top;
  mode.scale=scale;mode.viewW=viewW;mode.viewH=viewH;
  mode.viewportW=vw;mode.viewportH=vh;mode.cameraOwner='viewport-renderer';
  badge(`BUILD ${VERSION} · VIEW ${Math.round(vw)}×${Math.round(vh)} · CAM ${scale.toFixed(2)}×`);
}

function cameraFrame(snap){
  const mode=window.__xianxiaExplorationMode;
  if(mode?.active&&snap?.phase==='run')updateCamera(mode,snap);
  else resetCamera(mode);
}

function subscribeFrame(){
  const hub=window.__xianxiaFrameHub;
  if(hub?.subscribe){
    hub.subscribe('world-camera',cameraFrame,20);
    return;
  }
  function fallback(){
    const D=window.__xianxiaDebug;let snap=null;try{snap=D?.snapshot?.()}catch{}
    cameraFrame(snap);
    requestAnimationFrame(fallback);
  }
  requestAnimationFrame(fallback);
}

installCss();
retireWorldWrapper();
subscribeFrame();
})();
