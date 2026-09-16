(()=>{
'use strict';
if(window.__xianxiaSpriteRuntime?.version==='11.29')return;
const W=700,H=460,EXIT={x:350,y:438};
const META={
 player_move:{fps:10,loop:true,x:0,y:0,cell_width:24,cell_height:42,frame_count:6},
 player_attack:{fps:10,loop:false,x:0,y:42,cell_width:28,cell_height:48,frame_count:6},
 red_wolf_walk:{fps:10,loop:true,x:0,y:90,cell_width:48,cell_height:36,frame_count:6},
 red_wolf_attack:{fps:10,loop:false,x:0,y:126,cell_width:54,cell_height:34,frame_count:6},
 red_wolf_death:{fps:8,loop:false,x:0,y:160,cell_width:54,cell_height:36,frame_count:4},
 herb_low:{fps:5,loop:true,x:0,y:196,cell_width:28,cell_height:36,frame_count:4},
 herb_mid:{fps:5,loop:true,x:0,y:232,cell_width:28,cell_height:36,frame_count:4},
 herb_high:{fps:5,loop:true,x:0,y:268,cell_width:28,cell_height:36,frame_count:4},
 return_portal:{fps:8,loop:true,x:0,y:304,cell_width:21,cell_height:40,frame_count:6}
};
const state={version:'11.29',ready:false,error:null,atlas:null,layer:null,ctx:null};
window.__xianxiaSpriteRuntime=state;
const tracks=new Map(),deaths=[];
let nextId=1,prevP=null,pFacing=1;
function css(){
 const s=document.createElement('style');s.id='v1129spritecss';s.textContent=`#v27ObjectLayer,#v1128SpriteLayer{display:none!important}#v1129SpriteLayer{position:absolute!important;inset:0!important;z-index:20!important;width:100%!important;height:100%!important;pointer-events:none!important;filter:none!important;mix-blend-mode:normal!important}`;document.head.appendChild(s);
}
function layer(){
 const game=document.querySelector('#game'),base=document.querySelector('#cv');if(!game||!base)return false;
 const c=document.createElement('canvas');c.id='v1129SpriteLayer';c.width=W;c.height=H;c.setAttribute('aria-hidden','true');base.insertAdjacentElement('afterend',c);state.layer=c;state.ctx=c.getContext('2d');state.ctx.imageSmoothingEnabled=true;return true;
}
function img(src){return new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(new Error('atlas load failed: '+src));i.src=src})}
function frame(name,t,off=0){const a=META[name];return Math.floor((t+off)*a.fps)%a.frame_count}
function prog(name,p){const a=META[name];return Math.max(0,Math.min(a.frame_count-1,Math.floor(Math.max(0,Math.min(.999,p))*a.frame_count)))}
function shadow(x,y,w,h,a=.16){const c=state.ctx;c.save();c.globalAlpha=a;c.fillStyle='#273631';c.beginPath();c.ellipse(x,y,w,h,0,0,Math.PI*2);c.fill();c.restore()}
function sprite(name,f,x,y,w,h,flip=false,alpha=1){const a=META[name],c=state.ctx;if(!a||!state.atlas)return;c.save();c.globalAlpha=alpha;c.translate(x,y);if(flip)c.scale(-1,1);c.drawImage(state.atlas,a.x+f*a.cell_width,a.y,a.cell_width,a.cell_height,-w/2,-h,w,h);c.restore()}
function d(a,b){return Math.hypot((a?.x||0)-(b?.x||0),(a?.y||0)-(b?.y||0))}
function match(curr,now){const old=[...tracks.values()],used=new Set(),out=[];for(const e of curr){let best=null,bd=70;for(const t of old){if(used.has(t.id))continue;const dd=Math.hypot(e.x-t.x,e.y-t.y);if(dd<bd){bd=dd;best=t}}if(!best){best={id:nextId++,x:e.x,y:e.y,px:e.x,py:e.y,seen:now,facing:1,attackStart:-1,lastAttack:-999};tracks.set(best.id,best)}else used.add(best.id);best.px=best.x;best.py=best.y;best.x=e.x;best.y=e.y;best.seen=now;best.e=e;const dx=best.x-best.px;if(Math.abs(dx)>.15)best.facing=dx<0?-1:1;out.push(best)}for(const t of [...tracks.values()]){if(out.includes(t))continue;if(now-t.seen<.18)deaths.push({x:t.x,y:t.y,facing:t.facing,start:now});tracks.delete(t.id)}return out}
function draw(now){requestAnimationFrame(draw);if(!state.ready||!state.ctx)return;let s=null;try{s=window.__xianxiaDebug?.snapshot?.()}catch{}const c=state.ctx;c.clearRect(0,0,W,H);if(!s||s.phase!=='run'){state.layer.style.display='none';tracks.clear();deaths.length=0;prevP=null;return}state.layer.style.display='block';const t=now/1000;
 shadow(EXIT.x,EXIT.y+2,31,6,.13);sprite('return_portal',frame('return_portal',t),EXIT.x,EXIT.y+8,78,86,false,.98);
 for(const o of s.objects||[]){if(o.type!=='h')continue;const n=o.grade===2?'herb_high':o.grade===1?'herb_mid':'herb_low';shadow(o.x,o.y+11,11,3.5,.15);sprite(n,frame(n,t,(o.x+o.y)*.0017),o.x,o.y+13,38,49,false,1)}
 const wolves=(s.enemies||[]).filter(e=>e.type==='guard');const mm=match(wolves,performance.now()/1000);for(const tr of mm){const e=tr.e,near=d(e,s.P)<35,n=performance.now()/1000;if(near&&n-tr.lastAttack>.62){tr.attackStart=n;tr.lastAttack=n;tr.facing=(s.P?.x??e.x)>=e.x?1:-1}const att=tr.attackStart>0&&n-tr.attackStart<.56,moved=Math.hypot(tr.x-tr.px,tr.y-tr.py)>.18;let name='red_wolf_walk',ff=0,w=69,h=51;if(att){name='red_wolf_attack';ff=prog(name,(n-tr.attackStart)/.56);w=76;h=51}else if(moved)ff=frame(name,t,tr.id*.11);shadow(e.x,e.y+17,21,4.5,.2);sprite(name,ff,e.x,e.y+19,w,h,tr.facing<0,1)}
 for(let i=deaths.length-1;i>=0;i--){const z=deaths[i],age=performance.now()/1000-z.start;if(age>.62){deaths.splice(i,1);continue}shadow(z.x,z.y+17,21,4,.14*(1-age/.62));sprite('red_wolf_death',prog('red_wolf_death',age/.62),z.x,z.y+19,76,52,z.facing<0,1-age*.35)}
 const p=s.P;if(p){let moving=false,dx=0;if(prevP){dx=p.x-prevP.x;moving=Math.hypot(dx,p.y-prevP.y)>.18}if(Math.abs(dx)>.12)pFacing=dx<0?-1:1;if(p.cd>0.01&&p.tx!==undefined&&Math.abs(p.tx-p.x)>2)pFacing=p.tx<p.x?-1:1;const mortal=(s.M?.realm?.major??-1)<0,atk=s.M?.cult?.atk||1,maxCd=Math.max(.2,.55-(atk-1)*.02),att=!mortal&&p.cd>0.01;let name='player_move',ff=0,w=38,h=65;if(att){name='player_attack';ff=prog(name,1-Math.min(maxCd,p.cd)/maxCd);w=54;h=72}else if(moving)ff=frame(name,t);shadow(p.x,p.y+15,13,3.5,.18);sprite(name,ff,p.x,p.y+17,w,h,pFacing<0,1);prevP={x:p.x,y:p.y}}
}
async function boot(){try{css();if(!layer())throw new Error('game canvas not found');state.atlas=await img('assets/brush_v1/brush_v1_atlas_v2.png?v=11.29');state.ready=true;document.documentElement.dataset.spriteRuntime='11.29-ready';console.info('[xianxia] sprite runtime 11.29 ready');requestAnimationFrame(draw)}catch(e){state.error=String(e?.message||e);document.documentElement.dataset.spriteRuntime='11.29-error';console.warn('[xianxia] sprite runtime 11.29 failed',e)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
