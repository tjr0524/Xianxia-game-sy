(()=>{
'use strict';
if(window.__xianxiaSpriteRuntime?.version==='11.28')return;

const W=700,H=460,EXIT={x:350,y:438};
const state={version:'11.28',ready:false,error:null,atlas:null,manifest:null,layer:null,ctx:null};
window.__xianxiaSpriteRuntime=state;

const imageUrl='assets/brush_v1/brush_v1_atlas.png?v=11.28';
const manifestUrl='assets/brush_v1/manifest.json?v=11.28';
const tracks=new Map();
const deaths=[];
let nextTrackId=1;
let previousPlayer=null;
let playerFacing=1;
let started=false;

function addCss(){
  if(document.querySelector('#v1128spritecss'))return;
  const s=document.createElement('style');
  s.id='v1128spritecss';
  s.textContent=`
#game{position:relative}
#v27ObjectLayer{display:none!important}
#v1128SpriteLayer{position:absolute!important;inset:0!important;z-index:5!important;width:100%!important;height:100%!important;pointer-events:none!important;filter:none!important;mix-blend-mode:normal!important}
`;
  document.head.appendChild(s);
}

function makeLayer(){
  const game=document.querySelector('#game');
  const base=document.querySelector('#cv');
  if(!game||!base)return false;
  let layer=document.querySelector('#v1128SpriteLayer');
  if(!layer){
    layer=document.createElement('canvas');
    layer.id='v1128SpriteLayer';
    layer.width=W;layer.height=H;
    layer.setAttribute('aria-hidden','true');
    const old=document.querySelector('#v27ObjectLayer');
    (old||base).insertAdjacentElement('afterend',layer);
  }
  const ctx=layer.getContext('2d');
  ctx.imageSmoothingEnabled=true;
  state.layer=layer;state.ctx=ctx;
  return true;
}

function loadImage(src){
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>resolve(img);
    img.onerror=()=>reject(new Error('sprite atlas load failed'));
    img.src=src;
  });
}

function meta(name){return state.manifest?.animations?.[name]||null}
function loopFrame(name,time,offset=0){
  const a=meta(name);if(!a)return 0;
  return Math.floor((time+offset)*a.fps)%a.frame_count;
}
function progressFrame(name,progress){
  const a=meta(name);if(!a)return 0;
  return Math.max(0,Math.min(a.frame_count-1,Math.floor(Math.max(0,Math.min(.9999,progress))*a.frame_count)));
}
function shadow(ctx,x,y,w,h,a=.17){
  ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#34403a';ctx.beginPath();ctx.ellipse(x,y,w,h,0,0,Math.PI*2);ctx.fill();ctx.restore();
}
function drawSprite(name,frame,x,y,w,h,flip=false,alpha=1){
  const a=meta(name),ctx=state.ctx,img=state.atlas;
  if(!a||!ctx||!img)return false;
  const f=Math.max(0,Math.min(a.frame_count-1,frame|0));
  const sx=a.x+f*a.cell_width,sy=a.y;
  ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);if(flip)ctx.scale(-1,1);
  ctx.drawImage(img,sx,sy,a.cell_width,a.cell_height,-w/2,-h,w,h);
  ctx.restore();
  return true;
}
function dist(a,b){return Math.hypot((a?.x||0)-(b?.x||0),(a?.y||0)-(b?.y||0))}

function matchWolves(current,now){
  const candidates=[...tracks.values()];
  const used=new Set();
  const matched=[];
  for(const wolf of current){
    let best=null,bestD=64;
    for(const t of candidates){
      if(used.has(t.id))continue;
      const d=Math.hypot(wolf.x-t.x,wolf.y-t.y);
      if(d<bestD){bestD=d;best=t}
    }
    if(!best){
      best={id:nextTrackId++,x:wolf.x,y:wolf.y,px:wolf.x,py:wolf.y,seen:now,facing:1,attackStart:-1,lastAttack:-999};
      tracks.set(best.id,best);
    }else used.add(best.id);
    best.px=best.x;best.py=best.y;best.x=wolf.x;best.y=wolf.y;best.seen=now;best.wolf=wolf;
    const dx=best.x-best.px;if(Math.abs(dx)>.15)best.facing=dx<0?-1:1;
    matched.push(best);
  }
  for(const t of [...tracks.values()]){
    if(matched.includes(t))continue;
    if(now-t.seen<.16){
      deaths.push({x:t.x,y:t.y,facing:t.facing,start:now});
    }
    tracks.delete(t.id);
  }
  return matched;
}

function renderPortal(time){
  shadow(state.ctx,EXIT.x,EXIT.y+1,31,6,.13);
  drawSprite('return_portal',loopFrame('return_portal',time),EXIT.x,EXIT.y+5,74,82,false,.96);
}
function renderHerbs(objects,time){
  for(const o of objects){
    if(o.type!=='h')continue;
    const name=o.grade===2?'herb_high':o.grade===1?'herb_mid':'herb_low';
    shadow(state.ctx,o.x,o.y+11,11,3.5,.15);
    drawSprite(name,loopFrame(name,time,(o.x+o.y)*.0017),o.x,o.y+12,34,44,false,1);
  }
}
function renderPlayer(s,time){
  const p=s.P;if(!p)return;
  let moving=false,dx=0;
  if(previousPlayer){dx=p.x-previousPlayer.x;const dy=p.y-previousPlayer.y;moving=Math.hypot(dx,dy)>.18}
  if(Math.abs(dx)>.12)playerFacing=dx<0?-1:1;
  if(p.cd>0.01&&p.tx!==undefined&&Math.abs(p.tx-p.x)>2)playerFacing=p.tx<p.x?-1:1;
  const mortal=(s.M?.realm?.major??-1)<0;
  const atkLv=s.M?.cult?.atk||1;
  const maxCd=Math.max(.2,.55-(atkLv-1)*.02);
  const attacking=!mortal&&p.cd>0.01;
  let name='player_move',frame=0,w=34,h=59;
  if(attacking){
    name='player_attack';frame=progressFrame(name,1-Math.min(maxCd,p.cd)/maxCd);w=48;h=66;
  }else if(moving){frame=loopFrame(name,time)}
  shadow(state.ctx,p.x,p.y+14,12,3.5,.18);
  drawSprite(name,frame,p.x,p.y+16,w,h,playerFacing<0,1);
  previousPlayer={x:p.x,y:p.y};
}
function renderWolves(s,time){
  const wolves=(s.enemies||[]).filter(e=>e.type==='guard');
  const matched=matchWolves(wolves,performance.now()/1000);
  for(const t of matched){
    const e=t.wolf;
    const near=dist(e,s.P)<34;
    const now=performance.now()/1000;
    if(near&&now-t.lastAttack>.62){t.attackStart=now;t.lastAttack=now;t.facing=(s.P?.x??e.x)>=e.x?1:-1}
    const attacking=t.attackStart>0&&now-t.attackStart<.56;
    const moved=Math.hypot(t.x-t.px,t.y-t.py)>.18;
    let name='red_wolf_walk',frame=0,w=64,h=46;
    if(attacking){name='red_wolf_attack';frame=progressFrame(name,(now-t.attackStart)/.56);w=72;h=47}
    else if(moved)frame=loopFrame(name,time,t.id*.11);
    shadow(state.ctx,e.x,e.y+16,20,4.5,.2);
    drawSprite(name,frame,e.x,e.y+18,w,h,t.facing<0,1);
  }
  for(let i=deaths.length-1;i>=0;i--){
    const d=deaths[i],age=performance.now()/1000-d.start;
    if(age>.58){deaths.splice(i,1);continue}
    const frame=progressFrame('red_wolf_death',age/.58);
    shadow(state.ctx,d.x,d.y+16,20,4,.18*(1-age/.58));
    drawSprite('red_wolf_death',frame,d.x,d.y+18,72,48,d.facing<0,1-age*.4);
  }
}

function render(nowMs){
  requestAnimationFrame(render);
  if(!state.ready||!state.ctx)return;
  const s=(()=>{try{return window.__xianxiaDebug?.snapshot?.()}catch{return null}})();
  const ctx=state.ctx;ctx.clearRect(0,0,W,H);
  if(!s||s.phase!=='run'){
    tracks.clear();deaths.length=0;previousPlayer=null;
    return;
  }
  const time=nowMs/1000;
  renderPortal(time);
  renderHerbs(s.objects||[],time);
  renderWolves(s,time);
  renderPlayer(s,time);
}

async function boot(){
  try{
    addCss();
    if(!makeLayer())throw new Error('game canvas not found');
    const [manifest,atlas]=await Promise.all([
      fetch(manifestUrl,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('manifest load failed');return r.json()}),
      loadImage(imageUrl)
    ]);
    state.manifest=manifest;state.atlas=atlas;state.ready=true;
    document.querySelector('#v27ObjectLayer')?.setAttribute('aria-hidden','true');
    if(!started){started=true;requestAnimationFrame(render)}
    console.info('[xianxia] brush sprite runtime 11.28 ready');
  }catch(error){
    state.error=String(error?.message||error);
    console.warn('[xianxia] sprite runtime disabled:',error);
  }
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();
