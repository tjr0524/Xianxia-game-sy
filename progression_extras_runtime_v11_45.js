/* GENERATED FLAT RUNTIME 11.45 · source chain: progression_extras_v11_32 -> balance_progression_extras_v11_36 */
(()=>{
'use strict';
if(window.__xianxiaProgressionExtras?.version==='11.32.2')return;
const D=window.__xianxiaDebug;if(!D)return;
const SAVE_KEY='xianxia_proto_v11';
const OLD_KEYS=['xianxia_proto_v10','xianxia_proto_v9','xianxia_proto_v8','xianxia_proto_v7','xianxia_proto_v6','xianxia_proto_v5','xianxia_proto_v4'];
const $=s=>document.querySelector(s);
const EXTRA=[];
const POS={extra_speed:{x:965,y:1340,fromY:1415},extra_range:{x:235,y:1070,fromY:1145},extra_multi:{x:985,y:800,fromY:875},extra_cycle:{x:205,y:530,fromY:605}};
const herbKey=g=>g===0?'herb':g===1?'herb2':'herb3';
const reached=(M,r)=>M.realm?.major>r.major||(M.realm?.major===r.major&&M.realm?.stage>=r.stage);
function snap(){return D.snapshot()}
function commit(M){D.replaceState(M);try{localStorage.setItem(SAVE_KEY,JSON.stringify(D.snapshot().M))}catch{};setTimeout(()=>decorateTree(true),0)}
function ensure(M){M.cult||={atk:1,mov:1,sen:1,hp:1};M.skills||={};M.trainingExtras||={};return M}
function installCss(){if($('#v1132extrasStyle'))return;const s=document.createElement('style');s.id='v1132extrasStyle';s.textContent=`
details.dev{display:none!important}
#v1132GatherLayer{position:absolute;inset:0;z-index:3;width:100%;height:100%;pointer-events:none}
.asc-leaf .glyph{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI Symbol","Apple Color Emoji",sans-serif!important;font-size:18px!important;font-weight:700!important;line-height:1!important}
.asc-node.v32-extra{background-image:none!important;border:1px solid rgba(109,125,112,.52)!important;background:rgba(238,232,214,.92)!important;clip-path:none!important;border-radius:50%!important;width:54px!important;height:54px!important;box-shadow:0 3px 9px rgba(46,55,48,.2)!important}
.asc-node.v32-extra.ready{outline:2px solid rgba(168,135,69,.55);outline-offset:2px}
.asc-node.v32-extra.done{background:#cfe0d3!important;border-color:#527a6d!important}
.asc-node.v32-extra .glyph{font-size:21px!important}
#v1132Dev{position:fixed;z-index:9999;inset:0;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(24,31,28,.34);backdrop-filter:blur(4px)}
#v1132Dev.open{display:flex}
#v1132Dev .box{width:min(360px,94vw);padding:15px;border:1px solid #52645b80;border-radius:14px;background:#eee7d7 url("assets/paper_fiber.svg");box-shadow:0 18px 60px #1f241f55;color:#22322d}
#v1132Dev h3{margin:0 0 4px;font-size:16px}#v1132Dev p{margin:0 0 10px;font-size:10px;color:#64716c}
#v1132Dev .grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}#v1132Dev button{min-height:40px;border:1px solid #65766d77;border-radius:9px;background:#e2dac7;color:#23332e;font-weight:700}#v1132Dev .danger{color:#8e3e37;border-color:#8e3e3766}#v1132Dev .close{grid-column:1/-1;margin-top:4px}
`;document.head.appendChild(s)}
function iconFor(id){if(/_(atk|edge)/.test(id))return'⚔';if(/_(hp|guard)/.test(id))return'♥';if(/_(mov|shadow)/.test(id))return'➤';if(/_(sen|spirit)/.test(id))return'◉';if(/harmony/.test(id))return'✦';if(/core/.test(id))return'◆';return'•'}
function replaceGlyphs(){document.querySelectorAll('#ascWorld .asc-leaf:not(.v32-extra)').forEach(n=>{const g=n.querySelector('.glyph');if(g)g.textContent=iconFor(n.dataset.nodeId||'')})}
function costText(c){const a=[];if(c.s)a.push(`◆ ${c.s}`);if(c.h)a.push(`${c.hg===0?'🌿':c.hg===1?'🍃':'✧'} ${c.h}`);return a.join(' · ')}
function canBuy(M,e){if(snap().phase==='run')return[false,'원정 중'];if(M.trainingExtras?.[e.id])return[false,'수련 완료'];if(!reached(M,e.req))return[false,`연기 ${e.req.stage}층 필요`];if((+M.stone||0)<e.cost.s||(+M[herbKey(e.cost.hg)]||0)<e.cost.h)return[false,'재료 부족'];return[true,'수련 가능']}
function showExtra(e){const b=$('#ascDetail');if(!b)return;const M=ensure(snap().M),done=!!M.trainingExtras[e.id],[ok,why]=canBuy(M,e);b.innerHTML=`<div class="node-kicker">특화 수련 · ${e.name}</div><div class="node-effect">${e.icon} ${e.desc}</div><div class="node-expect">${done?'이미 습득함':why}</div><div class="cost-row"><span class="cost-chip stone">${done?'✓ 완료':costText(e.cost)}</span></div>`;const x=document.createElement('button');x.className=`detail-action ${ok?'ready':''}`;x.disabled=!ok;x.textContent=done?'완료':ok?'특화 수련':'조건 미충족';x.onclick=()=>buy(e.id);b.appendChild(x)}
function buy(id){const e=EXTRA.find(x=>x.id===id);if(!e)return;const M=ensure(snap().M),[ok]=canBuy(M,e);if(!ok)return;M.stone-=e.cost.s;M[herbKey(e.cost.hg)]-=e.cost.h;e.apply(M);M.trainingExtras[e.id]=1;commit(M);showExtra(e)}
let rendering=false;
function decorateTree(force=false){if(rendering)return;const w=$('#ascWorld'),svg=w?.querySelector('svg');if(!w||!svg)return;replaceGlyphs();if(!force&&w.querySelector('.v32-extra'))return;rendering=true;w.querySelectorAll('[data-v32-extra]').forEach(n=>n.remove());const M=ensure(snap().M);for(const e of EXTRA){const p=POS[e.id],done=!!M.trainingExtras[e.id],[ok]=canBuy(M,e);const path=document.createElementNS('http://www.w3.org/2000/svg','path');const mx=(p.fromY+p.y)/2;path.setAttribute('d',`M 600 ${p.fromY} C 600 ${mx}, ${p.x} ${mx}, ${p.x} ${p.y}`);path.setAttribute('class',`asc-line branch ${done?'on':''}`);path.dataset.v32Extra='1';svg.appendChild(path);const b=document.createElement('button');b.className=`asc-node asc-leaf v32-extra ${done?'done':ok?'ready':'locked'}`;b.dataset.nodeId=e.id;b.dataset.v32Extra='1';b.style.left=p.x+'px';b.style.top=p.y+'px';b.innerHTML=`<span class="glyph">${e.icon}</span><span class="mark">${done?'✓':ok?'＋':'·'}</span>`;b.onclick=ev=>{ev.stopPropagation();showExtra(e)};w.appendChild(b)}rendering=false}
function bindTreeRefresh(){document.addEventListener('xianxia:progression-rendered',()=>requestAnimationFrame(()=>decorateTree(true)));decorateTree(true)}
function makeGatherLayer(){const game=$('#game'),base=$('#cv');if(!game||!base)return null;let c=$('#v1132GatherLayer');if(!c){c=document.createElement('canvas');c.id='v1132GatherLayer';c.width=1800;c.height=2400;const ink=$('#v1131InkLayer');if(ink)ink.insertAdjacentElement('afterend',c);else base.insertAdjacentElement('afterend',c)}return c}
function drawGatherRings(){const c=makeGatherLayer();if(!c)return;const x=c.getContext('2d'),s=snap();x.clearRect(0,0,1800,2400);if(s.phase==='run')for(const o of s.objects||[]){if(o.type!=='h')continue;const g=Math.max(0,Math.min(2,o.grade||0)),r=[16,18,20][g],pulse=1+Math.sin(performance.now()*.003+o.x*.04+o.y*.03)*.04;x.save();x.globalAlpha=[.65,.72,.82][g];x.strokeStyle=['#4e8068','#4f7899','#8a609f'][g];x.lineWidth=[1.6,1.9,2.2][g];x.beginPath();x.ellipse(o.x,o.y+17,r*pulse,r*.42*pulse,0,0,Math.PI*2);x.stroke();x.globalAlpha=[.10,.13,.17][g];x.fillStyle=x.strokeStyle;x.fill();x.restore()}requestAnimationFrame(drawGatherRings)}
function boot(){installCss();bindTreeRefresh();requestAnimationFrame(drawGatherRings);window.__xianxiaProgressionExtras={version:'11.32.2',decorateTree,buy}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

//# sourceURL=progression_extras_runtime_v11_45.js
