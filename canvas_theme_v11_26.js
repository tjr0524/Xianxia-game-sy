(()=>{
'use strict';
if(window.__xianxiaCanvasThemeVersion==='11.27')return;
window.__xianxiaCanvasThemeVersion='11.27';

const COLORS=new Map(Object.entries({
  '#172e31':'#eef2e9','#244d48':'#dce7dc','#6b8f72':'#b6cbbb','#081014':'#e2e7df','#0a1518':'#c8d4ca','#ffffff0b':'#536a6212','#b6e2ca1c':'#5675682b',
  '#191f22':'#f1eee5','#34342a':'#e3dccb','#6d6042':'#c9b991','#d9c48b17':'#8b74402b',
  '#291719':'#f3e7e1','#532127':'#e5cbc5','#8c493b':'#cba195','#e8736230':'#a2554d35',
  '#11182b':'#ececf2','#24284b':'#d9dbe8','#555c91':'#b6bdd5','#d4dcff55':'#747fa43a','#b8c3ff19':'#66739b28',
  '#8fe1b2':'#2e806b','#b9efd0':'#245f51','#bfe8c2aa':'#497b59b8','#b8d7ef':'#719fba','#eef7ff':'#f8fcff','#e7f0ff':'#405f72',
  '#8ac8dc2c':'#477d8238','#d8e9c966':'#5979616e','#eef6ff':'#7393a7','#f4f6ff':'#58758a','#9fdfff':'#4d91a5','#c6d6ff':'#697fae','#d7c8ff':'#796aa6','#d6d5ff':'#7379a7','#eef0ff':'#727aa1','#f4f1ff':'#68709c'
}).map(([key,value])=>[key.toLowerCase(),value]));

function remap(value){
  if(typeof value!=='string')return value;
  return COLORS.get(value.toLowerCase())||value;
}
function descriptorFor(object,key){
  let proto=Object.getPrototypeOf(object);
  while(proto){
    const descriptor=Object.getOwnPropertyDescriptor(proto,key);
    if(descriptor)return descriptor;
    proto=Object.getPrototypeOf(proto);
  }
  return null;
}
function themeContext(ctx){
  if(!ctx||ctx.__xianxiaLightInkCanvas)return ctx;
  try{Object.defineProperty(ctx,'__xianxiaLightInkCanvas',{value:true})}catch{return ctx}
  for(const key of ['fillStyle','strokeStyle','shadowColor']){
    const descriptor=descriptorFor(ctx,key);
    if(!descriptor?.get||!descriptor?.set)continue;
    try{
      Object.defineProperty(ctx,key,{
        configurable:true,enumerable:descriptor.enumerable,
        get(){return descriptor.get.call(ctx)},
        set(value){descriptor.set.call(ctx,remap(value))}
      });
    }catch{}
  }
  const originalGradient=ctx.createLinearGradient?.bind(ctx);
  if(originalGradient){
    ctx.createLinearGradient=(...args)=>{
      const gradient=originalGradient(...args);
      const add=gradient.addColorStop.bind(gradient);
      gradient.addColorStop=(offset,color)=>add(offset,remap(color));
      return gradient;
    };
  }
  const originalRadial=ctx.createRadialGradient?.bind(ctx);
  if(originalRadial){
    ctx.createRadialGradient=(...args)=>{
      const gradient=originalRadial(...args);
      const add=gradient.addColorStop.bind(gradient);
      gradient.addColorStop=(offset,color)=>add(offset,remap(color));
      return gradient;
    };
  }
  return ctx;
}

const nativeGetContext=HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext=function(type,...args){
  const ctx=nativeGetContext.call(this,type,...args);
  return type==='2d'&&this.id==='cv'?themeContext(ctx):ctx;
};

const W=700,H=460,EXIT={x:350,y:438};
let objectLayer=null,objectCtx=null,lastFrame=0,started=false;

function installLayer(){
  const game=document.querySelector('#game');
  const base=document.querySelector('#cv');
  if(!game||!base)return false;
  if(!document.querySelector('#v27-object-style')){
    const style=document.createElement('style');
    style.id='v27-object-style';
    style.textContent=`
      #game{position:relative}
      #game canvas.v27-object-layer{position:absolute!important;inset:0!important;z-index:4!important;width:100%!important;height:100%!important;pointer-events:none!important;filter:none!important;mix-blend-mode:normal!important}
    `;
    document.head.appendChild(style);
  }
  objectLayer=game.querySelector('#v27ObjectLayer');
  if(!objectLayer){
    objectLayer=document.createElement('canvas');
    objectLayer.id='v27ObjectLayer';
    objectLayer.className='v27-object-layer';
    objectLayer.width=W;objectLayer.height=H;
    objectLayer.setAttribute('aria-hidden','true');
    base.insertAdjacentElement('afterend',objectLayer);
  }
  objectCtx=nativeGetContext.call(objectLayer,'2d');
  if(!started){started=true;requestAnimationFrame(renderOverlay)}
  return true;
}
function snap(){
  try{return window.__xianxiaDebug?.snapshot?.()||null}catch{return null}
}
function rr(ctx,x,y,w,h,r){
  const q=Math.min(r,w/2,h/2);
  ctx.beginPath();ctx.moveTo(x+q,y);ctx.arcTo(x+w,y,x+w,y+h,q);ctx.arcTo(x+w,y+h,x,y+h,q);ctx.arcTo(x,y+h,x,y,q);ctx.arcTo(x,y,x+w,y,q);ctx.closePath();
}
function shadow(ctx,x,y,w=18,h=7,a=.18){
  ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#263431';ctx.beginPath();ctx.ellipse(x,y,w,h,0,0,Math.PI*2);ctx.fill();ctx.restore();
}
function halo(ctx,x,y,r,stroke='#ffffff',fill='rgba(255,253,244,.78)'){
  ctx.save();ctx.fillStyle=fill;ctx.strokeStyle=stroke;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
}
function drawExit(ctx,t){
  const pulse=1+Math.sin(t*4)*.045;
  shadow(ctx,EXIT.x,EXIT.y-1,32,7,.16);
  ctx.save();ctx.translate(EXIT.x,EXIT.y);
  ctx.fillStyle='rgba(250,247,232,.86)';ctx.strokeStyle='#286f5f';ctx.lineWidth=2.4;
  ctx.beginPath();ctx.ellipse(0,-3,31*pulse,11*pulse,0,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.strokeStyle='#63ad95';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-2,25*pulse,Math.PI,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.arc(0,-2,17*pulse,Math.PI,Math.PI*2);ctx.stroke();
  ctx.strokeStyle='#b49345';ctx.lineWidth=1.5;
  for(let i=0;i<5;i++){const x=-23+i*11.5;ctx.beginPath();ctx.moveTo(x,-3);ctx.lineTo(x+5,-12);ctx.lineTo(x+10,-3);ctx.stroke()}
  ctx.fillStyle='#245f51';ctx.font='700 11px Hahmlet,serif';ctx.textAlign='center';ctx.fillText('귀환진',0,-31);
  ctx.fillStyle='rgba(45,113,98,.12)';ctx.font='700 33px Hahmlet,serif';ctx.fillText('歸',0,-1);ctx.restore();
}
function drawHerb(ctx,o,t){
  const grade=o.grade||0;
  const p=[
    {fill:'#36a55b',dark:'#276f40',glow:'#97e8ad',core:'#f5fff5'},
    {fill:'#258fa5',dark:'#1e6475',glow:'#8fdce9',core:'#f3feff'},
    {fill:'#8b55c7',dark:'#5c3786',glow:'#d4b7f3',core:'#fff8ff'}
  ][grade];
  const sway=Math.sin(t*2.3+(o.x+o.y)*.02)*1.8;
  shadow(ctx,o.x,o.y+8,10,4,.18);halo(ctx,o.x,o.y-2,13,'rgba(63,83,75,.26)','rgba(255,253,244,.82)');
  ctx.save();ctx.translate(o.x,o.y);ctx.lineCap='round';
  ctx.strokeStyle=p.dark;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,8);ctx.quadraticCurveTo(sway,-1,0,-9);ctx.stroke();
  ctx.fillStyle=p.fill;ctx.strokeStyle='#f8fff7';ctx.lineWidth=1.15;
  ctx.beginPath();ctx.ellipse(-5+sway*.2,-1,6,3.4,-.65,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.ellipse(5+sway*.2,-5,6,3.4,.55,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.shadowColor=p.glow;ctx.shadowBlur=9;ctx.fillStyle=p.core;ctx.beginPath();ctx.arc(0,-9,3.3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle=p.dark;ctx.beginPath();ctx.arc(0,-9,1.45,0,Math.PI*2);ctx.fill();ctx.restore();
}
function drawStone(ctx,o){
  shadow(ctx,o.x,o.y+8,10,4,.2);halo(ctx,o.x,o.y,13,'rgba(63,83,75,.24)','rgba(255,253,244,.82)');
  ctx.save();ctx.translate(o.x,o.y);ctx.rotate(.38);ctx.shadowColor='#83c6e2';ctx.shadowBlur=7;
  ctx.fillStyle='#5799ba';ctx.strokeStyle='#f8fcff';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(8,-2);ctx.lineTo(5,9);ctx.lineTo(-6,7);ctx.lineTo(-8,-2);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.shadowBlur=0;ctx.strokeStyle='#dff6ff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(0,7);ctx.moveTo(0,-8);ctx.lineTo(6,-1);ctx.moveTo(0,-1);ctx.lineTo(-5,6);ctx.stroke();ctx.restore();
}
function drawVein(ctx,v,t){
  if(!v)return;
  shadow(ctx,v.x,v.y+18,27,8,.22);halo(ctx,v.x,v.y,31,'rgba(76,100,96,.3)','rgba(255,253,244,.76)');
  ctx.save();ctx.translate(v.x,v.y);const glow=v.cleared?'#70d7c1':'#7b9fe5',fill=v.cleared?'#45bca3':'#607ec5';
  ctx.shadowColor=glow;ctx.shadowBlur=13;ctx.fillStyle=fill;ctx.strokeStyle='#fbfdff';ctx.lineWidth=1.6;
  for(const [x,y,s] of [[-14,5,14],[0,-6,20],[16,7,12]]){ctx.beginPath();ctx.moveTo(x,y-s);ctx.lineTo(x+s*.45,y);ctx.lineTo(x,y+s*.58);ctx.lineTo(x-s*.45,y);ctx.closePath();ctx.fill();ctx.stroke()}
  ctx.shadowBlur=0;ctx.strokeStyle=v.cleared?'#4aa98f':'#6076aa';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,26+Math.sin(t*2.8)*1.5,0,Math.PI*2);ctx.stroke();
  rr(ctx,-28,31,56,17,5);ctx.fillStyle='rgba(36,49,54,.88)';ctx.fill();ctx.fillStyle='#fffdf5';ctx.font='700 10px Gowun Batang,serif';ctx.textAlign='center';ctx.fillText(`영맥 ${v.stock??''}`,0,43);ctx.restore();
}
function beastPath(ctx,r,type){
  ctx.beginPath();
  if(type==='chaser'){
    ctx.moveTo(0,-r-2);ctx.lineTo(r*.9,-2);ctx.lineTo(r*.58,r*.8);ctx.lineTo(0,r*.48);ctx.lineTo(-r*.58,r*.8);ctx.lineTo(-r*.9,-2);ctx.closePath();return;
  }
  const points=type==='elite'?8:6;
  for(let i=0;i<points;i++){const a=-Math.PI/2+i*Math.PI*2/points,rad=r*(i%2?.78:1);const x=Math.cos(a)*rad,y=Math.sin(a)*rad;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath();
}
function drawEnemy(ctx,e){
  const r=e.type==='elite'?23:e.type==='spirit'?10:e.type==='rat'?9:12;
  shadow(ctx,e.x,e.y+r+6,r*.9,5,.24);
  if(e.type==='guard'||e.type==='chaser'||e.type==='elite'){
    const body=e.type==='elite'?'#8b2f2b':e.type==='chaser'?'#c46a31':'#ad403b';
    const edge=e.rare?'#d0a442':'#fff4de';
    halo(ctx,e.x,e.y,r+5,'rgba(66,58,49,.28)','rgba(255,249,232,.88)');
    ctx.save();ctx.translate(e.x,e.y);if(e.rare){ctx.shadowColor='#d4aa4d';ctx.shadowBlur=10}ctx.fillStyle=body;ctx.strokeStyle=edge;ctx.lineWidth=e.type==='elite'?2:1.6;beastPath(ctx,r,e.type);ctx.fill();ctx.stroke();
    if(e.type==='elite'){ctx.strokeStyle='#d8b35a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-9,-15);ctx.lineTo(-14,-23);ctx.moveTo(9,-15);ctx.lineTo(14,-23);ctx.stroke()}
    ctx.shadowBlur=0;ctx.fillStyle='#fff0ad';ctx.beginPath();ctx.arc(-4,-2,1.8,0,Math.PI*2);ctx.arc(4,-2,1.8,0,Math.PI*2);ctx.fill();ctx.restore();
  }else if(e.type==='rogue'){
    halo(ctx,e.x,e.y+1,16,'rgba(75,57,92,.3)','rgba(255,250,240,.88)');ctx.save();ctx.translate(e.x,e.y);ctx.fillStyle='#73529d';ctx.strokeStyle='#f3e7ff';ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(0,-7,5,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-10,12);ctx.lineTo(0,-3);ctx.lineTo(10,12);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle='#8b6bad';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(6,-1);ctx.lineTo(13,-12);ctx.stroke();ctx.restore();
  }else if(e.type==='rat'){
    halo(ctx,e.x,e.y+1,15,'rgba(104,82,24,.28)','rgba(255,251,232,.9)');ctx.save();ctx.translate(e.x,e.y);ctx.fillStyle='#bd9b36';ctx.strokeStyle='#fff0b1';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(0,1,9,6,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(-5,-5,3,0,Math.PI*2);ctx.arc(4,-5,3,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.strokeStyle='#8f7429';ctx.beginPath();ctx.moveTo(8,2);ctx.quadraticCurveTo(17,5,18,12);ctx.stroke();ctx.restore();
  }else{
    halo(ctx,e.x,e.y,15,'rgba(40,107,111,.28)','rgba(247,255,253,.88)');ctx.save();ctx.translate(e.x,e.y);ctx.shadowColor='#65dfe2';ctx.shadowBlur=12;ctx.fillStyle='#45bcc2';ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#f0ffff';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(0,0,r+4,0,Math.PI*2);ctx.stroke();ctx.restore();
  }
}
function drawPlayer(ctx,p,m,t){
  if(!p)return;const mortal=(m?.realm?.major??-1)<0;
  shadow(ctx,p.x,p.y+17,13,5,.23);halo(ctx,p.x,p.y+1,17,'rgba(56,80,73,.3)','rgba(255,253,244,.9)');ctx.save();ctx.translate(p.x,p.y);
  const aura=mortal?'#687a79':'#2d9b83';ctx.strokeStyle=aura;ctx.globalAlpha=.7;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,(p.r||11)+7+Math.sin(t*4)*1.5,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
  ctx.fillStyle=mortal?'#5e696c':'#226f64';ctx.strokeStyle='#fffdf3';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-10,12);ctx.lineTo(0,-5);ctx.lineTo(10,12);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#efd4b4';ctx.beginPath();ctx.arc(0,-8,5,0,Math.PI*2);ctx.fill();
  if(!mortal){const a=t*4.5;ctx.save();ctx.rotate(a);ctx.translate(18,0);ctx.rotate(1.2);ctx.strokeStyle='#c69e40';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-7,0);ctx.lineTo(8,0);ctx.stroke();ctx.fillStyle='#e2bf63';ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(4,-3);ctx.lineTo(4,3);ctx.closePath();ctx.fill();ctx.restore()}ctx.restore();
}
function drawHazard(ctx,h){
  const charging=!h.struck;ctx.save();ctx.strokeStyle=charging?'rgba(88,94,156,.78)':'#5d64a0';ctx.lineWidth=charging?2:4;ctx.setLineDash(charging?[6,5]:[]);ctx.beginPath();ctx.arc(h.x,h.y,h.r,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.restore();
}
function renderOverlay(now){
  requestAnimationFrame(renderOverlay);
  if(now-lastFrame<32)return;lastFrame=now;
  if(!objectLayer||!objectCtx){installLayer();return}
  objectCtx.clearRect(0,0,W,H);
  const s=snap();if(!s||s.phase!=='run')return;
  const t=s.elapsed||now/1000;
  drawExit(objectCtx,t);
  for(const h of s.hazards||[])drawHazard(objectCtx,h);
  if(s.vein)drawVein(objectCtx,s.vein,t);
  for(const o of s.objects||[])o.type==='h'?drawHerb(objectCtx,o,t):drawStone(objectCtx,o);
  for(const e of s.enemies||[])drawEnemy(objectCtx,e);
  drawPlayer(objectCtx,s.P,s.M,t);
}
function bootOverlay(){
  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    if(installLayer()&&window.__xianxiaDebug){clearInterval(timer)}
    else if(tries>200)clearInterval(timer);
  },25);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootOverlay,{once:true});
else bootOverlay();
})();
