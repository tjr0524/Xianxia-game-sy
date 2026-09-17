(()=>{
'use strict';
const VERSION='11.33.4';
const W=700,H=460,PAD_X=260,PAD_Y=390;
const $=s=>document.querySelector(s);
const camera={ready:false,x:350,y:230,prevX:null,prevY:null,leadX:0,leadY:0};

function clamp(v,a,b){return Math.max(a,Math.min(b,v))}

function installCss(){
  if($('#v11334WorldStyle'))return;
  const style=document.createElement('style');
  style.id='v11334WorldStyle';
  style.textContent=`
body.v1133-run #v1133Backdrop{
  inset:auto!important;
  right:auto!important;
  bottom:auto!important;
  transform:none!important;
  transform-origin:0 0!important;
  background-position:center!important;
  background-size:cover!important;
  background-repeat:no-repeat!important;
  will-change:left,top,width,height!important;
}
body.v1133-run #v1133Backdrop::after{
  box-shadow:inset 0 0 120px rgba(24,28,24,.16)!important;
}
`;
  document.head.appendChild(style);
}

function badge(text){
  const el=$('#buildVersion');
  if(el)el.textContent=text;
}

function resetCamera(){
  camera.ready=false;
  camera.prevX=camera.prevY=null;
  camera.leadX=camera.leadY=0;
}

function moveLayer(layer,left,top,scale){
  if(!layer)return;
  layer.style.setProperty('position','absolute','important');
  layer.style.setProperty('left',`${left}px`,'important');
  layer.style.setProperty('top',`${top}px`,'important');
  layer.style.setProperty('right','auto','important');
  layer.style.setProperty('bottom','auto','important');
  layer.style.setProperty('width',`${W*scale}px`,'important');
  layer.style.setProperty('height',`${H*scale}px`,'important');
  layer.style.setProperty('max-width','none','important');
  layer.style.setProperty('max-height','none','important');
  layer.style.setProperty('transform','none','important');
  layer.style.setProperty('transform-origin','0 0','important');
}

function moveBackground(bg,left,top,scale){
  if(!bg)return;
  bg.style.setProperty('left',`${left-PAD_X*scale}px`,'important');
  bg.style.setProperty('top',`${top-PAD_Y*scale}px`,'important');
  bg.style.setProperty('width',`${(W+PAD_X*2)*scale}px`,'important');
  bg.style.setProperty('height',`${(H+PAD_Y*2)*scale}px`,'important');
  bg.style.setProperty('inset','auto','important');
  bg.style.setProperty('transform','none','important');
}

function updateCamera(mode,snap){
  const p=snap?.P;
  if(!p)return;

  const vw=Math.max(1,window.innerWidth||document.documentElement.clientWidth||390);
  const vh=Math.max(1,window.innerHeight||document.documentElement.clientHeight||844);
  const portrait=vh>vw;
  const scale=Math.max(.01,Number(mode.scale)||1);

  if(!camera.ready){
    camera.x=Number(mode.camX)||p.x||350;
    camera.y=Number(mode.camY)||p.y||230;
    camera.prevX=p.x;
    camera.prevY=p.y;
    camera.ready=true;
  }

  const dx=p.x-camera.prevX,dy=p.y-camera.prevY;
  camera.prevX=p.x;camera.prevY=p.y;
  const mag=Math.hypot(dx,dy);
  let wantLeadX=0,wantLeadY=0;
  if(mag>.05){
    const lead=portrait?44:36;
    wantLeadX=dx/mag*lead;
    wantLeadY=dy/mag*lead;
  }
  camera.leadX+=(wantLeadX-camera.leadX)*.11;
  camera.leadY+=(wantLeadY-camera.leadY)*.11;
  if(mag<.02){camera.leadX*=.94;camera.leadY*=.94}

  const focusX=p.x+camera.leadX;
  const focusY=p.y+camera.leadY;
  camera.x+=(focusX-camera.x)*.14;
  camera.y+=(focusY-camera.y)*.14;
  camera.x=clamp(camera.x,55,W-55);
  camera.y=clamp(camera.y,55,H-55);

  const anchorY=portrait?vh*.54:vh*.50;
  const left=vw*.5-camera.x*scale;
  const top=anchorY-camera.y*scale;

  mode.camX=camera.x;
  mode.camY=camera.y;
  mode.left=left;
  mode.top=top;

  moveLayer($('#cv'),left,top,scale);
  moveLayer($('#v1131InkLayer'),left,top,scale);
  moveLayer($('#v1132GatherLayer'),left,top,scale);
  moveBackground($('#v1133Backdrop'),left,top,scale);

  badge(`BUILD ${VERSION} · CAM ${scale.toFixed(2)}× · WORLD ✓`);
}

function frame(){
  const mode=window.__xianxiaExplorationMode;
  const D=window.__xianxiaDebug;
  let snap=null;
  try{snap=D?.snapshot?.()}catch{}

  if(mode?.active&&snap?.phase==='run'){
    updateCamera(mode,snap);
  }else{
    resetCamera();
    badge(`BUILD ${VERSION} · CAM ✓ · WORLD ✓`);
  }
  requestAnimationFrame(frame);
}

installCss();
badge(`BUILD ${VERSION} · CAM ✓ · WORLD ✓`);
requestAnimationFrame(frame);
})();
