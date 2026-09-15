(()=>{
fetch('loader.js',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('loader.js: '+r.status);return r.text()}).then(t=>{
  t=t.replace("function rep(s,a,b,n){if(!s.includes(a))throw new Error('v8 patch miss: '+n);return s.replace(a,b)}","function rep(s,a,b,n){if(!s.includes(a)){console.warn('v8 patch skip:',n);return s}return s.replace(a,b)}");
  const marker='\n(0,eval)(s)\n';
  const extra=String.raw`
function post(a,b,n){if(!s.includes(a)){console.warn('v9 patch skip:',n);return}s=s.replace(a,b)}
post("function envPenalty(){return [{move:1,pick:1},{move:.90,pick:.82},{move:.80,pick:.68}][areaIndex()]||{move:.76,pick:.62}}","function envPenalty(){return [{move:1,pick:1},{move:.72,pick:.60},{move:.52,pick:.38}][areaIndex()]||{move:.46,pick:.32}}","harder environments");
post("110+(M.cult.mov-1)*17","110+(M.cult.mov-1)*32","steeper move growth");
post("22+(M.cult.sen-1)*8+(R.buffs.gather?8:0)","22+(M.cult.sen-1)*16+(R.buffs.gather?10:0)","steeper sense growth run");
post("22+(M.cult.sen-1)*8)*envPenalty().pick","22+(M.cult.sen-1)*16)*envPenalty().pick","steeper sense growth draw");
post("90+(M.cult.hp-1)*25","90+(M.cult.hp-1)*38","steeper hp growth");
post("3.6+(M.cult.atk-1)*2.35","3.6+(M.cult.atk-1)*4.4","steeper basic attack");
post("let rad=190,dmg=(6.8+(M.cult.atk-1)*2.7)","let rad=220,dmg=(16+(M.cult.atk-1)*8.5)","wave power");
post("scd=3.8;burst=.24;burstR=rad","scd=3.2;burst=.24;burstR=rad","wave cooldown");
post("let dmg=(13+(M.cult.atk-1)*5.1)","let dmg=(20+(M.cult.atk-1)*9)","sword power");
post("if(P.hp<=0){P.hp=0;return end('dead')}","if(!isMortal()&&scd<=0){let ar=M.skill==='wave'?220:150;if(E.some(a=>host(a)&&D(P,a)<ar))u.skill.click()}if(P.hp<=0){P.hp=0;return end('dead')}","auto active skill");
post("u.skill.textContent=isMortal()?'⚔ 입문 후 사용':scd>0?`⚔ ${sk} ${scd.toFixed(1)}`:`⚔ ${sk}`","u.skill.textContent=isMortal()?'⚔ 입문 후 자동 사용':scd>0?`⚔ AUTO ${sk} ${scd.toFixed(1)}`:`⚔ AUTO ${sk}`","auto skill label");
if(!document.getElementById('hpBarV9')){
  const hp=document.getElementById('hp');
  if(hp){
    const style=document.createElement('style');
    style.textContent='.hpv9{height:15px;border:1px solid #46505e;border-radius:99px;background:#0d1015;overflow:hidden;margin:5px 5px 3px;position:relative}.hpv9>i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#8e3030,#d85a4e);transition:width .12s linear}.hpv9.low>i{background:linear-gradient(90deg,#7d2424,#b93535)}#hp{font-size:11px;color:#aeb5c0;font-weight:600}';
    document.head.appendChild(style);
    const bar=document.createElement('div');bar.id='hpBarV9';bar.className='hpv9';bar.innerHTML='<i></i>';
    hp.parentNode.insertBefore(bar,hp);
    const fill=bar.querySelector('i');
    const sync=()=>{let m=(hp.textContent||'').match(/([0-9.]+)\s*\/\s*([0-9.]+)/);if(!m)return;let p=Math.max(0,Math.min(1,Number(m[1])/Math.max(1,Number(m[2]))));fill.style.width=(p*100)+'%';bar.classList.toggle('low',p<.3)};
    new MutationObserver(sync).observe(hp,{childList:true,subtree:true,characterData:true});sync();
  }
}
`;
  if(!t.includes(marker))throw new Error('v9 loader injection marker missing');
  t=t.replace(marker,'\n'+extra+'\n(0,eval)(s)\n');
  (0,eval)(t);
}).catch(e=>{console.error(e);document.body.insertAdjacentHTML('beforeend','<pre style="position:fixed;inset:8px;z-index:9999;background:#200;color:#fcc;padding:12px;overflow:auto">게임 로드 실패: '+String(e)+'</pre>')});
})();