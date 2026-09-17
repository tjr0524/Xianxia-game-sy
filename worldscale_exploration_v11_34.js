(()=>{
'use strict';
const VERSION='11.34.0',W=1120,H=1200,EXIT_X=560,EXIT_Y=600,EXIT_APPROACH_Y=577;
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
  src=once(src,`    const dpr=Math.min(2,Math.max(1.5,window.devicePixelRatio||1));`,`    const dpr=Math.min(1.6,Math.max(1.35,window.devicePixelRatio||1));`,'hires scale');
  src=once(src,`      if(/\\/runtime\\/backgrounds\\/(qingyun|blackwind|blood|thunder)\\.png/.test(src))return;`,`      // Expanded world keeps the ink background on the same canvas as all actors.`,'background unification');
  src=once(src,`  state.camX=s?.P?.x??350;state.camY=s?.P?.y??230;`,`  state.camX=s?.P?.x??W/2;state.camY=s?.P?.y??H/2;`,'activate camera');
  src=once(src,`  state.prevPX=s?.P?.x??null;state.prevPY=s?.P?.y??null;state.leadX=state.leadY=0;`,`  state.prevPX=s?.P?.x??null;state.prevPY=s?.P?.y??null;state.leadX=state.leadY=0;`,'activate previous');
  src=once(src,`  const p=s.P||{x:350,y:230},m=viewMetrics();updateLead(p,m);`,`  const p=s.P||{x:W/2,y:H/2},m=viewMetrics();updateLead(p,m);`,'camera fallback');
  src=once(src,`  const target=worldToScreen(EXIT_APPROACH.x,EXIT_APPROACH.y),p=s.P||{x:350,y:230},player=worldToScreen(p.x,p.y);`,`  const target=worldToScreen(EXIT_APPROACH.x,EXIT_APPROACH.y),p=s.P||{x:W/2,y:H/2},player=worldToScreen(p.x,p.y);`,'guide fallback');
  src=once(src,`function screenToWorld(e){return{x:clamp((e.clientX-state.left)/state.scale,11,689),y:clamp((e.clientY-state.top)/state.scale,11,449)}}`,`function screenToWorld(e){return{x:clamp((e.clientX-state.left)/state.scale,11,W-11),y:clamp((e.clientY-state.top)/state.scale,11,H-11)}}`,'pointer world bounds');
  (0,eval)(`${src}\n//# sourceURL=exploration_mode_v11_33.worldscale.js`);
  badge(`BUILD ${VERSION} · CAM ✓ · WORLD ${W}×${H}`);
}catch(error){console.error(error);badge(`BUILD ${VERSION} · CAM LOAD ERR`)}
})();