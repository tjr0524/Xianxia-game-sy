(()=>{
'use strict';
const VERSION='11.36.0';
function load(path){const x=new XMLHttpRequest();x.open('GET',path+'?v='+encodeURIComponent(VERSION),false);x.send(null);if(!((x.status>=200&&x.status<300)||x.status===0))throw new Error(path+' load failed: '+x.status);return x.responseText}
function must(src,re,to,label){if(!re.test(src))throw new Error('balance ui patch missing: '+label);return src.replace(re,to)}
try{
let src=load('ui_v11_17.js');
src=must(src,/cap=\(m,s\)=>[^;]+;cost=\(s,k,n\)=>\{[^;]+;return\{[^}]+\}\};/,`cap=(m,s)=>{if(!reached(m,s.req))return 0;if(s.id==='array')return 1;if(s.id==='thunder'&&(m.realm?.major??-1)>0)return 5;if((m.realm?.major??-1)>s.req.major)return 5;return Math.max(1,Math.min(5,(m.realm?.stage||0)-s.req.stage+1))};const SKILL_COST={sword:[null,{s:80,h:3,hg:0},{s:70,h:4,hg:0},{s:90,h:5,hg:0},{s:110,h:6,hg:0},{s:130,h:8,hg:0}],wave:[null,{s:150,h:5,hg:0},{s:180,h:7,hg:0},{s:210,h:9,hg:0},{s:240,h:12,hg:0},{s:280,h:15,hg:0}],chain:[null,{s:180,h:5,hg:1},{s:220,h:7,hg:1},{s:260,h:9,hg:1},{s:320,h:12,hg:1},{s:380,h:15,hg:1}],thunder:[null,{s:400,h:4,hg:2},{s:500,h:5,hg:2},{s:650,h:7,hg:2},{s:800,h:10,hg:2},{s:950,h:15,hg:2}],array:[null,{s:1200,h:12,hg:2}]};cost=(s,k,n)=>SKILL_COST[s.id]?.[n]||{s:999999,h:999,hg:s.grade};`, 'skill caps and costs');
src=must(src,/const ps=ups\(p\),keys=\['pow','range','cycle'\],nm=\['위력',s\.id==='chain'\?'타수':'범위','순환'\];/,`const ps=[ups(p)[1]],keys=['pow'],nm=['숙련'];`, 'single rank node');
src=must(src,/m\.skills\[id\]\|\|=\{u:0,pow:0,range:0,cycle:0\};m\.skills\[id\]\.u=1;/,`m.skills[id]||={u:0,pow:0,range:0,cycle:0};m.skills[id]={u:1,pow:1,range:0,cycle:0};`, 'unlock rank one');
src=must(src,/function skillEffect\(s,k\)\{[^\n]*\}/,`function skillEffect(s,k){return s.n+'의 숙련 Rank가 올라 피해량·유효 범위·발동 주기가 함께 성장한다.'}`, 'rank description');
src=must(src,/n=\{pow:'위력',range:s\.id==='chain'\?'연쇄 타수':'범위',cycle:'순환'\}\[sel\.k\];/,`n='숙련';`, 'rank detail label');
(0,eval)(src+'\n//# sourceURL=ui_v11_17.balance.js');
window.__xianxiaUiBalanceVersion=VERSION;
}catch(error){console.error(error);const e=document.querySelector('#buildVersion');if(e)e.textContent='BUILD '+VERSION+' · UI BAL ERR'}
})();