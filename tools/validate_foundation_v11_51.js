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

ok(html.includes('mastery_runtime_v11_51.js?v=11.51.0'),'mastery runtime is loaded');
ok(game.includes('baseKillStone:()=>killStoneBase()'),'foundation enemy rewards use stage economy');
ok(game.includes("window.__xianxiaMastery?.onFinish?.(reason,foundationApi())"),'mastery finish hook is connected');
ok(formation.includes('const DAO_MARK_COST=1'),'additional trait choice costs one Dao Mark');
ok(!formation.includes('TEST_DAO_MARK_COST'),'free test trait override is removed');
ok(progression.includes("marsh:['eco','fate','res','miasma']"),'Purple Cloud Marsh exposes four branches');
ok(progression.includes("taixu:['eco','fate','res','formation']"),'Taixu Ruins exposes four branches');
ok((progression.match(/stage:\d,area:/g)||[]).length===9,'developer timing data has Foundation 1–9');

const economy=vm.runInNewContext('('+literal(game,'const FOUNDATION_ECONOMY=',";\nconst MAJORS")+')');
const expectedGross=[1359.38,1625,1950,2400,2950,3600,4400,5400,6600];
const expectedRuns=[16,16,17,17,18,18,18,19,20];
for(let stage=1;stage<=9;stage++){
  ok(economy[stage].gross===expectedGross[stage-1],`Foundation ${stage} gross/run matches spreadsheet`);
  ok(economy[stage].targetRuns===expectedRuns[stage-1],`Foundation ${stage} target runs match spreadsheet`);
}

const map=vm.runInNewContext('('+literal(progression,'const MAP=',";\nconst AFF_HINT")+')');
for(const area of ['marsh','taixu'])ok(Object.values(map[area].branches).flat().length===12,`${area} map renders twelve node positions`);

const affinity=vm.runInNewContext('('+literal(progression,'const AFFINITY_COST=',";\nfunction affinityRankCap")+')');
for(const area of ['marsh','taixu'])ok(Object.keys(affinity[area]).length===12,`${area} has twelve priced nodes`);
const sum=area=>Object.values(affinity[area]).flat().reduce((a,b)=>a+b,0);
ok(sum('marsh')===130944,'Purple Cloud Marsh budget total is 130,944');
ok(sum('taixu')===240064,'Taixu Ruins budget total is 240,064');

const fctx={window:{},console};vm.runInNewContext(foundation,fctx);
for(let stage=1;stage<=8;stage++)ok(fctx.window.__xianxiaFoundationContent.runLimit(stage<=3?'thunder':stage<=6?'marsh':'taixu',{major:1,stage})===25,`Foundation ${stage} run limit is 25 seconds`);
ok(fctx.window.__xianxiaFoundationContent.runLimit('taixu',{major:1,stage:9})===35,'Foundation 9 Taixu boss run limit is 35 seconds');
ok(!fctx.window.__xianxiaFoundationContent.bossOnly('taixu',{major:1,stage:8}),'Taixu 8 remains a normal expedition');
ok(fctx.window.__xianxiaFoundationContent.bossOnly('taixu',{major:1,stage:9}),'Taixu 9 is a boss-only encounter');
ok(foundation.includes("enemy.hp*=trial.bossMode?0.70:1"),'Taixu boss formation nodes use reduced boss-phase HP');
ok(foundation.includes("trial.remaining=Math.max(0,trial.remaining-1.5)"),'breaking a boss formation node removes 1.5 seconds');
ok(foundation.includes("radius:210"),'Taixu grand formation uses the wider 210 radius');
ok(game.includes('function taixuFormationTarget(enemy)'),'combat targeting exposes Taixu formation-node priority');
ok(game.includes("if(!bossOnlyRun)setupVein();else vein=null;"),'boss-only encounters suppress veins and expedition side content');
ok(game.includes("if(phase==='run'&&bossEncounter&&run?.foundation?.bossKilled){finish('return');return}"),'boss-only encounters resolve at the kill itself');
const taixuBossHp=5881*1.15*6,stage9Dps=1900;
const gateTime=taixuBossHp*.35/stage9Dps;
const postBurstDamage=stage9Dps*1.35*4;
const postTime=4+Math.max(0,taixuBossHp*.65-postBurstDamage)/stage9Dps;
const conservativeTtk=gateTime+10+postTime;
ok(conservativeTtk<=35*.86,`Taixu boss conservative ideal TTK ${conservativeTtk.toFixed(2)}s fits the 35s budget`);

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
