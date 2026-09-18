(()=>{
'use strict';

const VERSION='11.49.17-tutorial';
if(window.__xianxiaFirstRunTutorial?.version===VERSION)return;

const D=window.__xianxiaDebug;
if(!D)return;

const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const META_KEY='xianxia_tutorial_guided_v2';
const GUIDE_DONE_KEY='blackwind-first-entry';

let lastKey='';
let closedKey='';
let lastRunStartedAt=0;
let runStartPos=null;
let lastSnap=null;

function readMeta(){
  try{return JSON.parse(localStorage.getItem(META_KEY)||'{}')||{}}
  catch{return {}}
}
let meta=readMeta();

function saveMeta(){
  try{localStorage.setItem(META_KEY,JSON.stringify(meta))}catch{}
}

function freshSave(M){
  if(!M)return false;
  const mortal=(M.realm?.major??-1)<0;
  const noRuns=(+M.stats?.totalRuns||0)===0;
  const noSafe=(+M.stats?.totalSafe||0)===0;
  const noTraining=Object.keys(M.trainingNodes||{}).every(k=>!M.trainingNodes[k]);
  const noSkills=!M.skillUnlocks?.sword;
  const noClaims=Object.keys(M.daohang?.claimed||{}).length===0;
  return mortal&&noRuns&&noSafe&&noTraining&&noSkills&&noClaims;
}

function reconcileMetaWithSave(M){
  // test / tutorial-preview share one GitHub Pages origin, so localStorage is shared
  // across both paths. A game reset can therefore leave tutorial-only metadata stale.
  if(!freshSave(M))return;
  if(Object.keys(meta).length===0)return;
  meta={};
  lastKey='';
  closedKey='';
  lastRunStartedAt=0;
  runStartPos=null;
  saveMeta();
}

function snap(){
  try{return D.snapshot()}catch{return null}
}

function isVisible(el){
  if(!el)return false;
  const r=el.getBoundingClientRect();
  const s=getComputedStyle(el);
  return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;
}

function lowerHerbs(s){
  return Math.max(0,+s?.M?.herb||0)+Math.max(0,+s?.run?.h0||0);
}

function runHerbs(s){
  return Math.max(0,+s?.run?.h0||0);
}

function runKills(s){
  return Math.max(0,+s?.run?.beastKills||0);
}

function trainingCount(M,prefix){
  return Object.keys(M?.trainingNodes||{}).filter(k=>k.indexOf(prefix)===0&&M.trainingNodes[k]).length;
}

function rank(M,area,id){
  return Math.max(0,Math.min(5,+M?.zones?.[area]?.tree?.[id]||0));
}

function swordInfo(){
  const list=D.constants?.SKILLS||[];
  return list.find(x=>x.id==='sword')||{id:'sword',n:'어검술',grade:0,unlock:{s:80,h:3}};
}

function swordAffordable(M){
  const s=swordInfo();
  const hk=s.grade===0?'herb':s.grade===1?'herb2':'herb3';
  return (+M?.stone||0)>=(+s.unlock?.s||80)&&(+M?.[hk]||0)>=(+s.unlock?.h||3);
}

function resultOpen(){
  const ov=$('#ov'),title=$('#ot');
  return !!ov&&!ov.classList.contains('hide')&&/무사 귀환|육신 중상|비경 붕괴/.test(title?.textContent||'');
}

function activePanel(name){
  return !!$('.tab-btn[data-tab="'+name+'"].active')||!!$('[data-panel="'+name+'"].active');
}

function findText(root,selector,text){
  if(!root)return null;
  return Array.from(root.querySelectorAll(selector)).find(el=>(el.textContent||'').indexOf(text)>=0)||null;
}

function journalClaimTarget(name){
  const rows=$$('#v19Journal .v19-ach');
  const row=rows.find(r=>(r.textContent||'').indexOf(name)>=0);
  return row?.querySelector('button:not(:disabled)')||row||null;
}

function swordTarget(){
  const panel=$('[data-panel="skills"]');
  if(!panel)return null;
  const action=Array.from(panel.querySelectorAll('button')).find(b=>/전승|해금|습득/.test(b.textContent||'')&&!b.disabled);
  if(action)return action;
  const exact=Array.from(panel.querySelectorAll('button,[role="button"],.skill-node,.skill-card,.skill17-node,.node')).find(el=>(el.textContent||'').indexOf('어검술')>=0);
  return exact||findText(panel,'div,section,article','어검술')||panel;
}

function trainReadyTarget(prefix){
  return $('#ascWorld .asc-leaf.ready[data-node-id^="'+prefix+'"]')||
         $('#ascWorld .asc-leaf[data-node-id^="'+prefix+'"]')||
         $('#ascDetail .detail-action.ready')||
         $('#ascViewport');
}

function mapAffinityTarget(id){
  return $('#mapWorld .map-point[data-affinity="'+id+'"]')||$('#mapViewport');
}

function mapGateTarget(area){
  return $('#mapWorld .map-gate[data-area="'+area+'"]')||$('#mapViewport');
}

function areaPickerTarget(name){
  const picker=$('#expeditionAreaPicker');
  if(!picker)return $('#area');
  return Array.from(picker.querySelectorAll('button')).find(b=>(b.textContent||'').indexOf(name)>=0)||picker;
}

function tabTarget(name){
  return $('.tab-btn[data-tab="'+name+'"]');
}

function ensureStyle(){
  if($('#v1150TutorialStyle'))return;
  const style=document.createElement('style');
  style.id='v1150TutorialStyle';
  style.textContent=
    '#v1150Tutorial{position:fixed;z-index:140;left:50%;top:max(10px,env(safe-area-inset-top));transform:translateX(-50%);width:min(360px,calc(100% - 20px));padding:10px 34px 10px 11px;border:1px solid rgba(157,125,55,.72);border-radius:12px 5px 12px 5px;background:rgba(249,244,228,.97);color:#2d423a;box-shadow:0 10px 28px rgba(30,42,36,.27);backdrop-filter:blur(5px);font-size:10px;line-height:1.45;text-align:left}'+
    '#v1150Tutorial.hide{display:none}#v1150Tutorial .t-kicker{font-size:8px;color:#7b6c44;margin-bottom:2px;font-weight:800;letter-spacing:.04em}#v1150Tutorial b{display:block;font:800 12px/1.3 serif;color:#263b34;margin-bottom:3px}#v1150Tutorial .t-body{display:block}#v1150Tutorial .t-progress{margin-top:5px;color:#6d796f;font-size:9px}#v1150Tutorial .t-goals{display:grid;gap:3px;margin-top:5px}#v1150Tutorial .t-goal{display:flex;justify-content:space-between;gap:8px;padding:3px 5px;border:1px solid #cfc6a6;border-radius:6px;background:#fffaf0}#v1150Tutorial .t-goal.done{opacity:.6;text-decoration:line-through}'+
    '#v1150TutorialClose{position:absolute;right:5px;top:5px;width:25px;height:25px;border:0;border-radius:50%;background:transparent;color:#70684e;font-size:18px;line-height:1}#v1150TutorialMini{position:fixed;z-index:139;right:max(8px,env(safe-area-inset-right));top:max(10px,env(safe-area-inset-top));display:none;min-height:30px;padding:5px 10px;border:1px solid #a58a4d;border-radius:999px;background:#f7efda;color:#354940;box-shadow:0 5px 16px #283a3030;font-size:9px;font-weight:800}#v1150TutorialMini.show{display:block}'+
    '.v1150-focus{outline:3px solid #f3cf62!important;outline-offset:3px!important;box-shadow:0 0 0 2px rgba(255,245,182,.85),0 0 24px rgba(229,180,55,.82)!important;animation:v1150Pulse .75s ease-in-out infinite alternate!important} @keyframes v1150Pulse{to{outline-color:#fff4af;box-shadow:0 0 0 4px rgba(255,246,183,.88),0 0 36px rgba(229,180,55,.95)!important}}'+
    'body.v1150-guiding #v19Coach{display:none!important}body.v1150-guiding #v1149Tutorial{display:none!important}'+
    '@media(max-width:560px){#v1150Tutorial{top:max(7px,env(safe-area-inset-top));width:min(330px,calc(100% - 14px));padding:8px 32px 8px 9px;font-size:9.5px}#v1150Tutorial b{font-size:11px}body.v22-combat-mode #v1150Tutorial{top:max(6px,env(safe-area-inset-top));width:min(320px,calc(100% - 12px));background:rgba(249,244,228,.94)}}';
  document.head.appendChild(style);
}

function ensureUi(){
  ensureStyle();
  let box=$('#v1150Tutorial');
  if(!box){
    box=document.createElement('div');
    box.id='v1150Tutorial';
    box.setAttribute('role','status');
    box.setAttribute('aria-live','polite');
    box.innerHTML='<div class="t-kicker"></div><b></b><span class="t-body"></span><div class="t-progress"></div><div class="t-goals"></div><button id="v1150TutorialClose" aria-label="튜토리얼 안내 닫기">×</button>';
    document.body.appendChild(box);
    box.querySelector('#v1150TutorialClose').addEventListener('click',()=>{
      closedKey=lastKey;
      box.classList.add('hide');
      $('#v1150TutorialMini')?.classList.add('show');
    });
  }
  let mini=$('#v1150TutorialMini');
  if(!mini){
    mini=document.createElement('button');
    mini.id='v1150TutorialMini';
    mini.textContent='길잡이';
    mini.addEventListener('click',()=>{
      closedKey='';
      box.classList.remove('hide');
      mini.classList.remove('show');
    });
    document.body.appendChild(mini);
  }
  return box;
}

function clearFocus(){
  $$('.v1150-focus').forEach(el=>el.classList.remove('v1150-focus'));
}

function focusTargets(targets,key){
  clearFocus();
  const list=(Array.isArray(targets)?targets:[targets]).filter(Boolean);
  list.forEach(el=>el.classList.add('v1150-focus'));
  if(key!==lastKey){
    const first=list.find(isVisible);
    if(first&&lastSnap?.phase!=='run'){
      try{first.scrollIntoView({block:'center',inline:'center',behavior:'smooth'})}catch{}
    }
  }
}

function renderGuide(g,s){
  const box=ensureUi();
  document.body.classList.add('v1150-guiding');
  if(!g){
    clearFocus();
    box.classList.add('hide');
    $('#v1150TutorialMini')?.classList.remove('show');
    document.body.classList.remove('v1150-guiding');
    return;
  }

  const key=g.key;
  const keyChanged=key!==lastKey;
  lastSnap=s;
  focusTargets(g.targets||[],key);
  lastKey=key;

  box.querySelector('.t-kicker').textContent=g.kicker||'초행 길잡이';
  box.querySelector('b').textContent=g.title||'다음 목표';
  box.querySelector('.t-body').innerHTML=g.body||'';
  box.querySelector('.t-progress').innerHTML=g.progress||'';
  const goals=box.querySelector('.t-goals');
  goals.innerHTML='';
  (g.goals||[]).forEach(x=>{
    const row=document.createElement('div');
    row.className='t-goal'+(x.done?' done':'');
    row.innerHTML='<span>'+x.label+'</span><strong>'+x.value+'</strong>';
    goals.appendChild(row);
  });

  if(keyChanged&&closedKey!==key){
    box.classList.remove('hide');
    $('#v1150TutorialMini')?.classList.remove('show');
  }else if(closedKey===key){
    box.classList.add('hide');
    $('#v1150TutorialMini')?.classList.add('show');
  }
}

function introTargets(){
  return [$('#start')];
}

function runMovementObserved(s){
  const p=s?.P;
  if(!p)return !!meta.moved;
  if(!runStartPos)runStartPos={x:+p.x||0,y:+p.y||0};
  const d=Math.hypot((+p.x||0)-runStartPos.x,(+p.y||0)-runStartPos.y);
  if(d>45){
    meta.moved=1;
    saveMeta();
  }
  return !!meta.moved;
}

function markSwordRunSeen(s){
  if(meta.swordRunSeen)return;
  if(s?.phase!=='run'||!s?.M?.skillUnlocks?.sword)return;
  if(!lastRunStartedAt)lastRunStartedAt=Date.now();
  const hud=$('#skillRun');
  if((hud?.textContent||'').indexOf('어검술')>=0||Date.now()-lastRunStartedAt>1600){
    meta.swordRunSeen=1;
    saveMeta();
  }
}

function maybeGraduate(s){
  if(meta[GUIDE_DONE_KEY])return true;
  if(s?.phase==='run'&&s?.M?.area==='blackwind'){
    meta[GUIDE_DONE_KEY]=1;
    saveMeta();
    return true;
  }
  return false;
}

function markFeatureTutorialProgress(s){
  if(!s)return;
  if((+s.run?.mined||0)>0&&!meta.veinTutorialDone){
    meta.veinTutorialDone=1;
    if(closedKey==='feature-vein')closedKey='';
    saveMeta();
  }
  if(lastSnap?.phase==='run'&&s.phase==='run'&&!meta.spiritTutorialDone){
    const before=(lastSnap.enemies||[]).filter(e=>e.type==='spirit').length;
    const now=(s.enemies||[]).filter(e=>e.type==='spirit').length;
    if(before>now){
      meta.spiritTutorialDone=1;
      if(closedKey==='feature-spirit')closedKey='';
      saveMeta();
    }
  }
}

function featureGuide(s){
  if(s?.phase!=='run')return null;

  if(!meta.spiritTutorialDone){
    const spirit=(s.enemies||[]).find(e=>e.type==='spirit');
    if(spirit){
      const pct=Math.max(0,Math.min(100,Math.round((+spirit.bond||0)/1.3*100)));
      return {
        key:'feature-spirit',
        kicker:'기능 튜토리얼 · 영수',
        title:'영수는 쓰러뜨리는 적이 아니라 포획 대상입니다',
        body:'영수 가까이 붙어 <strong>포획 게이지를 100%</strong>까지 채우세요. 일정 거리 밖으로 벗어나면 게이지가 천천히 줄고, 영수는 계속 달아나므로 따라붙어 거리를 유지해야 합니다.',
        progress:'포획 진행도 '+pct+'% · 성공하면 해당 비경 등급 영초를 획득',
        targets:[$('#game')]
      };
    }
  }

  if(!meta.veinTutorialDone&&s.vein){
    const pct=Math.max(0,Math.min(100,Math.round((+s.vein.progress||0)/3*100)));
    return {
      key:'feature-vein',
      kicker:'기능 튜토리얼 · 영맥',
      title:'영맥 가까이에 머물러 자동 채굴하세요',
      body:'영맥에 가까이 접근하면 채굴이 자동으로 진행됩니다. <strong>총 3초</strong> 동안 범위 안에 머물면 완료되며, 잠시 벗어나도 이미 채운 진행도는 유지됩니다.',
      progress:'채굴 진행도 '+pct+'% · 매장 영석 '+Math.max(0,+s.vein.stock||0),
      targets:[$('#game')]
    };
  }

  return null;
}

function mandatoryGuide(s){
  const M=s.M||{};
  const mortal=(M.realm?.major??-1)<0;
  const claims=M.daohang?.claimed||{};
  const low=lowerHerbs(s);
  const start=$('#start');
  const ret=$('#ret');

  if(mortal){
    if(s.phase==='run'){
      const moved=runMovementObserved(s);
      if(!moved){
        return {
          key:'mandatory-move',
          kicker:'필수 튜토리얼 · 2/11',
          title:'먼저 이동해 보세요',
          body:'화면을 탭·드래그하거나 WASD로 귀환진에서 벗어나세요. <strong>범인일 때는 요수와 싸울 수 없습니다.</strong>',
          progress:'이동을 익힌 뒤 하급 영초를 모읍니다.',
          targets:[$('#game')]
        };
      }
      if(low<8){
        return {
          key:'mandatory-gather',
          kicker:'필수 튜토리얼 · 3/11',
          title:'하급 영초 8개를 모으세요',
          body:'요수를 피해서 영초 가까이 이동하면 자동으로 채집됩니다. 영초를 모아 <strong>수선에 입문하고 연기 1층</strong>에 오르는 것이 첫 목표입니다.',
          progress:'하급 영초 '+low+'/8 · 기존 보유량 + 이번 원정 채집량 기준',
          targets:[$('#game')]
        };
      }
      return {
        key:'mandatory-return',
        kicker:'필수 튜토리얼 · 4/11',
        title:'이제 살아서 귀환하세요',
        body:'필요한 영초를 모았습니다. <strong>출구로 복귀</strong>를 눌러 실제 귀환진까지 이동하세요. 안정도가 끝나기 전에 돌아오지 못하면 전리품 일부만 회수합니다.',
        progress:'하급 영초 '+low+'/8',
        targets:[ret]
      };
    }

    if(resultOpen()){
      return {
        key:'mandatory-result',
        kicker:'필수 튜토리얼 · 5/11',
        title:'원정 결과를 확인하세요',
        body:'귀환 결과와 획득 전리품을 확인한 뒤 <strong>돌아가기</strong>를 눌러 준비 화면으로 복귀하세요.',
        targets:[start]
      };
    }

    if((+M.herb||0)<8){
      const first=(+M.stats?.totalRuns||0)===0;
      return {
        key:first?'mandatory-enter':'mandatory-retry',
        kicker:first?'필수 튜토리얼 · 1/11':'필수 튜토리얼 · 영초 보충',
        title:first?'첫 비경에 입장하세요':'영초가 아직 부족합니다',
        body:first
          ? '<strong>입장</strong> 버튼을 눌러 청운산 후산으로 들어가세요. 범인은 요수와 싸울 수 없으니 전투하지 말고 영초를 모아야 합니다.'
          : '실패해도 튜토리얼은 끝나지 않습니다. 현재 가진 하급 영초를 유지한 채 다시 입장해 8개를 채우세요.',
        progress:'하급 영초 '+(+M.herb||0)+'/8',
        targets:introTargets()
      };
    }

    if(!claims.first_run||!claims.first_safe){
      if(!$('.v19-ach-tab.active')){
        return {
          key:'mandatory-journal-tab',
          kicker:'필수 튜토리얼 · 6/11',
          title:'도행록 보상을 받으세요',
          body:'첫 원정의 행적이 도행록에 기록되었습니다. <strong>초입의 발자취</strong>와 <strong>생환지인</strong> 보상을 수령하면 다음 단계 재화가 맞춰집니다.',
          progress:'예상 보상 · 영석 50 + 하급 영초 2',
          targets:[$('.v19-ach-tab')]
        };
      }
      const targets=[];
      if(!claims.first_run)targets.push(journalClaimTarget('초입의 발자취'));
      if(!claims.first_safe)targets.push(journalClaimTarget('생환지인'));
      return {
        key:'mandatory-journal-claim',
        kicker:'필수 튜토리얼 · 6/11',
        title:'달성한 두 보상을 수령하세요',
        body:'노란색으로 활성화된 <strong>보상 수령</strong> 버튼을 누르세요. 둘 다 받으면 수선 입문으로 이어집니다.',
        targets:targets
      };
    }

    if(!activePanel('train')){
      return {
        key:'mandatory-cultivation-tab',
        kicker:'필수 튜토리얼 · 7/11',
        title:'수련 도맥을 여세요',
        body:'하급 영초 8개가 준비되었습니다. <strong>수련</strong> 탭에서 凡·범인 노드를 눌러 수선에 입문하세요.',
        progress:'수선 입문 비용 · 하급 영초 8',
        targets:[tabTarget('train')]
      };
    }

    const root=$('[data-node-id="root"]');
    const action=$('#ascDetail .detail-action.ready');
    return {
      key:'mandatory-cultivation-root',
      kicker:'필수 튜토리얼 · 7/11',
      title:'凡·범인 노드에서 수선 입문',
      body:'범인 노드를 선택한 뒤 <strong>수선 입문</strong>을 누르면 연기 1층에 진입합니다.',
      progress:'하급 영초 '+(+M.herb||0)+'/8',
      targets:[action||root]
    };
  }

  if(!M.skillUnlocks?.sword){
    if(!meta.postCultHuntComplete){
      if(s.phase==='run'){
        const k=runKills(s),h=runHerbs(s);
        if(k>=3&&h>=1){
          meta.postCultHuntComplete=1;
          saveMeta();
          return {
            key:'mandatory-hunt-return',
            kicker:'필수 튜토리얼 · 8/11',
            title:'첫 토벌 완료 · 귀환하세요',
            body:'요수 토벌과 영초 채집 조건을 채웠습니다. 전리품을 들고 귀환진으로 돌아가세요.',
            progress:'요수 '+k+'/3 · 영초 '+h+'/1',
            targets:[ret]
          };
        }
        return {
          key:'mandatory-hunt-run',
          kicker:'필수 튜토리얼 · 8/11',
          title:'요수를 잡아 영석을 모으세요',
          body:'수선에 입문해 연기경에 오르면 이제 요수와 싸울 수 있습니다. <strong>기본 검격은 자동 공격</strong>이므로 가까이 접근해 요수 3마리를 처치하고 영초 1개도 챙기세요.',
          progress:'요수 '+k+'/3 · 영초 '+h+'/1',
          targets:[$('#game')]
        };
      }
      return {
        key:'mandatory-hunt-enter',
        kicker:'필수 튜토리얼 · 8/11',
        title:'첫 토벌 원정을 시작하세요',
        body:'이제 요수를 잡아 <strong>영석</strong>을 모을 차례입니다. 이번에는 요수 3마리와 하급 영초 1개를 목표로 하세요.',
        progress:'목표 · 요수 3마리 + 영초 1개',
        targets:[start]
      };
    }

    if(!swordAffordable(M)){
      if(s.phase==='run'){
        return {
          key:'mandatory-sword-farm-run',
          kicker:'필수 튜토리얼 · 9/11 준비',
          title:'어검술 전승 재화를 모으세요',
          body:'요수를 처치하면 영석은 즉시 획득됩니다. 어검술 전승에 필요한 재화를 채우고 귀환하세요.',
          progress:'영석 '+(+M.stone||0)+' / '+(+swordInfo().unlock?.s||80)+' · 하급 영초 '+(+M.herb||0)+' / '+(+swordInfo().unlock?.h||3),
          targets:[$('#game')]
        };
      }
      return {
        key:'mandatory-sword-farm-home',
        kicker:'필수 튜토리얼 · 9/11 준비',
        title:'어검술 전승 비용을 채우세요',
        body:'재화가 조금 부족합니다. 청운산에서 요수를 더 잡아 영석을 모으세요.',
        progress:'영석 '+(+M.stone||0)+' / '+(+swordInfo().unlock?.s||80)+' · 하급 영초 '+(+M.herb||0)+' / '+(+swordInfo().unlock?.h||3),
        targets:[start]
      };
    }

    if(!activePanel('skills')){
      return {
        key:'mandatory-sword-tab',
        kicker:'필수 튜토리얼 · 9/11',
        title:'첫 법술 · 어검술을 전승하세요',
        body:'비용이 준비되었습니다. <strong>법술</strong> 탭을 열어 어검술을 찾아 전승하세요.',
        progress:'전승 비용 · 영석 '+(+swordInfo().unlock?.s||80)+' + 하급 영초 '+(+swordInfo().unlock?.h||3),
        targets:[tabTarget('skills')]
      };
    }
    return {
      key:'mandatory-sword-unlock',
      kicker:'필수 튜토리얼 · 9/11',
      title:'어검술 전승',
      body:'어검술 노드를 선택하고 전승 버튼을 누르세요. 전승한 법술은 원정에서 <strong>자동으로 발동</strong>합니다.',
      targets:[swordTarget()]
    };
  }

  if(!meta.swordRunSeen){
    if(s.phase==='run'){
      return {
        key:'mandatory-sword-auto-run',
        kicker:'필수 튜토리얼 · 10/11',
        title:'어검술 자동 발동을 확인하세요',
        body:'직접 누를 필요가 없습니다. 사거리 안에 적이 들어오면 어검술이 자동 발동하고 각 법술은 독립 쿨타임을 가집니다.',
        targets:[$('#skillRun'),$('#game')]
      };
    }
    return {
      key:'mandatory-sword-auto-enter',
      kicker:'필수 튜토리얼 · 10/11',
      title:'다음 원정에서 자동 법술을 확인하세요',
      body:'어검술을 전승했습니다. 다시 입장해 자동 발동과 쿨타임 표시를 확인하세요.',
      targets:[start]
    };
  }

  const q1=trainingCount(M,'q1_');
  if(q1<1){
    if((+M.stone||0)<25){
      if(s.phase==='run'){
        return {
          key:'mandatory-first-train-farm-run',
          kicker:'필수 튜토리얼 · 11/11 준비',
          title:'첫 수련용 영석 25를 모으세요',
          body:'요수를 더 처치해 첫 수련 비용을 모으세요. 영석은 처치 즉시 획득됩니다.',
          progress:'영석 '+(+M.stone||0)+'/25',
          targets:[$('#game')]
        };
      }
      return {
        key:'mandatory-first-train-farm-home',
        kicker:'필수 튜토리얼 · 11/11 준비',
        title:'영석 25를 모아 첫 수련을 준비하세요',
        body:'영석이 부족하면 한 번 더 원정해 요수를 처치하세요.',
        progress:'영석 '+(+M.stone||0)+'/25',
        targets:[start]
      };
    }
    if(!activePanel('train')){
      return {
        key:'mandatory-first-train-tab',
        kicker:'필수 튜토리얼 · 11/11',
        title:'첫 수련을 선택하세요',
        body:'수련 탭에서 연기 1층의 수련 노드 하나를 선택하세요. 검결·체수련·경신법·신식 중 원하는 하나면 됩니다.',
        progress:'비용 · 영석 25',
        targets:[tabTarget('train')]
      };
    }
    return {
      key:'mandatory-first-train-buy',
      kicker:'필수 튜토리얼 · 11/11',
      title:'연기 1층 수련 하나를 완료하세요',
      body:'노드를 누른 뒤 아래의 <strong>수련</strong> 버튼을 눌러 첫 영구 성장을 완료하세요.',
      progress:'완료 '+q1+'/1',
      targets:[trainReadyTarget('q1_'),$('#ascDetail .detail-action.ready')]
    };
  }

  return null;
}

function softGuide(s){
  const M=s.M||{};
  const q1=trainingCount(M,'q1_');
  const q2=trainingCount(M,'q2_');
  const eco1=rank(M,'qingyun','eco1');
  const eco2=rank(M,'qingyun','eco2');
  const stage=+M.realm?.stage||0;

  if(!meta.mandatoryDone){
    meta.mandatoryDone=1;
    saveMeta();
  }

  if(stage<2){
    if(q1<2||eco1<3){
      const targets=[];
      if(q1<2)targets.push(tabTarget('train'),activePanel('train')?trainReadyTarget('q1_'):null);
      if(eco1<3)targets.push(tabTarget('tree'),activePanel('tree')?mapAffinityTarget('eco1'):null);
      return {
        key:'soft-q1-eco1',
        kicker:'초행 가이드 · 자유 진행',
        title:'수련과 비경 개척을 함께 진행하세요',
        body:'여기부터는 화면을 막지 않습니다. <strong>두 목표는 순서 상관없이 병렬로 진행</strong>하면 됩니다.',
        goals:[
          {label:'연기 1층 수련',value:q1+'/2',done:q1>=2},
          {label:'청운산 · 요수 흔적',value:eco1+'/3',done:eco1>=3}
        ],
        targets:targets
      };
    }

    if(!activePanel('train')){
      return {
        key:'soft-stage2-tab',
        kicker:'초행 가이드',
        title:'연기 2층으로 돌파하세요',
        body:'연기 1층 수련 2개와 요수 흔적 3/5를 마쳤습니다. 수련 도맥에서 <strong>연기 2층 노드</strong>를 직접 눌러 돌파하세요.',
        progress:'비용 · 영석 80 + 하급 영초 10',
        targets:[tabTarget('train')]
      };
    }
    return {
      key:'soft-stage2',
      kicker:'초행 가이드',
      title:'연기 2층 노드를 직접 선택',
      body:'연기 2층 노드를 누른 뒤 개방 버튼을 사용하세요.',
      progress:'비용 · 영석 80 + 하급 영초 10',
      targets:[$('[data-node-id="stage-1"]'),$('#ascDetail .detail-action.ready')]
    };
  }

  if(stage<3){
    if(q2<2||eco2<3){
      const targets=[];
      if(q2<2)targets.push(tabTarget('train'),activePanel('train')?trainReadyTarget('q2_'):null);
      if(eco2<3)targets.push(tabTarget('tree'),activePanel('tree')?mapAffinityTarget('eco2'):null);
      return {
        key:'soft-q2-eco2',
        kicker:'초행 가이드 · 자유 진행',
        title:'연기 2층 수련과 요수 군락 개척',
        body:'이번에도 두 목표의 순서는 자유입니다.',
        goals:[
          {label:'연기 2층 수련',value:q2+'/2',done:q2>=2},
          {label:'청운산 · 요수 군락',value:eco2+'/3',done:eco2>=3}
        ],
        targets:targets
      };
    }

    if(!activePanel('train')){
      return {
        key:'soft-stage3-tab',
        kicker:'초행 가이드',
        title:'연기 3층으로 돌파하세요',
        body:'수련 도맥에서 연기 3층 노드를 직접 눌러 돌파하세요.',
        progress:'비용 · 영석 180 + 하급 영초 14',
        targets:[tabTarget('train')]
      };
    }
    return {
      key:'soft-stage3',
      kicker:'초행 가이드',
      title:'연기 3층 노드를 직접 선택',
      body:'연기 3층을 개방하면 흑풍곡 관문 조건을 갖출 수 있습니다.',
      progress:'비용 · 영석 180 + 하급 영초 14',
      targets:[$('[data-node-id="stage-2"]'),$('#ascDetail .detail-action.ready')]
    };
  }

  if(!M.unlocked?.blackwind){
    if(!activePanel('tree')){
      return {
        key:'soft-blackwind-map-tab',
        kicker:'초행 가이드',
        title:'흑풍곡 관문을 여세요',
        body:'비경 지도에서 흑풍곡 관문을 선택하세요. 청운산 요수 군락 3/5가 선행 조건입니다.',
        progress:'관문 비용 · 영석 200 + 하급 영초 8',
        targets:[tabTarget('tree')]
      };
    }
    return {
      key:'soft-blackwind-gate',
      kicker:'초행 가이드',
      title:'흑풍곡 관문 개방',
      body:'흑풍곡 관문을 누르고 개방 비용을 지불하세요.',
      progress:'영석 '+(+M.stone||0)+'/200 · 하급 영초 '+(+M.herb||0)+'/8',
      targets:[mapGateTarget('blackwind'),$('#mapDetail .detail-action.ready')]
    };
  }

  if(M.area!=='blackwind'){
    return {
      key:'soft-blackwind-select',
      kicker:'초행 가이드',
      title:'새 원정지 · 흑풍곡을 선택하세요',
      body:'관문이 열렸습니다. 비경 화면으로 돌아가 원정 비경에서 <strong>흑풍곡</strong>을 직접 선택하세요.',
      targets:[areaPickerTarget('흑풍곡'),$('#area')]
    };
  }

  if(s.phase!=='run'){
    return {
      key:'soft-blackwind-enter',
      kicker:'초행 가이드 · 마지막',
      title:'흑풍곡에 처음 입장하세요',
      body:'흑풍곡을 선택했습니다. 입장하면 초행 가이드는 졸업하고 이후부터는 자유롭게 진행합니다.',
      targets:[start]
    };
  }

  return null;
}

function guideFor(s){
  if(!s||!s.M)return null;
  const graduated=maybeGraduate(s);
  if(graduated){
    const feature=featureGuide(s);
    if(feature)return feature;
    return {
      key:'graduated',
      kicker:'초행 가이드 완료',
      title:'흑풍곡까지의 길을 익혔습니다',
      body:'이제부터는 자유롭게 진행합니다. 새 기능을 처음 만날 때만 짧은 기능 튜토리얼이 다시 나타납니다.',
      progress:'영수 포획·영맥 채굴 같은 신규 상호작용은 최초 1회만 안내합니다.',
      targets:[]
    };
  }

  const mandatory=mandatoryGuide(s);
  if(mandatory)return mandatory;
  return softGuide(s);
}

function frame(s){
  if(!s||!s.M)return;

  reconcileMetaWithSave(s.M);

  if(s.phase==='run'&&lastSnap?.phase!=='run'){
    lastRunStartedAt=Date.now();
    runStartPos=s.P?{x:+s.P.x||0,y:+s.P.y||0}:null;
  }
  if(s.phase!=='run'){
    lastRunStartedAt=0;
    runStartPos=null;
  }

  markSwordRunSeen(s);
  markFeatureTutorialProgress(s);
  const g=guideFor(s);

  if(g?.key==='graduated'&&meta.graduationShown){
    renderGuide(null,s);
    lastSnap=s;
    return;
  }

  renderGuide(g,s);

  if(g?.key==='graduated'&&closedKey==='graduated'){
    meta.graduationShown=1;
    saveMeta();
  }

  lastSnap=s;
}

function bindClicks(){
  document.addEventListener('click',e=>{
    if(lastKey==='graduated'&&e.target.closest('#v1150TutorialClose')){
      meta.graduationShown=1;
      saveMeta();
      setTimeout(()=>renderGuide(null,snap()),0);
    }
    if(e.target.closest('#start')&&snap()?.phase!=='run'){
      lastRunStartedAt=Date.now();
    }
  },true);
}

function boot(){
  ensureUi();
  bindClicks();
  const s=snap();
  if(s)frame(s);

  const hub=window.__xianxiaFrameHub;
  if(hub?.subscribe){
    hub.subscribe('guided-onboarding-tutorial',frame,95);
  }else{
    const loop=()=>{
      frame(snap());
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  document.addEventListener('xianxia:progression-rendered',()=>setTimeout(()=>frame(snap()),0));
  setInterval(()=>frame(snap()),350);
}

window.__xianxiaFirstRunTutorial={version:VERSION,meta:()=>({...meta})};

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();
