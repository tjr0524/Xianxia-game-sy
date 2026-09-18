/* GENERATED FLAT RUNTIME 11.45 · source chain: progression_extras_v11_32 -> balance_progression_extras_v11_36 */
(()=>{
'use strict';
if(window.__xianxiaProgressionExtras?.version==='11.32.2')return;
const D=window.__xianxiaDebug;if(!D)return;
const SAVE_KEY='xianxia_proto_v11';
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
.asc-leaf .glyph{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI Symbol","Apple Color Emoji",sans-serif!important;font-size:18px!important;font-weight:700!important;line-height:1!important}
.asc-node.v32-extra{background-image:none!important;border:1px solid rgba(109,125,112,.52)!important;background:rgba(238,232,214,.92)!important;clip-path:none!important;border-radius:50%!important;width:54px!important;height:54px!important;box-shadow:0 3px 9px rgba(46,55,48,.2)!important}
.asc-node.v32-extra.ready{outline:2px solid rgba(168,135,69,.55);outline-offset:2px}
.asc-node.v32-extra.done{background:#cfe0d3!important;border-color:#527a6d!important}
.asc-node.v32-extra .glyph{font-size:21px!important}
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
function boot(){installCss();bindTreeRefresh();document.querySelector('#v1132GatherLayer')?.remove();window.__xianxiaProgressionExtras={version:'11.32.2',decorateTree,buy,gatherRingsOwner:'ink-render'}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

//# sourceURL=progression_extras_runtime_v11_45.js
