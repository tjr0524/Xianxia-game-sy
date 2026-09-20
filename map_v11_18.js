(()=>{
'use strict';
if(window.__xianxiaMapArtVersion==='11.52')return;
window.__xianxiaMapArtVersion='11.52';
const $=s=>document.querySelector(s);
function addCss(){
  if($('#v1152mapstyle'))return;
  const s=document.createElement('style');
  s.id='v1152mapstyle';
  s.textContent=`
.map-viewport{
  background:#0b0e12!important;
  border-color:#4a5458!important;
  box-shadow:inset 0 0 34px #0008,0 8px 24px #0005!important;
}
.map-world{
  isolation:isolate!important;
  background:
    linear-gradient(#00000010,#00000010),
    url('assets/ink_v1/runtime/ui/bigeong_map_world_v2.webp?v=11.51.34') center/100% 100% no-repeat!important;
}
.map-svg{position:absolute!important;inset:0!important;z-index:2!important;overflow:visible!important;pointer-events:none!important}
.map-zone,.map-art-svg,.map-art-fog,.map-art-deco,.map-art-compass{display:none!important}

.area-qingyun{--map-color:#61d49a}
.area-blackwind{--map-color:#79b8ff}
.area-blood{--map-color:#ff5d57}
.area-foundation_trial{--map-color:#f2c864}
.area-thunder{--map-color:#5cb8ff}
.area-marsh{--map-color:#c25cff}
.area-taixu{--map-color:#f2c47a}

.map-route{pointer-events:none}
.map-route .route-glow{stroke:var(--map-color,#8ea3c8);opacity:.17;filter:blur(2.6px)}
.map-route .route-color{stroke:var(--map-color,#8ea3c8);opacity:.78;filter:drop-shadow(0 0 3px var(--map-color,#8ea3c8))}
.map-route .route-core{stroke:#f7f4e9;opacity:.76}
.map-route.locked{opacity:.28}
.map-route.available .route-glow{opacity:.30}
.map-route.available .route-color{opacity:.94}
.map-route.on .route-glow{opacity:.24}
.map-route.on .route-color{opacity:.90}
.map-route.gate{--map-color:#ead78d}
.map-route.gate.locked{opacity:.22}

.map-node{
  position:absolute!important;
  transform:translate(-50%,-50%)!important;
  margin:0!important;
  padding:0!important;
  border:0!important;
  background:transparent!important;
  color:transparent!important;
  z-index:5!important;
  overflow:visible!important;
  box-shadow:none!important;
  -webkit-tap-highlight-color:transparent;
}
.map-node::before{
  content:'';
  position:absolute;
  left:50%;top:50%;
  transform:translate(-50%,-50%);
  width:16px;height:16px;
  border-radius:50%;
  background:#f8f6e5;
  border:3px solid #111820;
  box-shadow:
    0 0 0 2px var(--map-color,#8ea3c8),
    0 0 10px var(--map-color,#8ea3c8),
    0 3px 7px #0008;
  transition:transform .12s,filter .12s,opacity .12s;
}
.map-point{width:44px!important;height:44px!important}
.map-root{width:52px!important;height:52px!important}
.map-root::before{
  width:22px;height:22px;
  border-width:3px;
  box-shadow:
    0 0 0 3px #111820,
    0 0 0 5px var(--map-color,#8ea3c8),
    0 0 14px var(--map-color,#8ea3c8),
    0 4px 9px #0009;
}
.map-node::after{
  content:'';
  position:absolute;
  left:calc(50% - 3px);
  top:calc(50% - 4px);
  width:4px;height:4px;
  border-radius:50%;
  background:#fff;
  opacity:.78;
  pointer-events:none;
}
.map-node.locked{opacity:.34!important;filter:saturate(.38)}
.map-node.on{opacity:1!important}
.map-node.available::before{
  filter:brightness(1.12);
  animation:mapNodePulse 1.65s ease-in-out infinite;
}
.map-root.current::before{
  box-shadow:
    0 0 0 3px #111820,
    0 0 0 5px var(--map-color,#8ea3c8),
    0 0 0 8px #f0c75eaa,
    0 0 18px #f0c75ecc,
    0 4px 9px #0009;
}
.map-node:active::before{transform:translate(-50%,-50%) scale(.90)}

.map-gate{
  --map-color:#ead78d;
  width:52px!important;
  height:52px!important;
}
.map-gate::before,.map-gate::after{display:none!important}
.gate-mark{
  position:absolute;
  left:50%;top:50%;
  width:30px;height:30px;
  transform:translate(-50%,-50%);
  filter:drop-shadow(0 0 7px #ead78d66);
}
.gate-mark i{position:absolute;display:block;background:#ead78d;box-shadow:0 0 0 2px #111820}
.gate-mark .roof{left:2px;top:2px;width:26px;height:7px;border-radius:6px 6px 2px 2px}
.gate-mark .beam{left:6px;top:11px;width:18px;height:4px;border-radius:2px;background:#f8f6e5}
.gate-mark .post{top:16px;width:5px;height:12px;border-radius:2px}
.gate-mark .p1{left:6px}.gate-mark .p2{right:6px}
.map-gate.locked{opacity:.32!important;filter:saturate(.35)}
.map-gate.available .gate-mark{animation:mapGatePulse 1.65s ease-in-out infinite}
.map-gate.on .gate-mark{filter:drop-shadow(0 0 8px #ead78daa)}

.map-point .rank,.map-root b,.area-symbol{display:none!important}

@keyframes mapNodePulse{
  0%,100%{filter:brightness(1.04) drop-shadow(0 0 2px var(--map-color,#8ea3c8))}
  50%{filter:brightness(1.22) drop-shadow(0 0 8px var(--map-color,#8ea3c8))}
}
@keyframes mapGatePulse{
  0%,100%{filter:drop-shadow(0 0 4px #ead78d66)}
  50%{filter:drop-shadow(0 0 11px #ead78dcc)}
}
@media(max-width:560px){
  .map-point{width:48px!important;height:48px!important}
  .map-root{width:56px!important;height:56px!important}
  .map-gate{width:56px!important;height:56px!important}
}
`;
  document.head.appendChild(s);
}
function boot(){
  addCss();
  if(!$('#mapWorld')){requestAnimationFrame(boot);return}
  document.addEventListener('xianxia:progression-rendered',addCss);
}
boot();
})();
