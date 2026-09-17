(()=>{
'use strict';
const VERSION='11.36.0';
function load(path){const x=new XMLHttpRequest();x.open('GET',path+'?v='+encodeURIComponent(VERSION),false);x.send(null);if(!((x.status>=200&&x.status<300)||x.status===0))throw new Error(path+' load failed: '+x.status);return x.responseText}
try{
 let src=load('systems_v11_21.js');
 const re=/function breakthroughCost\(i\)\{[\s\S]*?\n\}/;
 if(!re.test(src))throw new Error('systems21 breakthrough marker missing');
 src=src.replace(re,`function breakthroughCost(i){
  const t=[{s:0,h:8,hg:0},{s:80,h:10,hg:0},{s:180,h:14,hg:0},{s:300,h:10,hg:1},{s:450,h:14,hg:1},{s:800,h:18,hg:1},{s:1300,h:15,hg:2},{s:1800,h:20,hg:2},{s:2600,h:28,hg:2},{s:4500,h:40,hg:2,major:true}];
  return t[i]||t[t.length-1];
}`);
 (0,eval)(src+'\n//# sourceURL=systems_v11_21.balance.js');
}catch(error){console.error(error);const e=document.querySelector('#buildVersion');if(e)e.textContent='BUILD '+VERSION+' · UX BAL ERR'}
})();