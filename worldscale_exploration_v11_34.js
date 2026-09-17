(()=>{
'use strict';
const VERSION='11.35.0',W=1800,H=2400,EXIT_X=900,EXIT_Y=1200,EXIT_APPROACH_Y=1177;
const VISIBLE_H=960,SMOOTHING=.14,DEAD_X=.08,DEAD_Y=.06,LOOK_AHEAD=.08;
const badge=text=>{const e=document.querySelector('#buildVersion');if(e)e.textContent=text};
function load(path){const x=new XMLHttpRequest();x.open('GET',`${path}?v=${encodeURIComponent(VERSION)}`,false);x.send(null);if(!((x.status>=200&&x.status<300)||x.status===0))throw new Error(`${path} load failed: ${x.status}`);return x.responseText}
function once(src,from,to,label){const i=src.indexOf(from);if(i<0)throw new Error(`exploration patch missing: ${label}`);return src.slice(0,i)+to+src.slice(i+from.length)}
try{
  let src=load('exploration_mode_v11_33.js');
  src=once(src,`const VERSION='11.33.3';`,`const VERSION='${VERSION}';`,'version');
  src=once(src,
`const W=700,H=460;
const EXIT_APPROACH={x:350,y:415};`,
`const W=${W},H=${H};
const EXIT_APPROACH={x:${EXIT_X},y:${EXIT_APPROACH_Y}};`,'world constants');
  src=once(src,`  camX:350,camY:230,left:0,top:0,scale:1,viewW:W,viewH:H,`,`  camX:W/2,camY:H/2,left:0,top:0,scale:1,viewW:W,viewH:H,`,'camera initial');
  src=once(src,`    const dpr=Math.min(2,Math.max(1.5,window.devicePixelRatio||1));`,`    const dpr=1;`,'world canvas density');
  src=once(src,`      if(/\\/runtime\\/backgrounds\\/(qingyun|blackwind|blood|thunder)\\.png/.test(src))return;`,`      // Background is now rendered in the same world canvas as actors.`,'background unification');
  src=once(src,`        const k=.90,dx=args[5],dy=args[6],dw=args[7],dh=args[8],ground=dy+dh;`,`        const k=1,dx=args[5],dy=args[6],dw=args[7],dh=args[8],ground=dy+dh;`,'sprite scale');
  src=once(src,`  state.camX=s?.P?.x??350;state.camY=s?.P?.y??230;`,`  state.camX=s?.P?.x??W/2;state.camY=s?.P?.y??H/2;state.cameraStamp=performance.now();`,'activate camera');
  src=once(src,
`function viewMetrics(){
  const vw=Math.max(1,window.innerWidth||document.documentElement.clientWidth||390);
  const vh=Math.max(1,window.innerHeight||document.documentElement.clientHeight||844);
  const portrait=vh>vw;
  const targetViewW=portrait?360:620;
  const scale=portrait?clamp(vw/targetViewW,.96,1.34):clamp(vw/targetViewW,1.0,1.65);
  return {vw,vh,portrait,scale,viewW:vw/scale,viewH:vh/scale};
}`,
`function viewMetrics(){
  const vw=Math.max(1,window.innerWidth||document.documentElement.clientWidth||390);
  const vh=Math.max(1,window.innerHeight||document.documentElement.clientHeight||844);
  const portrait=vh>vw;
  const viewH=${VISIBLE_H};
  const scale=vh/viewH;
  return {vw,vh,portrait,scale,viewW:vw/scale,viewH};
}`,'camera metrics');
  src=once(src,
`function updateLead(p,m){
  if(state.prevPX==null){state.prevPX=p.x;state.prevPY=p.y;return}
  const dx=p.x-state.prevPX,dy=p.y-state.prevPY;state.prevPX=p.x;state.prevPY=p.y;
  const mag=Math.hypot(dx,dy);let tx=0,ty=0;
  if(mag>.06){const amount=m.portrait?58:46;tx=dx/mag*amount;ty=dy/mag*amount}
  state.leadX+=(tx-state.leadX)*.095;state.leadY+=(ty-state.leadY)*.095;
  if(mag<.025){state.leadX*=.93;state.leadY*=.93}
}`,
`function updateLead(p,m){
  if(state.prevPX==null){state.prevPX=p.x;state.prevPY=p.y;return}
  const dx=p.x-state.prevPX,dy=p.y-state.prevPY;state.prevPX=p.x;state.prevPY=p.y;
  const mag=Math.hypot(dx,dy);let tx=0,ty=0;
  if(mag>.02){tx=dx/mag*m.viewW*${LOOK_AHEAD};ty=dy/mag*m.viewH*${LOOK_AHEAD}}
  state.leadX+=(tx-state.leadX)*.16;state.leadY+=(ty-state.leadY)*.16;
  if(mag<.01){state.leadX*=.90;state.leadY*=.90}
}`,'look ahead');
  src=once(src,
`function updateCamera(s){
  const p=s.P||{x:350,y:230},m=viewMetrics();updateLead(p,m);
  state.viewW=m.viewW;state.viewH=m.viewH;state.scale=m.scale;
  const focusX=p.x+state.leadX,focusY=p.y+state.leadY;
  if(!state.ready){state.camX=focusX;state.camY=focusY;state.ready=true}
  const deadX=40,deadY=34;
  let tx=state.camX,ty=state.camY;
  if(focusX<state.camX-deadX)tx=focusX+deadX;else if(focusX>state.camX+deadX)tx=focusX-deadX;
  if(focusY<state.camY-deadY)ty=focusY+deadY;else if(focusY>state.camY+deadY)ty=focusY-deadY;
  tx=clamp(tx,70,W-70);ty=clamp(ty,70,H-70);
  state.camX+=(tx-state.camX)*.12;state.camY+=(ty-state.camY)*.12;
  state.camX=clamp(state.camX,70,W-70);state.camY=clamp(state.camY,70,H-70);
  const anchorY=m.portrait?m.vh*.54:m.vh*.5;
  state.left=m.vw/2-state.camX*m.scale;state.top=anchorY-state.camY*m.scale;
  for(const layer of layers()){
    layer.style.position='absolute';layer.style.left=\`${'${state.left}'}px\`;layer.style.top=\`${'${state.top}'}px\`;
    layer.style.right='auto';layer.style.bottom='auto';layer.style.width=\`${'${W*m.scale}'}px\`;layer.style.height=\`${'${H*m.scale}'}px\`;
    layer.style.maxWidth='none';layer.style.maxHeight='none';layer.style.transform='none';layer.style.transformOrigin='0 0';
  }
  buildBadge(\`BUILD ${'${VERSION}'} · CAM ${'${m.scale.toFixed(2)}'}× ✓\`);
}`,
`function updateCamera(s){
  const p=s.P||{x:W/2,y:H/2},m=viewMetrics();updateLead(p,m);
  state.viewW=m.viewW;state.viewH=m.viewH;state.scale=m.scale;
  const focusX=p.x+state.leadX,focusY=p.y+state.leadY;
  if(!state.ready){state.camX=p.x;state.camY=p.y;state.ready=true;state.cameraStamp=performance.now()}
  const deadX=m.viewW*${DEAD_X},deadY=m.viewH*${DEAD_Y};
  let tx=state.camX,ty=state.camY;
  if(focusX<state.camX-deadX)tx=focusX+deadX;else if(focusX>state.camX+deadX)tx=focusX-deadX;
  if(focusY<state.camY-deadY)ty=focusY+deadY;else if(focusY>state.camY+deadY)ty=focusY-deadY;
  const halfW=m.viewW/2,halfH=m.viewH/2;
  tx=clamp(tx,halfW,W-halfW);ty=clamp(ty,halfH,H-halfH);
  const now=performance.now(),dt=Math.min(.08,Math.max(.001,(now-(state.cameraStamp||now))/1000));state.cameraStamp=now;
  const alpha=1-Math.exp(-dt/${SMOOTHING});
  state.camX+=(tx-state.camX)*alpha;state.camY+=(ty-state.camY)*alpha;
  state.camX=clamp(state.camX,halfW,W-halfW);state.camY=clamp(state.camY,halfH,H-halfH);
  state.left=m.vw/2-state.camX*m.scale;state.top=m.vh/2-state.camY*m.scale;
  for(const layer of layers()){
    layer.style.position='absolute';layer.style.left=\`${'${state.left}'}px\`;layer.style.top=\`${'${state.top}'}px\`;
    layer.style.right='auto';layer.style.bottom='auto';layer.style.width=\`${'${W*m.scale}'}px\`;layer.style.height=\`${'${H*m.scale}'}px\`;
    layer.style.maxWidth='none';layer.style.maxHeight='none';layer.style.transform='none';layer.style.transformOrigin='0 0';
  }
  buildBadge(\`BUILD ${'${VERSION}'} · CAM ${'${m.scale.toFixed(2)}'}× · 960H ✓\`);
}`,'camera behavior');
  src=once(src,`  const target=worldToScreen(EXIT_APPROACH.x,EXIT_APPROACH.y),p=s.P||{x:350,y:230},player=worldToScreen(p.x,p.y);`,`  const target=worldToScreen(EXIT_APPROACH.x,EXIT_APPROACH.y),p=s.P||{x:W/2,y:H/2},player=worldToScreen(p.x,p.y);`,'guide fallback');
  src=once(src,`function screenToWorld(e){return{x:clamp((e.clientX-state.left)/state.scale,11,689),y:clamp((e.clientY-state.top)/state.scale,11,449)}}`,`function screenToWorld(e){return{x:clamp((e.clientX-state.left)/state.scale,11,W-11),y:clamp((e.clientY-state.top)/state.scale,11,H-11)}}`,'pointer world bounds');
  (0,eval)(`${src}\n//# sourceURL=exploration_mode_v11_33.worldscale.js`);
  badge(`BUILD ${VERSION} · CAM ✓ · WORLD ${W}×${H}`);
}catch(error){console.error(error);badge(`BUILD ${VERSION} · CAM LOAD ERR`)}
})();