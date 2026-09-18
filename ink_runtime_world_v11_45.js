/* GENERATED FLAT RUNTIME 11.45 · source chain: ink_runtime_v11_31 -> worldscale_core_v11_34 */
(()=>{
'use strict';
if(window.__xianxiaInkRuntime?.version==='11.31.2')return;
const W=1800,H=2400,EXIT={x:900,y:1200},BASE='assets/ink_v1/';
const CACHE=new URL(document.currentScript?.src||location.href).searchParams.get('v')||'dev';
const files={
 player:'source/player_core.png',objects:'source/world_objects.png',effects:'source/skill_effects.png',
 qingyun_guard:'source/qingyun_stone_boar.png',qingyun_chaser:'source/qingyun_wind_wolf.png',qingyun_basic:'source/qingyun_mist_goat_v1.png',
 blackwind_guard:'source/blackwind_horned_yak.png',blackwind_chaser:'source/blackwind_ink_panther.png',blackwind_basic:'source/blackwind_shadow_badger_v1.png',blackwind_attacker:'source/blackwind_sickle_mantis_v1.png',
 blood_guard:'source/blood_armored_bear.png',blood_chaser:'source/blood_ember_fox.png',blood_basic:'source/blood_bloodscale_lizard_v1.png',blood_attacker:'source/blood_crimson_quill_v1.png',blood_elite:'source/blood_crystal_qilin_v1.png',
 thunder_guard:'source/thunder_stone_rhino.png',thunder_chaser:'source/thunder_lightning_leopard.png',thunder_basic:'source/thunder_horn_ram_v1.png',thunder_attacker:'source/thunder_storm_marten_v1.png',thunder_elite:'source/thunder_basalt_tortoise_v1.png',
 spirit_deer:'source/spirit_deer_v1.png',treasure_rat:'source/treasure_rat_v1.png',wandering_rival:'source/wandering_rival_v1.png',trait_fx:'source/trait_fx_atlas_v1.png',
 bg_qingyun:'../ink_v2/runtime/backgrounds/qingyun.webp',bg_blackwind:'../ink_v2/runtime/backgrounds/blackwind.webp',
 bg_blood:'../ink_v2/runtime/backgrounds/blood.webp',bg_thunder:'../ink_v2/runtime/backgrounds/thunder.webp'
};
const S={version:'11.31.2',ready:false,error:null,images:{},layer:null,ctx:null,renderScale:1,bufferWidth:0,bufferHeight:0,dprCap:1.5,maxPixels:2600000,assetBindings:'11.49.10'};
window.__xianxiaInkRuntime=S;
const tracks=new Map(),deaths=[],casts=[],impacts=[],pickups=[],floaters=[],veinBursts=[];
let nextId=1,prevP=null,pFacing=1,prevCooldowns={},lastArea=null,lastPhase=null,prevObjects=[],prevRun=null,prevVein=null,hitStopUntil=0,lastSnapshot=null,activeBounds={x:0,y:0,w:W,h:H};
const bounds=new Map(),refs=new Map(),frameCanvases=new Map();
function load(path){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('image failed: '+path));im.src=BASE+path+'?v='+encodeURIComponent(CACHE)})}
function makeLayer(){const game=document.querySelector('#game'),base=document.querySelector('#cv');if(!game||!base)return false;let c=document.querySelector('#v1131InkLayer');if(!c){c=document.createElement('canvas');c.id='v1131InkLayer';c.width=1;c.height=1;c.setAttribute('aria-hidden','true');base.insertAdjacentElement('afterend',c)}S.layer=c;S.ctx=c.getContext('2d',{alpha:true});S.ctx.imageSmoothingEnabled=true;return true}
function frame(t,fps,count,offset=0){return Math.floor((t+offset)*fps)%count}
function progress(p,count){return Math.max(0,Math.min(count-1,Math.floor(Math.max(0,Math.min(.999,p))*count)))}
function median(values){const a=[...values].sort((x,y)=>x-y);return a.length?a[Math.floor(a.length/2)]:1}
function spansFor(data,img,y0,y1,cols){const spans=[];let start=-1,last=-1;for(let px=0;px<img.width;px++){let hits=0;for(let py=y0;py<y1;py++)if(data[(py*img.width+px)*4+3]>28)hits++;if(hits>2){if(start<0||px-last>8){if(start>=0)spans.push({l:start,r:last});start=px}last=px}}if(start>=0)spans.push({l:start,r:last});const minWidth=Math.max(12,Math.floor(img.width/cols*.18)),usable=spans.filter(s=>s.r-s.l+1>=minWidth);if(usable.length>=cols)return usable.sort((a,b)=>(b.r-b.l)-(a.r-a.l)).slice(0,cols).sort((a,b)=>a.l-b.l).map(s=>({l:Math.max(0,s.l-6),r:Math.min(img.width-1,s.r+6)}));return Array.from({length:cols},(_,i)=>({l:Math.floor(i*img.width/cols),r:Math.floor((i+1)*img.width/cols)-1}))}
function largestOpaqueBox(data,img,x0,x1,y0,y1){const w=x1-x0,h=y1-y0,seen=new Uint8Array(w*h),queue=new Int32Array(w*h);let best=null,bestSize=0;for(let sy=0;sy<h;sy++)for(let sx=0;sx<w;sx++){const seed=sy*w+sx;if(seen[seed]||data[((y0+sy)*img.width+x0+sx)*4+3]<=28)continue;let head=0,tail=1,size=0,l=sx,r=sx,t=sy,b=sy;queue[0]=seed;seen[seed]=1;while(head<tail){const at=queue[head++],px=at%w,py=(at/w)|0;size++;if(px<l)l=px;if(px>r)r=px;if(py<t)t=py;if(py>b)b=py;let n;if(px>0){n=at-1;if(!seen[n]&&data[((y0+py)*img.width+x0+px-1)*4+3]>28){seen[n]=1;queue[tail++]=n}}if(px<w-1){n=at+1;if(!seen[n]&&data[((y0+py)*img.width+x0+px+1)*4+3]>28){seen[n]=1;queue[tail++]=n}}if(py>0){n=at-w;if(!seen[n]&&data[((y0+py-1)*img.width+x0+px)*4+3]>28){seen[n]=1;queue[tail++]=n}}if(py<h-1){n=at+w;if(!seen[n]&&data[((y0+py+1)*img.width+x0+px)*4+3]>28){seen[n]=1;queue[tail++]=n}}}if(size>bestSize){bestSize=size;const pad=4,ll=Math.max(0,l-pad),rr=Math.min(w-1,r+pad),tt=Math.max(0,t-pad),bb=Math.min(h-1,b+pad);best={x:x0+ll,y:y0+tt,w:rr-ll+1,h:bb-tt+1}}}return best}
function prepare(key,counts){const img=S.images[key],rows=counts.length,c=document.createElement('canvas');c.width=img.width;c.height=img.height;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0);const data=x.getImageData(0,0,c.width,c.height).data,body=[],beast=/_guard$|_chaser$|_basic$|_attacker$|_elite$/.test(key)||/^(spirit_deer|treasure_rat|wandering_rival)$/.test(key);counts.forEach((cols,row)=>{const rowHeights=[],y0=Math.floor(row*img.height/rows),y1=Math.floor((row+1)*img.height/rows),spans=spansFor(data,img,y0,y1,cols);for(let index=0;index<cols;index++){const pad=beast?32:0,x0=beast?Math.max(0,Math.floor(index*img.width/cols)-pad):spans[index].l,x1=beast?Math.min(img.width,Math.floor((index+1)*img.width/cols)+pad):spans[index].r+1,component=beast?largestOpaqueBox(data,img,x0,x1,y0,y1):null;let l=component?.x??x1,t=component?.y??y1,r=component?component.x+component.w-1:x0,b=component?component.y+component.h-1:y0;if(!component)for(let py=y0;py<y1;py++)for(let px=x0;px<x1;px++)if(data[(py*img.width+px)*4+3]>28){if(px<l)l=px;if(px>r)r=px;if(py<t)t=py;if(py>b)b=py}if(r<l||b<t){l=x0;r=x1-1;t=y0;b=y1-1}const box={x:l,y:t,w:r-l+1,h:b-t+1};bounds.set(`${key}:${row}:${cols}:${index}`,box);rowHeights.push(box.h);if(row<2)body.push(box.h)}refs.set(`${key}:${row}`,median(rowHeights))});refs.set(`${key}:body`,median(body))}
function optimizeEdges(proj,count,total,ratio){const edges=[0],nominal=Array.from({length:count+1},(_,i)=>i*total/count),search=Math.max(8,Math.floor(total*ratio/Math.max(1,count)));for(let i=1;i<count;i++){const n=Math.round(nominal[i]),lo=Math.max(edges[edges.length-1]+2,n-search),hi=Math.min(total-2,n+search);let e=n;if(hi>lo){let best=lo,bestV=proj[lo]??Infinity,bestD=Math.abs(lo-n);for(let p=lo+1;p<=hi;p++){const v=proj[p]??Infinity,d=Math.abs(p-n);if(v<bestV||(v===bestV&&d<bestD)){best=p;bestV=v;bestD=d}}e=best}edges.push(e)}edges.push(total);for(let i=1;i<edges.length;i++)edges[i]=Math.max(edges[i-1]+2,edges[i]);edges[edges.length-1]=total;for(let i=edges.length-2;i>0;i--)edges[i]=Math.min(edges[i],edges[i+1]-2);edges[0]=0;edges[edges.length-1]=total;return edges}
function componentMasks(mask,w,h){const seen=new Uint8Array(mask.length),queue=new Int32Array(mask.length),out=[];for(let seed=0;seed<mask.length;seed++){if(!mask[seed]||seen[seed])continue;let head=0,tail=1,size=0,minX=w,maxX=-1,minY=h,maxY=-1;const pixels=[];queue[0]=seed;seen[seed]=1;while(head<tail){const at=queue[head++],px=at%w,py=(at/w)|0;pixels.push(at);size++;if(px<minX)minX=px;if(px>maxX)maxX=px;if(py<minY)minY=py;if(py>maxY)maxY=py;let n;if(px>0){n=at-1;if(mask[n]&&!seen[n]){seen[n]=1;queue[tail++]=n}}if(px<w-1){n=at+1;if(mask[n]&&!seen[n]){seen[n]=1;queue[tail++]=n}}if(py>0){n=at-w;if(mask[n]&&!seen[n]){seen[n]=1;queue[tail++]=n}}if(py<h-1){n=at+w;if(mask[n]&&!seen[n]){seen[n]=1;queue[tail++]=n}}}out.push({pixels,size,minX,maxX,minY,maxY,cx:(minX+maxX)/2,cy:(minY+maxY)/2})}return out}
function storeMaskedFrame(key,row,cols,index,img,data,x0,y0,x1,y1,mode='slot',seedY=.55){x0=Math.max(0,Math.floor(x0));y0=Math.max(0,Math.floor(y0));x1=Math.min(img.width,Math.ceil(x1));y1=Math.min(img.height,Math.ceil(y1));const w=Math.max(1,x1-x0),h=Math.max(1,y1-y0),mask=new Uint8Array(w*h);for(let py=0;py<h;py++)for(let px=0;px<w;px++)if(data[((y0+py)*img.width+x0+px)*4+3]>28)mask[py*w+px]=1;const comps=componentMasks(mask,w,h);let keep=[];if(mode==='center'){const sx0=w*(.5-.13),sx1=w*(.5+.13),sy0=h*(seedY-.13),sy1=h*(seedY+.13);let best=null,bestHits=-1,bestScore=Infinity;for(const comp of comps){let hits=0;for(const at of comp.pixels){const px=at%w,py=(at/w)|0;if(px>=sx0&&px<sx1&&py>=sy0&&py<sy1)hits++}const dx=comp.cx-w*.5,dy=comp.cy-h*.62,score=Math.hypot(dx,dy)+1800/Math.max(1,comp.size);if(hits>bestHits||(hits===bestHits&&score<bestScore)){best=comp;bestHits=hits;bestScore=score}}if(best)keep=[best]}else{const largest=Math.max(1,...comps.map(c=>c.size));keep=comps.filter(comp=>{const touchLR=comp.minX===0||comp.maxX===w-1,bw=comp.maxX-comp.minX+1;return !(touchLR&&comp.size<Math.max(32,largest*.22)&&bw<w*.34)})}if(!keep.length)keep=comps;let l=w,t=h,r=-1,b=-1;const kept=new Uint8Array(w*h);for(const comp of keep)for(const at of comp.pixels){kept[at]=1;const px=at%w,py=(at/w)|0;if(px<l)l=px;if(px>r)r=px;if(py<t)t=py;if(py>b)b=py}if(r<l||b<t){l=0;t=0;r=w-1;b=h-1}const pad=10,cl=Math.max(0,l-pad),ct=Math.max(0,t-pad),cr=Math.min(w-1,r+pad),cb=Math.min(h-1,b+pad),cw=cr-cl+1,ch=cb-ct+1,c=document.createElement('canvas');c.width=cw;c.height=ch;const cx=c.getContext('2d'),out=cx.createImageData(cw,ch);for(let py=0;py<ch;py++)for(let px=0;px<cw;px++){const srcLocal=(ct+py)*w+(cl+px),dst=(py*cw+px)*4;if(!kept[srcLocal])continue;const src=((y0+ct+py)*img.width+x0+cl+px)*4;out.data[dst]=data[src];out.data[dst+1]=data[src+1];out.data[dst+2]=data[src+2];out.data[dst+3]=data[src+3]}cx.putImageData(out,0,0);const id=`${key}:${row}:${cols}:${index}`;frameCanvases.set(id,c);bounds.set(id,{x:0,y:0,w:cw,h:ch});return ch}
function prepareNew(key,counts){const img=S.images[key],c=document.createElement('canvas');c.width=img.width;c.height=img.height;const cx=c.getContext('2d',{willReadFrequently:true});cx.drawImage(img,0,0);const data=cx.getImageData(0,0,c.width,c.height).data,rowProj=new Float64Array(img.height),body=[];for(let y=0;y<img.height;y++){let s=0;for(let x=0;x<img.width;x++)s+=data[(y*img.width+x)*4+3];rowProj[y]=s}const rowEdges=optimizeEdges(rowProj,counts.length,img.height,.18);counts.forEach((cols,row)=>{const y0=rowEdges[row],y1=rowEdges[row+1],colProj=new Float64Array(img.width),rowHeights=[];for(let x=0;x<img.width;x++){let s=0;for(let y=y0;y<y1;y++)s+=data[(y*img.width+x)*4+3];colProj[x]=s}const edges=optimizeEdges(colProj,cols,img.width,.22);for(let index=0;index<cols;index++){const h=storeMaskedFrame(key,row,cols,index,img,data,edges[index],y0,edges[index+1],y1);rowHeights.push(h);if(row<2)body.push(h)}refs.set(`${key}:${row}`,median(rowHeights))});refs.set(`${key}:body`,median(body))}
function prepareMartenActions(key){const img=S.images[key],c=document.createElement('canvas');c.width=img.width;c.height=img.height;const cx=c.getContext('2d',{willReadFrequently:true});cx.drawImage(img,0,0);const data=cx.getImageData(0,0,c.width,c.height).data,boxes=[[0,350,255,660],[230,370,560,660],[500,360,850,680],[730,440,1032,686],[1032,440,1328,686],[1250,370,1536,660]],heights=[];boxes.forEach((b,index)=>heights.push(storeMaskedFrame(key,1,6,index,img,data,b[0],b[1],b[2],b[3],'center',.55)));refs.set(`${key}:1`,median(heights));const body=[];for(let i=0;i<6;i++){const b=bounds.get(`${key}:0:6:${i}`);if(b)body.push(b.h)}body.push(...heights);refs.set(`${key}:body`,median(body))}
function frameSource(key,row,cols,index){const id=`${key}:${row}:${cols}:${index}`,canvas=frameCanvases.get(id),b=bounds.get(id);return canvas?{img:canvas,b:{x:0,y:0,w:canvas.width,h:canvas.height}}:{img:S.images[key],b}}
function boxFor(key,row,cols,index){return bounds.get(`${key}:${row}:${cols}:${index}`)}
function anchored(key,row,cols,index,x,groundY,targetHeight,flip=false,alpha=1,group='body',filter='none'){const src=frameSource(key,row,cols,index),img=src.img,b=src.b;if(!img||!b)return;const scale=targetHeight/(refs.get(`${key}:${group}`)||b.h),dw=b.w*scale,dh=b.h*scale,c=S.ctx;c.save();c.globalAlpha=alpha;c.filter=filter;c.translate(x,groundY);if(flip)c.scale(-1,1);c.drawImage(img,b.x,b.y,b.w,b.h,-dw/2,-dh,dw,dh);c.restore()}
function centered(key,row,cols,index,x,y,targetHeight,flip=false,alpha=1,filter='none'){const src=frameSource(key,row,cols,index),img=src.img,b=src.b;if(!img||!b)return;const scale=targetHeight/(refs.get(`${key}:${row}`)||b.h),dw=b.w*scale,dh=b.h*scale,c=S.ctx;c.save();c.globalAlpha=alpha;c.filter=filter;c.translate(x,y);if(flip)c.scale(-1,1);c.drawImage(img,b.x,b.y,b.w,b.h,-dw/2,-dh/2,dw,dh);c.restore()}
function shadow(x,y,w,h,a=.16){const c=S.ctx;c.save();c.globalAlpha=a;c.fillStyle='#1b2924';c.beginPath();c.ellipse(x,y,w,h,0,0,Math.PI*2);c.fill();c.restore()}
function drawPlayerSlash(x,groundY,p,flip){if(p<.16||p>.9)return;const q=Math.max(0,Math.min(1,(p-.16)/.74)),c=S.ctx;c.save();c.translate(x,groundY-29);if(flip)c.scale(-1,1);c.lineCap='round';c.globalAlpha=Math.sin(Math.PI*q)*.72;c.strokeStyle='rgba(41,65,71,.42)';c.lineWidth=8;c.beginPath();c.arc(-2,2,39,-2.42,-2.42+2.72*q);c.stroke();c.globalAlpha=Math.sin(Math.PI*q)*.92;c.strokeStyle='rgba(222,232,223,.9)';c.lineWidth=2.2;c.beginPath();c.arc(-2,2,40,-2.42,-2.42+2.72*q);c.stroke();c.restore()}
function dist(a,b){return Math.hypot((a?.x||0)-(b?.x||0),(a?.y||0)-(b?.y||0))}
function match(curr,now,area){
  const old=[...tracks.values()],used=new Set(),out=[];
  for(const e of curr){
    let best=null;
    if(e.id!=null){
      best=old.find(t=>!used.has(t.id)&&t.entityId===e.id)||null;
    }else{
      let bd=e.type==='rat'?45:80;
      for(const t of old){
        if(used.has(t.id)||t.type!==e.type)continue;
        const d=Math.hypot(e.x-t.x,e.y-t.y);
        if(d<bd){bd=d;best=t}
      }
    }
    if(!best){
      best={id:nextId++,entityId:e.id??null,type:e.type,x:e.x,y:e.y,px:e.x,py:e.y,seen:now,facing:1,attackStart:-9,lastAttack:-9,area,maxHp:e.max??e.hp,lastHp:e.hp,hitUntil:0};
      tracks.set(best.id,best);
    }else used.add(best.id);
    best.entityId=e.id??best.entityId;
    best.px=best.x;best.py=best.y;best.x=e.x;best.y=e.y;best.e=e;best.seen=now;best.area=area;
    best.maxHp=e.max??Math.max(best.maxHp||e.hp,e.hp);
    if(e.hp<(best.lastHp??e.hp)-.05){
      const damage=(best.lastHp??e.hp)-e.hp;
      best.hitUntil=now+.12;
      impacts.push({x:e.x,y:e.y,damage,start:now,fromX:lastSnapshot?.P?.x??e.x,fromY:lastSnapshot?.P?.y??e.y});
      hitStopUntil=Math.max(hitStopUntil,now+.045);
    }
    best.lastHp=e.hp;
    const dx=best.x-best.px;if(Math.abs(dx)>.12)best.facing=dx<0?-1:1;
    out.push(best);
  }
  for(const t of [...tracks.values()]){
    if(out.includes(t))continue;
    if(now-t.seen<.22)deaths.push({...t,start:now});
    tracks.delete(t.id);
  }
  return out;
}
function viewportMetrics(s){
  const game=document.querySelector('#game'),rect=game?.getBoundingClientRect?.();
  const cssW=Math.max(1,Math.round(rect?.width||window.innerWidth||390));
  const cssH=Math.max(1,Math.round(rect?.height||window.innerHeight||844));
  const mode=window.__xianxiaExplorationMode;
  const active=s?.phase==='run'&&mode?.active&&Number.isFinite(mode.scale)&&Number.isFinite(mode.left)&&Number.isFinite(mode.top);
  const worldScale=active?mode.scale:Math.max(cssW/W,cssH/H);
  const left=active?mode.left:(cssW-W*worldScale)/2;
  const top=active?mode.top:(cssH-H*worldScale)/2;
  const device=Math.max(1,window.devicePixelRatio||1);
  const pixelCap=Math.sqrt(S.maxPixels/Math.max(1,cssW*cssH));
  const renderScale=Math.max(.7,Math.min(device,S.dprCap,pixelCap));
  const viewW=active&&Number.isFinite(mode.viewW)?mode.viewW:cssW/worldScale;
  const viewH=active&&Number.isFinite(mode.viewH)?mode.viewH:cssH/worldScale;
  const camX=active&&Number.isFinite(mode.camX)?mode.camX:(cssW*.5-left)/worldScale;
  const camY=active&&Number.isFinite(mode.camY)?mode.camY:(cssH*.5-top)/worldScale;
  return {cssW,cssH,worldScale,left,top,renderScale,viewW,viewH,camX,camY,active};
}
function ensureViewport(m){
  const c=S.layer,bw=Math.max(1,Math.round(m.cssW*m.renderScale)),bh=Math.max(1,Math.round(m.cssH*m.renderScale));
  if(c.width!==bw||c.height!==bh){c.width=bw;c.height=bh;S.ctx.imageSmoothingEnabled=true}
  c.style.position='absolute';c.style.left='0';c.style.top='0';c.style.right='auto';c.style.bottom='auto';
  c.style.width=m.cssW+'px';c.style.height=m.cssH+'px';c.style.maxWidth='none';c.style.maxHeight='none';c.style.transform='none';
  S.renderScale=m.renderScale;S.bufferWidth=bw;S.bufferHeight=bh;
  const pad=160;
  activeBounds={x:Math.max(0,m.camX-m.viewW/2-pad),y:Math.max(0,m.camY-m.viewH/2-pad),w:Math.min(W,m.camX+m.viewW/2+pad)-Math.max(0,m.camX-m.viewW/2-pad),h:Math.min(H,m.camY+m.viewH/2+pad)-Math.max(0,m.camY-m.viewH/2-pad)};
}
function applyBackground(area,m){
  const img=S.images['bg_'+area]||S.images.bg_qingyun;if(!S.layer||!img)return;
  S.layer.style.backgroundImage=`linear-gradient(rgba(247,243,229,.04),rgba(20,31,28,.06)),url("${img.src}")`;
  S.layer.style.backgroundSize=`100% 100%,${W*m.worldScale}px ${H*m.worldScale}px`;
  S.layer.style.backgroundRepeat='no-repeat';
  S.layer.style.backgroundPosition=`0 0,${m.left}px ${m.top}px`;
}
function clearViewport(){
  const c=S.ctx;c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,S.layer.width,S.layer.height);
}
function setWorldTransform(m){
  const k=m.renderScale,c=S.ctx;
  c.setTransform(k*m.worldScale,0,0,k*m.worldScale,k*m.left,k*m.top);
}
function visible(x,y,pad=120){
  const b=activeBounds;
  return x>=b.x-pad&&x<=b.x+b.w+pad&&y>=b.y-pad&&y<=b.y+b.h+pad;
}
function drawGatherRings(s,t){const c=S.ctx;for(const o of s.objects||[]){if(o.type!=='h'||!visible(o.x,o.y,40))continue;const g=Math.max(0,Math.min(2,o.grade||0)),r=[16,18,20][g],pulse=1+Math.sin(t*3+o.x*.04+o.y*.03)*.04;c.save();c.globalAlpha=[.65,.72,.82][g];c.strokeStyle=['#4e8068','#4f7899','#8a609f'][g];c.lineWidth=[1.6,1.9,2.2][g];c.beginPath();c.ellipse(o.x,o.y+17,r*pulse,r*.42*pulse,0,0,Math.PI*2);c.stroke();c.globalAlpha=[.10,.13,.17][g];c.fillStyle=c.strokeStyle;c.fill();c.restore()}}
function drawPortal(t){if(!visible(EXIT.x,EXIT.y,90))return;shadow(EXIT.x,EXIT.y+2,32,6,.18);centered('objects',3,6,frame(t,7,6),EXIT.x,EXIT.y-12,74,false,.9)}
function drawObjects(s,t){for(const o of s.objects||[]){if(!visible(o.x,o.y,70))continue;if(o.type==='h'){const row=Math.max(0,Math.min(2,o.grade||0)),ground=o.y+16;shadow(o.x,ground,9,2.5,.13);anchored('objects',row,4,frame(t,1.55,4,(o.x+o.y)*.0015),o.x,ground,40,false,.96,String(row))}else{const ground=o.y+14;shadow(o.x,ground,9,3,.15);anchored('objects',4,4,0,o.x,ground,34,false,1,'4')}}if(s.vein&&visible(s.vein.x,s.vein.y,90)){const ground=s.vein.y+22;shadow(s.vein.x,ground,18,5,.2);anchored('objects',4,4,3,s.vein.x,ground,58,false,1,'4')}}
function drawHazards(s){const c=S.ctx;for(const h of s.hazards||[]){if(!visible(h.x,h.y,(h.r||0)+80))continue;c.save();const p=h.struck?1:1-Math.max(0,h.t)/(h.ttl||1);c.globalAlpha=h.struck?.8:.25+p*.45;c.strokeStyle=h.struck?'#eaf4ff':'#495b82';c.lineWidth=h.struck?4:2;c.setLineDash(h.struck?[]:[6,6]);c.beginPath();c.arc(h.x,h.y,h.r*(.82+p*.18),0,Math.PI*2);c.stroke();if(h.struck){c.beginPath();c.moveTo(h.x-7,h.y-60);c.lineTo(h.x+5,h.y-24);c.lineTo(h.x-3,h.y-24);c.lineTo(h.x+9,h.y);c.stroke()}c.restore()}}
const enemyAssets={
  qingyun:{basic:'qingyun_basic',guard:'qingyun_guard',chaser:'qingyun_chaser',attacker:'qingyun_chaser',elite:'qingyun_guard'},
  blackwind:{basic:'blackwind_basic',guard:'blackwind_guard',chaser:'blackwind_chaser',attacker:'blackwind_attacker',elite:'blackwind_guard'},
  blood:{basic:'blood_basic',guard:'blood_guard',chaser:'blood_chaser',attacker:'blood_attacker',elite:'blood_elite'},
  thunder:{basic:'thunder_basic',guard:'thunder_guard',chaser:'thunder_chaser',attacker:'thunder_attacker',elite:'thunder_elite'}
};
const specialEnemyAssets={spirit:'spirit_deer',rat:'treasure_rat',rogue:'wandering_rival'};
function enemyKey(area,type){return specialEnemyAssets[type]||enemyAssets[area]?.[type]||enemyAssets[area]?.chaser||'qingyun_chaser'}
const traitRows={frenzy:2,iron:3,howl:4,devour:5};
function drawTraitFx(tr,t,x,y,h){
  const row=traitRows[tr.e?.rareTrait];if(row===undefined)return;
  centered('trait_fx',row,4,frame(t,5,4,tr.id*.13),x,y-h*.34,Math.max(72,h*1.18),false,.62);
}
function drawBar(x,y,w,ratio,elite=false){const c=S.ctx;c.save();c.fillStyle='rgba(32,29,24,.68)';c.fillRect(x-w/2,y,w,5);c.fillStyle=elite?'#9b3e34':'#d5cba7';c.fillRect(x-w/2+1,y+1,(w-2)*Math.max(0,Math.min(1,ratio)),3);c.strokeStyle='rgba(244,238,215,.82)';c.lineWidth=.7;c.strokeRect(x-w/2+.5,y+.5,w-1,4);c.restore()}
function drawEnemyMarker(x,y,h,elite=false,rare=false){const c=S.ctx;c.save();c.globalAlpha=.88;c.strokeStyle=rare?'#b78c45':elite?'#9b3e34':'rgba(244,238,215,.88)';c.lineWidth=elite?2.3:1.5;c.beginPath();c.ellipse(x,y+20,elite?31:25,elite?9:7,0,0,Math.PI*2);c.stroke();c.globalAlpha=.35;c.strokeStyle='#1c2925';c.lineWidth=4;c.beginPath();c.ellipse(x,y+20,elite?34:28,elite?11:9,0,0,Math.PI*2);c.stroke();c.restore()}
function drawSpiritCapture(e,x,y,h,s,t){
  const c=S.ctx,bond=Math.max(0,e.bond||0),progress=Math.max(0,Math.min(1,bond/1.3)),d=dist(e,s.P),near=d<(e.captureRange||40),w=72,barY=y-h-18;
  c.save();
  const pulse=.78+Math.sin(t*5+e.id)*.12;
  c.globalAlpha=pulse;c.strokeStyle=near?'#7be0d7':'#d9ffff';c.lineWidth=2.2;c.setLineDash(near?[]:[5,4]);
  c.beginPath();c.ellipse(x,y+22,near?31:27,near?10:8,0,0,Math.PI*2);c.stroke();c.setLineDash([]);
  c.globalAlpha=.92;c.fillStyle='rgba(5,18,20,.82)';c.fillRect(x-w/2,barY,w,9);
  c.fillStyle='#79ded6';c.fillRect(x-w/2+1,barY+1,(w-2)*progress,7);
  c.strokeStyle='rgba(217,255,255,.9)';c.lineWidth=1;c.strokeRect(x-w/2+.5,barY+.5,w-1,8);
  c.font='bold 11px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#efffff';
  c.fillText(near?`포획 ${Math.round(progress*100)}%`:'영수 · 가까이 유지',x,barY-8);
  if(near){c.globalAlpha=.18+.10*Math.sin(t*7);c.fillStyle='#79ded6';c.beginPath();c.arc(x,y,36,0,Math.PI*2);c.fill()}
  c.restore();
}
function drawEnemies(s,t,now){
  const area=s.M?.area||'qingyun',matched=match(s.enemies||[],now,area);
  for(const tr of matched){
    const e=tr.e;if(!visible(e.x,e.y,180))continue;
    const special=e.type==='spirit'||e.type==='rat'||e.type==='rogue';
    const canAttack=!special;
    const near=canAttack&&dist(e,s.P)<(e.type==='elite'?70:48);
    if(near&&now-tr.lastAttack>.72){tr.attackStart=now;tr.lastAttack=now;tr.facing=(s.P?.x??e.x)>=e.x?1:-1}
    const attacking=canAttack&&now-tr.attackStart<.55,moving=Math.hypot(tr.x-tr.px,tr.y-tr.py)>.15,key=enemyKey(area,e.type);
    let row=0,idx=moving?frame(t,9,6,tr.id*.09):frame(t,2.15,6,tr.id*.17);
    let h=e.type==='elite'?96:e.type==='spirit'?62:e.type==='rat'?44:e.type==='rogue'?76:e.type==='guard'?66:e.type==='attacker'?64:60;
    if(attacking){row=1;idx=progress((now-tr.attackStart)/.55,6)}
    const idle=!moving&&!attacking,roamAmp=e.type==='chaser'?6:e.type==='guard'?3.5:e.type==='elite'?2:e.type==='spirit'?4:2.5;
    const rx=idle?Math.sin(t*.82+tr.id*1.71)*roamAmp:0,ry=idle?Math.sin(t*.57+tr.id*.91)*1.5:0,x=e.x+rx,y=e.y+ry;
    if(e.rare){
      const cc=S.ctx;cc.save();cc.globalAlpha=.24;cc.strokeStyle=area==='blood'?'#ba493b':'#ad8b43';cc.lineWidth=2;cc.beginPath();cc.arc(x,y,31,0,Math.PI*2);cc.stroke();cc.restore();
    }
    if(e.type!=='spirit')drawEnemyMarker(x,y,h,e.type==='elite',e.rare);
    else drawSpiritCapture(e,x,y,h,s,t);
    const ground=y+22;shadow(x,ground,e.type==='rat'?15:e.type==='spirit'?19:25,e.type==='rat'?3:5,.22);
    drawTraitFx(tr,t,x,y,h);
    const hit=now<tr.hitUntil,filter=hit?'brightness(2.15) saturate(.3)':'none';
    anchored(key,row,6,idx,x,ground,h,tr.facing<0,1,'body',filter);
    const hpRatio=(e.hp||0)/(tr.maxHp||e.hp||1);
    if(e.type!=='spirit'&&(e.type==='elite'||hit||dist(e,s.P)<145))drawBar(x,ground-h-9,e.type==='elite'?52:e.type==='rat'?30:40,hpRatio,e.type==='elite');
  }
  for(let i=deaths.length-1;i>=0;i--){
    const d=deaths[i],age=now-d.start;if(age>.72){deaths.splice(i,1);continue}
    if(!visible(d.x,d.y,180))continue;
    const key=enemyKey(d.area||area,d.type),ground=d.y+22,h=d.type==='elite'?96:d.type==='spirit'?62:d.type==='rat'?44:d.type==='rogue'?76:d.type==='guard'?66:60;
    shadow(d.x,ground,d.type==='rat'?15:25,4,.14*(1-age/.72));
    anchored(key,2,4,progress(age/.72,4),d.x,ground,h,d.facing<0,1-age*.55);
  }
}
function drawPlayer(s,t){const p=s.P;if(!p)return;let moving=false,dx=0;if(prevP){dx=p.x-prevP.x;moving=Math.hypot(dx,p.y-prevP.y)>.16}if(Math.abs(dx)>.12)pFacing=dx<0?-1:1;if(p.tx!==undefined&&Math.abs(p.tx-p.x)>2)pFacing=p.tx<p.x?-1:1;const mortal=(s.M?.realm?.major??-1)<0,atk=s.M?.cult?.atk||1,maxCd=Math.max(.2,.55-(atk-1)*.02),att=!mortal&&p.cd>0.01,attackPhase=att?1-Math.min(maxCd,p.cd)/maxCd:0;let row=0,cols=4,idx=frame(t,4,4);if(att){row=2;cols=6;idx=attackPhase<.36?0:attackPhase<.72?1:0}else if(moving){row=1;cols=6;idx=frame(t,10,6)}const ground=p.y+23;shadow(p.x,ground,11,3,.19);anchored('player',row,cols,idx,p.x,ground,100,pFacing<0);if(att)drawPlayerSlash(p.x,ground,attackPhase,pFacing<0);prevP={x:p.x,y:p.y}}
const effectRow={sword:0,wave:1,chain:2,thunder:3,array:4};
function detectCasts(s,now){const cds=s.run?.skillCooldowns||{};for(const[id,value]of Object.entries(cds)){const before=prevCooldowns[id]??value;if(value>before+.12){let x=s.P?.x||350,y=s.P?.y||230;if(id==='sword')x+=pFacing*48;else if(id==='thunder'&&s.enemies?.length){x=s.enemies[0].x;y=s.enemies[0].y}casts.push({id,x,y,start:now,facing:pFacing})}prevCooldowns[id]=value}}
function drawCasts(now){for(let i=casts.length-1;i>=0;i--){const e=casts[i],age=now-e.start;if(age>.64){casts.splice(i,1);continue}if(!visible(e.x,e.y,180))continue;const row=effectRow[e.id];if(row===undefined)continue;const size=e.id==='array'?140:e.id==='wave'?116:e.id==='thunder'?102:86;centered('effects',row,4,progress(age/.64,4),e.x,e.y+8,size,e.facing<0,1-age*.35)}}
function objectKey(o){return `${o.type}:${o.grade??'-'}:${Math.round(o.x)}:${Math.round(o.y)}`}
function detectRewards(s,now){if(s.phase!=='run'||!s.run){prevObjects=(s.objects||[]).map(o=>({...o}));prevRun=s.run?{...s.run}:null;return}const prev=prevRun||s.run,ds=Math.max(0,(s.run.s||0)-(prev.s||0)),dh=[0,1,2].map(i=>Math.max(0,(s.run['h'+i]||0)-(prev['h'+i]||0)));const curKeys=new Set((s.objects||[]).map(objectKey)),gone=prevObjects.filter(o=>!curKeys.has(objectKey(o)));const recentDeath=deaths.length?deaths[deaths.length-1]:null;const takeOrigin=(kind,grade)=>{const ix=gone.findIndex(o=>o.type===kind&&(grade==null||o.grade===grade));if(ix>=0)return gone.splice(ix,1)[0];if(recentDeath)return {x:recentDeath.x,y:recentDeath.y};if(s.vein)return {x:s.vein.x,y:s.vein.y};return {x:s.P?.x||350,y:s.P?.y||230}};if(ds>0){const o=takeOrigin('s');pickups.push({kind:'s',x:o.x,y:o.y,start:now,d:.3,amount:ds});floaters.push({text:`+${ds} 영석`,color:'#9e792f',start:now+.18,d:.8})}for(let g=0;g<3;g++)if(dh[g]>0){const o=takeOrigin('h',g);pickups.push({kind:'h',grade:g,x:o.x,y:o.y,start:now,d:.28,amount:dh[g]});floaters.push({text:`+${dh[g]} ${['하급','중급','상급'][g]} 영초`,color:['#477d53','#397d6b','#76549a'][g],start:now+.16,d:.82})}prevObjects=(s.objects||[]).map(o=>({...o}));prevRun={s:s.run.s||0,h0:s.run.h0||0,h1:s.run.h1||0,h2:s.run.h2||0}}
function detectVeinFx(s,now){
  if(s.phase!=='run'){prevVein=s.vein?{...s.vein}:null;return}
  if(prevVein&&!s.vein)veinBursts.push({x:prevVein.x,y:prevVein.y,start:now,amount:prevVein.stock||0});
  prevVein=s.vein?{...s.vein}:null;
}
function drawVeinFx(now){
  const c=S.ctx;
  for(let i=veinBursts.length-1;i>=0;i--){
    const q=veinBursts[i],age=now-q.start,d=1.15;
    if(age>d){veinBursts.splice(i,1);continue}
    if(!visible(q.x,q.y,180))continue;
    const u=Math.max(0,Math.min(1,age/d)),fade=1-u;
    c.save();c.translate(q.x,q.y);
    c.globalAlpha=.26*fade;c.fillStyle='#b7e7ff';c.shadowColor='#b7e7ff';c.shadowBlur=22;
    c.beginPath();c.arc(0,0,24+u*72,0,Math.PI*2);c.fill();c.shadowBlur=0;
    for(let r=0;r<3;r++){c.globalAlpha=Math.max(0,.95-u*.78-r*.16);c.strokeStyle=r===1?'#ffffff':'#8fd7ff';c.lineWidth=3-r*.6;c.beginPath();c.arc(0,0,18+u*(48+r*18)+r*6,0,Math.PI*2);c.stroke()}
    for(let p=0;p<14;p++){const a=p/14*Math.PI*2+.35,dd=18+u*(58+(p%4)*8),px=Math.cos(a)*dd,py=Math.sin(a)*dd-u*(10+(p%3)*5);c.globalAlpha=fade*(.65+(p%3)*.12);c.fillStyle=p%3===0?'#ffffff':'#9edcff';c.save();c.translate(px,py);c.rotate(a+u*2.4);c.fillRect(-2.5,-2.5,5,5);c.restore()}
    c.globalAlpha=Math.min(1,age/.12)*fade;c.font='800 15px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';c.textAlign='center';c.textBaseline='middle';c.strokeStyle='rgba(29,48,56,.88)';c.lineWidth=4;c.fillStyle='#effbff';
    const label=q.amount?'영맥 채굴 완료 · +'+q.amount+' 영석':'영맥 채굴 완료';
    c.strokeText(label,0,-54-u*18);c.fillText(label,0,-54-u*18);c.restore();
  }
}
function drawPickupFx(s,t,now){const c=S.ctx,p=s.P||{x:350,y:230};for(let i=pickups.length-1;i>=0;i--){const q=pickups[i],age=now-q.start,u=Math.max(0,Math.min(1,age/q.d));if(u>=1){pickups.splice(i,1);continue}const ease=1-Math.pow(1-u,3),bend=Math.sin(Math.PI*u)*-18,x=q.x+(p.x-q.x)*ease,y=q.y+(p.y-18-q.y)*ease+bend,alpha=1-u*.25,scale=1-u*.55;if(q.kind==='h'){const row=q.grade||0;anchored('objects',row,4,frame(t,1.5,4),x,y+13,32*scale,false,alpha,String(row))}else{c.save();c.globalAlpha=alpha;c.fillStyle='#d9c06d';c.shadowColor='#f5e7a6';c.shadowBlur=8;c.beginPath();c.arc(x,y,5*scale+2,0,Math.PI*2);c.fill();c.restore()}c.save();c.globalAlpha=.25*(1-u);c.strokeStyle=q.kind==='h'?'#79a982':'#c7a95b';c.lineWidth=2;c.beginPath();c.moveTo(q.x,q.y);c.quadraticCurveTo((q.x+p.x)/2,(q.y+p.y)/2-26,x,y);c.stroke();c.restore()}for(let i=floaters.length-1;i>=0;i--){const f=floaters[i],age=now-f.start;if(age<0)continue;if(age>f.d){floaters.splice(i,1);continue}const u=age/f.d;c.save();c.globalAlpha=Math.min(1,age/.1)*(1-u);c.fillStyle=f.color;c.strokeStyle='rgba(250,246,231,.88)';c.lineWidth=3;c.font='700 15px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';c.textAlign='center';const x=p.x,y=p.y-46-u*24;c.strokeText(f.text,x,y);c.fillText(f.text,x,y);c.restore()}}
function drawImpacts(now){const c=S.ctx;for(let i=impacts.length-1;i>=0;i--){const q=impacts[i],age=now-q.start;if(age>.42){impacts.splice(i,1);continue}const u=age/.42;c.save();if(age<.14){const beamU=Math.min(1,age/.1),tx=q.fromX+(q.x-q.fromX)*beamU,ty=q.fromY+(q.y-q.fromY)*beamU;c.globalAlpha=1-age/.16;c.strokeStyle='#f6efd3';c.shadowColor='#fff7d6';c.shadowBlur=9;c.lineWidth=4;c.beginPath();c.moveTo(q.fromX,q.fromY);c.lineTo(tx,ty);c.stroke();c.strokeStyle='#8caea3';c.lineWidth=1.4;c.beginPath();c.moveTo(q.fromX,q.fromY+2);c.lineTo(tx,ty+2);c.stroke()}c.globalAlpha=(1-u)*.9;c.strokeStyle='#fff7df';c.lineWidth=2.5;c.beginPath();c.arc(q.x,q.y,7+u*18,0,Math.PI*2);c.stroke();c.beginPath();c.moveTo(q.x-11-u*6,q.y+8);c.lineTo(q.x+12+u*8,q.y-10);c.moveTo(q.x-7,q.y-12-u*4);c.lineTo(q.x+8,q.y+10+u*5);c.stroke();c.globalAlpha=1-u;c.fillStyle='#8b352d';c.strokeStyle='#f8f1dc';c.lineWidth=3;c.font='800 13px sans-serif';c.textAlign='center';const text=`-${Math.max(1,Math.round(q.damage))}`;c.strokeText(text,q.x,q.y-28-u*18);c.fillText(text,q.x,q.y-28-u*18);c.restore()}}
function resetRunVisuals(){
  tracks.clear();deaths.length=0;casts.length=0;impacts.length=0;pickups.length=0;floaters.length=0;veinBursts.length=0;
  prevP=null;prevCooldowns={};prevObjects=[];prevRun=null;prevVein=null;hitStopUntil=0;lastSnapshot=null;
  if(S.ctx&&S.layer)clearViewport();
}
function drawFrame(s,meta){
  if(!S.ready||!s)return;
  const ms=meta?.now??performance.now(),t=ms/1000,now=ms/1000,area=s.M?.area||'qingyun';
  const m=viewportMetrics(s);
  ensureViewport(m);
  const changed=area!==lastArea||s.phase!==lastPhase;
  if(changed)resetRunVisuals();
  lastArea=area;lastPhase=s.phase;
  applyBackground(area,m);
  if(s.phase!=='run'){
    if(changed)clearViewport();
    lastSnapshot=s;
    return;
  }
  detectVeinFx(s,now);
  detectRewards(s,now);
  if(now<hitStopUntil){
    setWorldTransform(m);drawImpacts(now);drawPickupFx(s,t,now);lastSnapshot=s;return;
  }
  clearViewport();
  setWorldTransform(m);
  drawPortal(t);
  drawHazards(s);
  drawGatherRings(s,t);
  drawObjects(s,t);
  drawVeinFx(now);
  detectCasts(s,now);
  drawEnemies(s,t,now);
  drawCasts(now);
  drawPlayer(s,t);
  drawImpacts(now);
  drawPickupFx(s,t,now);
  lastSnapshot=s;
}
async function boot(){try{
  if(!makeLayer())throw new Error('game canvas not found');
  const entries=await Promise.all(Object.entries(files).map(async([k,v])=>[k,await load(v)]));S.images=Object.fromEntries(entries);
  prepare('player',[4,6,6]);
  for(const key of ['qingyun_guard','qingyun_chaser','blackwind_guard','blackwind_chaser','blood_guard','blood_chaser','thunder_guard','thunder_chaser'])prepare(key,[6,6,4]);
  for(const key of ['qingyun_basic','blackwind_basic','blackwind_attacker','blood_basic','blood_attacker','blood_elite','thunder_basic','thunder_attacker','thunder_elite','spirit_deer','treasure_rat','wandering_rival'])prepareNew(key,[6,6,4]);
  prepareMartenActions('thunder_attacker');
  prepare('objects',[4,4,4,6,4]);prepare('effects',[4,4,4,4,4]);prepareNew('trait_fx',[4,4,4,4,4,4,4]);
  S.ready=true;document.querySelector('#v1132GatherLayer')?.remove();document.documentElement.dataset.inkAssets='11.31.2-ready';
  console.info('[xianxia] ink runtime 11.31.2 · 13 prepared assets bound');
  const hub=window.__xianxiaFrameHub;if(!hub?.subscribe)throw new Error('shared frame hub unavailable');hub.subscribe('ink-render',drawFrame,25);hub.wake?.()
}catch(e){S.error=String(e?.message||e);document.documentElement.dataset.inkAssets='11.31.2-error';console.warn('[xianxia] ink asset runtime failed',e)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

//# sourceURL=ink_runtime_world_v11_45.js
