(()=>{
'use strict';
const VERSION='11.33.4';
const W=700,H=460,PAD_X=260,PAD_Y=390;
const $=s=>document.querySelector(s);

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

function syncWorldBackground(){
  const mode=window.__xianxiaExplorationMode;
  const bg=$('#v1133Backdrop');
  if(!mode||!bg){requestAnimationFrame(syncWorldBackground);return}

  if(mode.active){
    const s=Math.max(.01,Number(mode.scale)||1);
    const left=(Number(mode.left)||0)-PAD_X*s;
    const top=(Number(mode.top)||0)-PAD_Y*s;
    const width=(W+PAD_X*2)*s;
    const height=(H+PAD_Y*2)*s;

    bg.style.setProperty('left',`${left}px`,'important');
    bg.style.setProperty('top',`${top}px`,'important');
    bg.style.setProperty('width',`${width}px`,'important');
    bg.style.setProperty('height',`${height}px`,'important');
    bg.style.setProperty('inset','auto','important');
    bg.style.setProperty('transform','none','important');

    badge(`BUILD ${VERSION} · CAM ${s.toFixed(2)}× · WORLD ✓`);
  }else{
    bg.style.removeProperty('left');
    bg.style.removeProperty('top');
    bg.style.removeProperty('width');
    bg.style.removeProperty('height');
    bg.style.removeProperty('inset');
    bg.style.removeProperty('transform');
    badge(`BUILD ${VERSION} · CAM ✓ · WORLD ✓`);
  }
  requestAnimationFrame(syncWorldBackground);
}

installCss();
badge(`BUILD ${VERSION} · CAM ✓ · WORLD ✓`);
requestAnimationFrame(syncWorldBackground);
})();
