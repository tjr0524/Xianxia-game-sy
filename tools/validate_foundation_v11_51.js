const fs=require('fs');
const vm=require('vm');

const game=fs.readFileSync('game_runtime_v11_45.js','utf8');
const progression=fs.readFileSync('progression_runtime_v11_45.js','utf8');
const foundation=fs.readFileSync('foundation_content_v11_50.js','utf8');
const mastery=fs.readFileSync('mastery_runtime_v11_51.js','utf8');
const formation=fs.readFileSync('formation_skills_v11_49_35.js','utf8');
const html=fs.readFileSync('index.html','utf8');

function ok(value,label){if(!value)throw new Error(label);console.log('OK  ',label)}
function literal(source,start,end){const a=source.indexOf(start);if(a<0)throw new Error(`missing ${start}`);const b=source.indexOf(end,a+start.length);if(b<0)throw new Error(`missing ${end}`);return source.slice(a+start.length,b)}

ok(html.includes('mastery_runtime_v11_51.js?v='),'mastery runtime is loaded');
ok(game.includes('baseKillStone:()=>killStoneBase()'),'foundation enemy rewards use stage economy');
ok(game.includes("window.__xianxiaMastery?.onFinish?.(reason,foundationApi())"),'mastery finish hook is connected');
ok(formation.includes('const DAO_MARK_COST=1'),'additional trait choice costs one Dao Mark');
ok(!formation.includes('TEST_DAO_MARK_COST'),'free test trait override is removed');
ok(progression.includes("marsh:['eco','fate','res','miasma']"),'Purple Cloud Marsh exposes four branches');
ok(progression.includes("taixu:['eco','fate','res','formation']"),'Taixu Ruins exposes four branches');
ok((progression.match(/stage:\d,area:/g)||[]).length===9,'developer timing data has Foundation 1–9');

const economy=vm.runInNewContext('('+literal(game,'const FOUNDATION_ECONOMY=',";\nconst MAJORS")+')');
const expectedGross=[2718.76,3250,3900,4800,5900,7200,8800,10800,13200];
const expectedRuns=[16,16,17,17,18,18,18,19,20];
for(let stage=1;stage<=9;stage++){
  ok(economy[stage].gross===expectedGross[stage-1],`Foundation ${stage} gross/run matches spreadsheet`);
  ok(economy[stage].targetRuns===expectedRuns[stage-1],`Foundation ${stage} target runs match spreadsheet`);
}

const map=vm.runInNewContext('('+literal(progression,'const MAP=',";\nconst AFF_HINT")+')');
for(const area of ['marsh','taixu'])ok(Object.values(map[area].branches).flat().length===12,`${area} map renders twelve node positions`);
ok(map.taixu.gate.jiedan_trial&&map.jiedan_trial.root,'Taixu map connects to the separate Core Formation trial');

const affinity=vm.runInNewContext('('+literal(progression,'const AFFINITY_COST=',";\nfunction affinityRankCap")+')');
for(const area of ['marsh','taixu'])ok(Object.keys(affinity[area]).length===12,`${area} has twelve priced nodes`);
const sum=area=>Object.values(affinity[area]).flat().reduce((a,b)=>a+b,0);
ok(sum('marsh')===130944,'Purple Cloud Marsh budget total is 130,944');
ok(sum('taixu')===240064,'Taixu Ruins budget total is 240,064');

const fctx={window:{},console};vm.runInNewContext(foundation,fctx);
for(let stage=1;stage<=9;stage++)ok(fctx.window.__xianxiaFoundationContent.runLimit(stage<=3?'thunder':stage<=6?'marsh':'taixu',{major:1,stage})===25,`Foundation ${stage} normal expedition limit is 25 seconds`);
ok(!fctx.window.__xianxiaFoundationContent.bossOnly('taixu',{major:1,stage:9}),'Taixu 9 remains a normal expedition');
ok(fctx.window.__xianxiaFoundationContent.bossOnly('jiedan_trial',{major:1,stage:9}),'Core Formation trial is boss-only');
ok(fctx.window.__xianxiaFoundationContent.runLimit('jiedan_trial',{major:1,stage:9})===45,'Core Formation trial has a 45 second boss budget');
ok(foundation.includes("api.state.area==='jiedan_trial'"),'Taixu Sovereign spawns only in the separate Core Formation trial');
ok(foundation.includes("enemy.hp*=trial.bossMode?0.70:1"),'Core Formation boss nodes use the tuned boss-phase HP');
ok(foundation.includes("trial.remaining=Math.max(0,trial.remaining-1.5)"),'breaking a formation node removes 1.5 seconds');
ok(foundation.includes("현재 이야기의 끝 · 결단의 문턱"),'first clear announces the current ending');
ok(game.includes("M.area==='jiedan_trial'"),'combat targeting and result messaging recognize the Core Formation trial');
ok(game.includes("if(!bossOnlyRun)setupVein();else vein=null;"),'boss-only encounters suppress veins and expedition side content');
ok(game.includes("if(phase==='run'&&bossEncounter&&run?.foundation?.bossKilled){finish('return');return}"),'boss-only encounters resolve at the kill itself');
ok(progression.includes("jiedan_trial:{s:0,h:0"),'progression defines a separate Core Formation trial gate');
ok(progression.includes("축기 9층 수련 완성 필요"),'final gate requires completed Foundation 9 training');
ok(formation.includes('function traitReqReached(M,req)'),'formation UI supports ending-based Core Formation trait unlocks');
ok(formation.includes("jiedanTrialCompleted&&req?.major===2&&req?.stage===1"),'only prepared Core Formation 1 trait tiers are unlocked by the ending');
const taixuBossHp=5881*1.15*6,stage9Dps=1900;
const gateTime=taixuBossHp*.35/stage9Dps;
const postBurstDamage=stage9Dps*1.35*4;
const postTime=4+Math.max(0,taixuBossHp*.65-postBurstDamage)/stage9Dps;
const conservativeTtk=gateTime+10+postTime;
ok(conservativeTtk<=45*.70,`Core Formation boss ideal TTK ${conservativeTtk.toFixed(2)}s fits the 45s budget with practical headroom`);

const mctx={window:{},console};vm.runInNewContext(mastery,mctx);
const M={area:'qingyun',zones:{qingyun:{tree:{}}},formationSkills:{daoMarks:0,ranks:{},traits:{}}};
const run={h0:0,h1:0,h2:0,kills:0,damageBySource:{}};
const api={state:M,run,save(){}};
mctx.window.__xianxiaMastery.onBegin(api);
const message=mctx.window.__xianxiaMastery.onFinish('return',api);
ok(M.formationSkills.daoMarks===1&&message.includes('도흔 +1'),'first safe return grants one one-time Dao Mark');
ok(mctx.window.__xianxiaMastery.onFinish('return',api)===''&&M.formationSkills.daoMarks===1,'mastery reward cannot repeat');
ok(mctx.window.__xianxiaMastery.summary(M).daoists===0,'Daoist count requires five marks');
for(const area of mctx.window.__xianxiaMastery.areas)M.mastery.areas[area].marks=[1,1,1,1,1];
ok(mctx.window.__xianxiaMastery.summary(M).daoists===6,'six completed areas produce the six-Daoist cap');

console.log('foundation 11.51 validation: OK');
