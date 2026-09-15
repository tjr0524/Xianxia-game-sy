(()=>{
'use strict';
const game=document.querySelector('.game'),time=document.getElementById('time'),ov=document.getElementById('ov');
if(!game||!time||!ov)return;
const style=document.createElement('style');
style.textContent=`
#unstableTint{position:absolute;inset:0;z-index:4;pointer-events:none;display:none;background:rgba(145,25,18,.08);box-shadow:inset 0 0 70px rgba(190,30,20,.25);animation:unstablePulse .85s ease-in-out infinite alternate}
#unstableTint.show{display:block}
#unstableTint .unstableText{position:absolute;left:12px;top:10px;font-size:13px;font-weight:800;color:#ff9a8d;text-shadow:0 1px 4px #000}
@keyframes unstablePulse{from{background:rgba(145,25,18,.055)}to{background:rgba(170,28,18,.14)}}`;
document.head.appendChild(style);
const tint=document.createElement('div');tint.id='unstableTint';tint.innerHTML='<div class="unstableText">비경 불안정</div>';game.appendChild(tint);
function sync(){const m=(time.textContent||'').match(/[0-9.]+/),rem=m?Number(m[0]):25,running=ov.classList.contains('hide');const on=running&&rem<=10&&rem>0;tint.classList.toggle('show',on);time.style.color=on?(rem<=5?'#ff6b5e':'#e6a06f'):'';if(on){const q=Math.max(0,Math.min(1,(10-rem)/10));tint.style.opacity=String(.72+q*.28)}else tint.style.opacity='';}
new MutationObserver(sync).observe(time,{childList:true,subtree:true,characterData:true});
new MutationObserver(sync).observe(ov,{attributes:true,attributeFilter:['class']});
sync();
})();