(()=>{
'use strict';
const VERSION='11.34.0';
const W=1120,H=1200,EXIT_X=560,EXIT_Y=600;
const badge=text=>{const e=document.querySelector('#buildVersion');if(e)e.textContent=text};
function load(path){
  const x=new XMLHttpRequest();
  x.open('GET',`${path}?v=${encodeURIComponent(VERSION)}`,false);
  x.send(null);
  if(!((x.status>=200&&x.status<300)||x.status===0))throw new Error(`${path} load failed: ${x.status}`);
  return x.responseText;
}
function once(src,from,to,label){
  const i=src.indexOf(from);
  if(i<0)throw new Error(`world patch missing: ${label}`);
  if(src.indexOf(from,i+from.length)>=0)throw new Error(`world patch duplicate: ${label}`);
  return src.slice(0,i)+to+src.slice(i+from.length);
}
try{
  let game=load('game_v11.js');
  game=once(game,
`const cv=$('#cv');
const g=cv.getContext('2d');
const W=700;
const H=460;
const EXIT={x:350,y:438,r:27};`,
`const cv=$('#cv');
const W=${W};
const H=${H};
cv.width=W;cv.height=H;
const g=cv.getContext('2d');
const EXIT={x:${EXIT_X},y:${EXIT_Y},r:27};`,'world constants');
  game=once(game,
`function edgePoint(){
  const edge=Math.floor(Math.random()*3);
  const margin=48;
  if(edge===0)return {x:margin,y:58+Math.random()*342};
  if(edge===1)return {x:W-margin,y:58+Math.random()*342};
  return {x:42+Math.random()*616,y:margin};
}`,
`function edgePoint(){
  const edge=Math.floor(Math.random()*4);
  const margin=48;
  if(edge===0)return {x:margin,y:margin+Math.random()*(H-margin*2)};
  if(edge===1)return {x:W-margin,y:margin+Math.random()*(H-margin*2)};
  if(edge===2)return {x:margin+Math.random()*(W-margin*2),y:margin};
  return {x:margin+Math.random()*(W-margin*2),y:H-margin};
}`,'edge spawn');
  game=once(game,
`point={x:clamp(anchor.x+Math.cos(angle)*radius,48,652),y:clamp(anchor.y+Math.sin(angle)*radius,40,408)};`,
`point={x:clamp(anchor.x+Math.cos(angle)*radius,48,W-48),y:clamp(anchor.y+Math.sin(angle)*radius,48,H-48)};`,'cluster bounds');
  game=once(game,
`const point={x:150+Math.random()*400,y:105+Math.random()*210};`,
`const point={x:W*.18+Math.random()*W*.64,y:H*.18+Math.random()*H*.64};`,'vein spawn');
  game=once(game,
`    x:clamp(P.x+(Math.random()-.5)*70,45,655),
    y:clamp(P.y+(Math.random()-.5)*70,45,405),`,
`    x:clamp(P.x+(Math.random()-.5)*70,45,W-45),
    y:clamp(P.y+(Math.random()-.5)*70,45,H-45),`,'lightning bounds');
  game=once(game,
`  P.x=clamp(P.x,11,689);
  P.y=clamp(P.y,11,449);`,
`  P.x=clamp(P.x,11,W-11);
  P.y=clamp(P.y,11,H-11);`,'player bounds');
  game=once(game,
`      enemy.x=clamp(enemy.x+enemy.vx*dt,18,682);
      enemy.y=clamp(enemy.y+enemy.vy*dt,18,420);`,
`      enemy.x=clamp(enemy.x+enemy.vx*dt,18,W-18);
      enemy.y=clamp(enemy.y+enemy.vy*dt,18,H-40);`,'spirit bounds');
  game=once(game,
`      if(enemy.escape)moveToward(enemy,enemy.x<350?-30:730,enemy.y,enemy.speed*1.2,dt);`,
`      if(enemy.escape)moveToward(enemy,enemy.x<W/2?-30:W+30,enemy.y,enemy.speed*1.2,dt);`,'rogue escape');
  game=once(game,
`    if((enemy.type==='rogue'||enemy.type==='rat')&&(enemy.x<-10||enemy.x>710))return false;`,
`    if((enemy.type==='rogue'||enemy.type==='rat')&&(enemy.x<-10||enemy.x>W+10))return false;`,'rogue cleanup');
  game=once(game,
`  constants:{RUN_TIME,AREAS,TREE,SKILLS,PLANS},`,
`  constants:{W,H,EXIT,EXIT_APPROACH,RUN_TIME,AREAS,TREE,SKILLS,PLANS},`,'debug constants');
  game=once(game,
`  moveTo:(x,y)=>setDestination({x:clamp(x,11,689),y:clamp(y,11,449)},false),`,
`  moveTo:(x,y)=>setDestination({x:clamp(x,11,W-11),y:clamp(y,11,H-11)},false),`,'debug move bounds');
  (0,eval)(`${game}\n//# sourceURL=game_v11.worldscale.js`);

  let ink=load('ink_runtime_v11_31.js');
  ink=once(ink,
`const W=700,H=460,EXIT={x:350,y:438},BASE='assets/ink_v1/';`,
`const W=${W},H=${H},EXIT={x:${EXIT_X},y:${EXIT_Y}},BASE='assets/ink_v1/';`,'ink world constants');
  (0,eval)(`${ink}\n//# sourceURL=ink_runtime_v11_31.worldscale.js`);
  window.__xianxiaWorldScale={version:VERSION,W,H,exit:{x:EXIT_X,y:EXIT_Y},scaleX:W/700,scaleY:H/460};
  badge(`BUILD ${VERSION} · WORLD ${W}×${H}`);
}catch(error){
  console.error(error);
  window.__xianxiaWorldScale={version:VERSION,error:String(error)};
  badge(`BUILD ${VERSION} · WORLD LOAD ERR`);
}
})();