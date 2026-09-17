(()=>{
'use strict';
const VERSION='11.33.5';
const W=700,H=460,PAD_X=260,PAD_Y=390;
const $=s=>document.querySelector(s);
const camera={ready:false,x:350,y:230,prevX:null,prevY:null,leadX:0,leadY:0};
let world=null;

function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function badge(text){const el=$('#buildVersion');if(el)el.textContent=text}

function installCss(){
  $('#v11334WorldStyle')?.remove();
  $('#v11335WorldStyle')?.remove();
  const style=document.createElement('style');
  style.id='v11335WorldStyle';
  style.textContent=`
#v11335World{display:none;position:absolute;z-index:1;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0;will-change:transform;pointer-events:none}
body.v1133-run #v11335World{display:block}
#v11335World #v1133Backdrop{position:absolute!important;z-index:0!important;left:-${PAD_X}px!important;top:-${PAD_Y}px!important;right:auto!important;bottom:auto!important;inset:auto!important;width:${W+PAD_X*2}px!important;height:${H+PAD_Y*2}px!important;transform:none!important;transform-origin:0 0!important;background-position:center!important;background-size:cover!important;background-repeat:no-repeat!important;pointer-events:none!important}
#v11335World #cv,#v11335World #v1131InkLayer,#v11335World #v1132GatherLayer{position:absolute!important;left:0!important;top:0!important;right:auto!important;bottom:auto!important;inset:auto!important;width:${W}px!important;height:${H}px!important;max-width:none!important;max-height:none!important;transform:none!important;transform-origin:0 0!important}
#v11335World #cv{z-index:1!important}
#v11335World #v1131InkLayer{z-index:2!important}
#v11335World #v1132GatherLayer{z-index:3!important}
body:not(.v1133-run) #v1133Backdrop{display:none!important}
`;
  document.head.appendChild(style);
}

function ensureWorld(){
  const game=$('#game');
  if(!game)return null;
  if(!world){
    world=$('#v11335World');
    if(!world){
      world=document.createElement('div');
      world.id='v11335World';
      game.prepend(world);
    }
  }
  const nodes=[$('#v1133Backdrop'),$('#cv'),$('#v1131InkLayer'),$('#v1132GatherLayer')].filter(Boolean);
  for(const node of nodes)if(node.parentElement!==world)world.appendChild(node);
  return world;
}

function resetCamera(){
  camera.ready=false;
  camera.prevX=camera.prevY=null;
  camera.leadX=camera.leadY=0;
  if(world)world.style.transform='';
}

function updateCamera(mode,snap){
  const p=snap?.P,w=ensureWorld();
  if(!p||!w)return;
  const vw=Math.max(1,window.innerWidth||document.documentElement.clientWidth||390);
  const vh=Math.max(1,window.innerHeight||document.documentElement.clientHeight||844);
  const portrait=vh>vw;
  const scale=Math.max(.01,Number(mode.scale)||1);

  if(!camera.ready){
    camera.x=p.x;camera.y=p.y;
    camera.prevX=p.x;camera.prevY=p.y;
    camera.ready=true;
  }

  const dx=p.x-camera.prevX,dy=p.y-camera.prevY;
  camera.prevX=p.x;camera.prevY=p.y;
  const mag=Math.hypot(dx,dy);
  let wantLeadX=0,wantLeadY=0;
  if(mag>.035){
    const lead=portrait?38:32;
    wantLeadX=dx/mag*lead;
    wantLeadY=dy/mag*lead;
  }
  camera.leadX+=(wantLeadX-camera.leadX)*.12;
  camera.leadY+=(wantLeadY-camera.leadY)*.12;
  if(mag<.018){camera.leadX*=.92;camera.leadY*=.92}

  const targetX=p.x+camera.leadX;
  const targetY=p.y+camera.leadY;
  camera.x+=(targetX-camera.x)*.20;
  camera.y+=(targetY-camera.y)*.20;

  const halfViewW=Math.min(W/2,vw/(2*scale));
  const minX=Math.max(55,halfViewW),maxX=Math.min(W-55,W-halfViewW);
  camera.x=minX<=maxX?clamp(camera.x,minX,maxX):W/2;
  camera.y=clamp(camera.y,70,H-70);

  const anchorX=vw*.5;
  const anchorY=portrait?vh*.54:vh*.50;
  const left=anchorX-camera.x*scale;
  const top=anchorY-camera.y*scale;
  w.style.setProperty('transform',`matrix(${scale},0,0,${scale},${left},${top})`,'important');

  mode.camX=camera.x;mode.camY=camera.y;mode.left=left;mode.top=top;
  badge(`BUILD ${VERSION} · CAM ${scale.toFixed(2)}× ✓`);
}

function frame(){
  const mode=window.__xianxiaExplorationMode,D=window.__xianxiaDebug;
  let snap=null;
  try{snap=D?.snapshot?.()}catch{}
  ensureWorld();
  if(mode?.active&&snap?.phase==='run')updateCamera(mode,snap);
  else{resetCamera();badge(`BUILD ${VERSION} · CAM ✓`)}
  requestAnimationFrame(frame);
}

installCss();ensureWorld();badge(`BUILD ${VERSION} · CAM ✓`);requestAnimationFrame(frame);
})();
