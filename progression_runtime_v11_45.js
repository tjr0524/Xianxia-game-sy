/* GENERATED FLAT RUNTIME 11.45 · source chain: progression_v11_17 -> balance_progression_v11_36 */
(()=>{
'use strict';
const debug=window.__xianxiaDebug;if(!debug)return;
const C=debug.constants,$=s=>document.querySelector(s),HN=['하급','중급','상급'],MAJORS=['연기','축기','결단','원영'],notice=$('#notice'),SAVE_KEY='xianxia_proto_v11',CENTER_X=600;
const BASIC_ID='basic';
if(!C.SKILLS.some(s=>s.id===BASIC_ID))C.SKILLS.unshift({id:BASIC_ID,n:'기본 검격',req:{major:-1,stage:0},grade:0,unlock:{s:0,h:0},cd:999,desc:'법술이 아닌 기본 검격'});
const SPELLS=()=>C.SKILLS.filter(s=>s.id!==BASIC_ID);
let trainCam=null,mapCam=null,selectedTrain={type:'root'},selectedMap={type:'area',area:'qingyun'},renderQueued=false,pickerSignature='',savedRunSkills=null;
const T=(id,name,glyph,desc,cost,effect)=>({id,name,glyph,desc,cost,effect}),K=(s=0,h=0,hg=0)=>({s,h,hg});
const TRAIN=[
{id:'q1',name:'연기 1층',req:{major:0,stage:1},nodes:[T('q1_atk','검결 · 입문','劍','검결계수 +0.10',K(25),{atk:.10}),T('q1_hp','체수련 · 기혈','體','HP +30',K(25),{hp:30}),T('q1_mov','경신법 · 보법','步','Raw 이동 +12',K(25),{mov:12}),T('q1_sen','신식 · 초감','識','신식력 +0.15',K(25),{sen:.15})]},
{id:'q2',name:'연기 2층',req:{major:0,stage:2},nodes:[T('q2_atk','검결 · 연격','劍','검결계수 +0.15',K(30),{atk:.15}),T('q2_hp','체수련 · 조식','體','HP +30',K(30),{hp:30}),T('q2_mov','경신법 · 유보','步','Raw 이동 +19',K(30),{mov:19}),T('q2_sen','신식 · 감응','識','신식력 +0.20',K(30),{sen:.20}),T('q2_edge','속검','鋒','기본 검격 후딜 -8%',K(40),{})]},
{id:'q3',name:'연기 3층',req:{major:0,stage:3},nodes:[T('q3_atk','검결 · 파봉','劍','검결계수 +0.15',K(75),{atk:.15}),T('q3_hp','체수련 · 단련','體','HP +30',K(70),{hp:30}),T('q3_mov','경신법 · 활보','步','Raw 이동 +14',K(70),{mov:14}),T('q3_sen','신식 · 확청','識','신식력 +0.20',K(70),{sen:.20}),T('q3_shadow','풍압 적응','影','환경 이동 패널티 5% 완화',K(95),{})]},
{id:'q4',name:'연기 4층',req:{major:0,stage:4},nodes:[T('q4_atk','검결 · 심화','劍','검결계수 +0.25',K(100),{atk:.25}),T('q4_hp','체수련 · 강근','體','HP +25',K(90),{hp:25}),T('q4_guard','호체 · 강피','盾','HP +15',K(80),{hp:15}),T('q4_mov','경신법 · 축지','步','Raw 이동 +15',K(80),{mov:15}),T('q4_sen','신식 · 확장','識','신식력 +0.20',K(90),{sen:.20}),T('q4_edge','잔영보','影','가속/방향전환 +15%',K(120),{})]},
{id:'q5',name:'연기 5층',req:{major:0,stage:5},nodes:[T('q5_atk','검결 · 절맥','劍','검결계수 +0.30',K(150),{atk:.30}),T('q5_hp','체수련 · 철골','體','HP +45',K(130),{hp:45}),T('q5_guard','호체 · 호맥','盾','HP +20',K(110),{hp:20}),T('q5_mov','경신법 · 부유','步','Raw 이동 +16',K(110),{mov:16}),T('q5_sen','신식 · 투시','識','신식력 +0.25',K(140),{sen:.25}),T('q5_spirit','영각 · 추적','靈','화면 밖 특수목표 방향표시 개방',K(160),{})]},
{id:'q6',name:'연기 6층',req:{major:0,stage:6},nodes:[T('q6_atk','검결 · 응축','劍','검결계수 +0.35',K(280),{atk:.35}),T('q6_hp','체수련 · 내련','體','HP +35',K(250),{hp:35}),T('q6_guard','호체 · 내갑','盾','HP +20',K(200),{hp:20}),T('q6_mov','경신법 · 유영','步','Raw 이동 +18',K(200),{mov:18}),T('q6_sen','신식 · 투영','識','신식력 +0.25',K(240),{sen:.25}),T('q6_spirit','정기순환','靈','연속 피격 시 2타 이후 피해 -8%',K(280),{})]},
{id:'q7',name:'연기 7층',req:{major:0,stage:7},nodes:[T('q7_atk','검결 · 살검','劍','검결계수 +0.40',K(450),{atk:.40}),T('q7_hp','체수련 · 옥골','體','HP +60',K(420),{hp:60}),T('q7_guard','호체 · 호신','盾','HP +30',K(330),{hp:30}),T('q7_mov','경신법 · 비연','步','Raw 이동 +18',K(330),{mov:18}),T('q7_sen','신식 · 심안','識','신식력 +0.30',K(390),{sen:.30}),T('q7_spirit','심안 · 위협감지','靈','희귀/정예 화면 밖 접근 경고',K(480),{})]},
{id:'q8',name:'연기 8층',req:{major:0,stage:8},nodes:[T('q8_atk','검결 · 극의','劍','검결계수 +0.50',K(650),{atk:.50}),T('q8_hp','체수련 · 금근','體','HP +70',K(600),{hp:70}),T('q8_guard','호체 · 외갑','盾','HP +40',K(470),{hp:40}),T('q8_mov','경신법 · 무영','步','Raw 이동 +20',K(470),{mov:20}),T('q8_sen','신식 · 외방','識','신식력 +0.35',K(580),{sen:.35}),T('q8_shadow','무영보','影','이동 중 감속/방향전환 손실 -25%',K(730),{})]},
{id:'q9',name:'연기 9층',req:{major:0,stage:9},nodes:[T('q9_atk','검결 · 원만','劍','검결계수 +0.45',K(800),{atk:.45}),T('q9_edge','검심','鋒','검결계수 +0.20',K(700),{atk:.20}),T('q9_hp','체수련 · 금강','體','HP +110',K(600),{hp:110}),T('q9_guard','호체 · 금신','盾','HP +50',K(600),{hp:50}),T('q9_mov','경신법 · 허공','步','Raw 이동 +23',K(650),{mov:23}),T('q9_sen','신식 · 원광','識','신식력 +0.40',K(650),{sen:.40}),T('q9_harmony','사법조화','合','기본후딜 -4% · 이동/탐지 역보정 소폭 완화 · 연속피격 방어 +2%p',K(500),{})]},
{id:'f1',name:'축기 1층',req:{major:1,stage:1},nodes:[T('f1_atk','진원 · 검강','劍','검결계수 +0.55',K(1300),{atk:.55}),T('f1_core','진원핵','丹','검결계수 +0.30',K(900),{atk:.30}),T('f1_hp','축기 육신','體','HP +40',K(900),{hp:40}),T('f1_guard','진원 호체','盾','HP +20',K(900),{hp:20}),T('f1_mov','축기 경신','步','Raw 이동 +30',K(1000),{mov:30}),T('f1_sen','축기 신식','識','신식력 +0.50',K(1000),{sen:.50}),T('f1_harmony','진원순환','合','회복 시작 단축 / 법술 후 이동 경직 완화 / 환경 감속 저항',K(1000),{})]},
{id:'f2',name:'축기 2층',req:{major:1,stage:2},nodes:[T('f2_atk','진원 · 응축','劍','검결계수 +0.77',K(2590),{atk:.7682539683}),T('f2_hp','축기 육신','體','HP +65',K(1340),{hp:65}),T('f2_guard','진원 호체','盾','HP +35',K(830),{hp:35}),T('f2_mov','경신 · 유영','步','Raw 이동 +10',K(1170),{mov:10}),T('f2_sen','신식 · 확장','識','신식력 +0.20',K(1170),{sen:.20}),T('f2_method','경지 심법','法','호체 파괴 가속 기본효과 강화',K(1250),{})]},
{id:'f3',name:'축기 3층',req:{major:1,stage:3},nodes:[T('f3_atk','진원 · 순환','劍','검결계수 +0.91',K(3290),{atk:.9123015873}),T('f3_hp','축기 육신','體','HP +78',K(1700),{hp:78}),T('f3_guard','진원 호체','盾','HP +42',K(1060),{hp:42}),T('f3_mov','경신 · 유영','步','Raw 이동 +10',K(1490),{mov:10}),T('f3_sen','신식 · 확장','識','신식력 +0.20',K(1490),{sen:.20}),T('f3_method','경지 심법','法','진기폭주 해금 + 축지 특성 I 해금',K(1590),{})]},
{id:'f4',name:'축기 4층',req:{major:1,stage:4},nodes:[T('f4_atk','진원 · 개맥','劍','검결계수 +1.20',K(4050),{atk:1.2003968254}),T('f4_hp','축기 육신','體','HP +91',K(2090),{hp:91}),T('f4_guard','진원 호체','盾','HP +49',K(1310),{hp:49}),T('f4_mov','경신 · 유영','步','Raw 이동 +10',K(1830),{mov:10}),T('f4_sen','신식 · 확장','識','신식력 +0.20',K(1830),{sen:.20}),T('f4_method','경지 심법','法','호체 최대 2층 + 호체 특성 I 해금',K(1960),{})]},
{id:'f5',name:'축기 5층',req:{major:1,stage:5},nodes:[T('f5_atk','진원 · 융합','劍','검결계수 +1.44',K(5280),{atk:1.4404761905}),T('f5_hp','축기 육신','體','HP +104',K(2730),{hp:104}),T('f5_guard','진원 호체','盾','HP +56',K(1700),{hp:56}),T('f5_mov','경신 · 유영','步','Raw 이동 +10',K(2390),{mov:10}),T('f5_sen','신식 · 확장','識','신식력 +0.25',K(2390),{sen:.25}),T('f5_method','경지 심법','法','진기폭주 특성 I 해금',K(2560),{})]},
{id:'f6',name:'축기 6층',req:{major:1,stage:6},nodes:[T('f6_atk','진원 · 관통','劍','검결계수 +1.73',K(6450),{atk:1.7285714286}),T('f6_hp','축기 육신','體','HP +117',K(3330),{hp:117}),T('f6_guard','진원 호체','盾','HP +63',K(2080),{hp:63}),T('f6_mov','경신 · 유영','步','Raw 이동 +10',K(2910),{mov:10}),T('f6_sen','신식 · 확장','識','신식력 +0.25',K(2910),{sen:.25}),T('f6_method','경지 심법','法','축지 특성 II 해금',K(3120),{})]},
{id:'f7',name:'축기 7층',req:{major:1,stage:7},nodes:[T('f7_atk','진원 · 대주천','劍','검결계수 +2.21',K(7880),{atk:2.2087301587}),T('f7_hp','축기 육신','體','HP +136',K(4070),{hp:136}),T('f7_guard','진원 호체','盾','HP +74',K(2540),{hp:74}),T('f7_mov','경신 · 유영','步','Raw 이동 +10',K(3560),{mov:10}),T('f7_sen','신식 · 확장','識','신식력 +0.30',K(3560),{sen:.30}),T('f7_method','경지 심법','法','축지 2충전 + 진기폭주 특성 II 해금',K(3810),{})]},
{id:'f8',name:'축기 8층',req:{major:1,stage:8},nodes:[T('f8_atk','진원 · 귀원','劍','검결계수 +2.69',K(10200),{atk:2.6888888889}),T('f8_hp','축기 육신','體','HP +156',K(5270),{hp:156}),T('f8_guard','진원 호체','盾','HP +84',K(3290),{hp:84}),T('f8_mov','경신 · 유영','步','Raw 이동 +10',K(4610),{mov:10}),T('f8_sen','신식 · 확장','識','신식력 +0.30',K(4610),{sen:.30}),T('f8_method','경지 심법','法','호체 최대 3층 + 호체 특성 II 해금',K(4940),{})]},
{id:'f9',name:'축기 9층',req:{major:1,stage:9},nodes:[T('f9_atk','진원 · 원만','劍','검결계수 +3.27',K(13130),{atk:3.2650793651}),T('f9_hp','축기 육신','體','HP +182',K(6780),{hp:182}),T('f9_guard','진원 호체','盾','HP +98',K(4240),{hp:98}),T('f9_mov','경신 · 유영','步','Raw 이동 +10',K(5930),{mov:10}),T('f9_sen','신식 · 확장','識','신식력 +0.35',K(5930),{sen:.35}),T('f9_method','경지 심법','法','축지 특성 III 해금 / 축기 빌드 완성',K(6350),{})]}
];
const TRAIN_WORLD_H=2800,TRAIN_ROOT_Y=2710;
const NODE=Object.fromEntries(TRAIN.flatMap(stage=>stage.nodes.map(node=>[node.id,{...node,stage}])))
const AREA_UNLOCKS={blackwind:{s:200,h:8,hg:0,req:{major:0,stage:3},prereq:[['qingyun','eco2',3]],label:'흑풍곡 개방'},blood:{s:400,h:10,hg:1,req:{major:0,stage:6},prereq:[['blackwind','eco2',3],['blackwind','fate2',3]],label:'적혈비경 개방'},foundation_trial:{s:0,h:0,hg:0,req:{major:0,stage:9},prereq:[],label:'축기 시련 도전'},thunder:{s:0,h:0,hg:2,req:{major:1,stage:1},prereq:[],insight:1,label:'천뢰봉 개방'},marsh:{s:0,h:0,hg:2,req:{major:1,stage:4},prereq:[],label:'자운택 개방'},taixu:{s:0,h:0,hg:2,req:{major:1,stage:7},prereq:[],label:'태허유적 개방'}};
const BRANCHES={qingyun:['eco'],blackwind:['eco','fate'],blood:['eco','fate','res'],foundation_trial:[],thunder:['eco','fate','res','storm'],marsh:['eco','fate','res','miasma'],taixu:['eco','fate','res','formation']},BRANCH_GLYPH={eco:'獸',fate:'緣',res:'脈',storm:'雷',miasma:'氣',formation:'陣'};
const AREA_ICON_BASE='assets/ink_v1/foundation_trial_v1/';
const AREA_ICON={qingyun:AREA_ICON_BASE+'ui/node_icons/battlefield/active_node_64.png',blackwind:AREA_ICON_BASE+'ui/node_icons/training_core/wind_adaptation_64.png',blood:AREA_ICON_BASE+'ui/node_icons/battlefield/hazardous_ground_64.png',foundation_trial:AREA_ICON_BASE+'ui/foundation_trial_map_node.png',thunder:AREA_ICON_BASE+'ui/node_icons/battlefield/thunder_trace_64.png',marsh:AREA_ICON_BASE+'regions/purple_cloud_marsh/ui/purple_cloud_marsh_map_node_724.png',taixu:AREA_ICON_BASE+'ui/taixu_ruins_map_node.png'};
const areaIcon=id=>`<img class="area-symbol" src="${AREA_ICON[id]}" alt="" loading="lazy" decoding="async">`;
const MAP={
qingyun:{root:{x:170,y:636},branches:{eco:[{x:212,y:567},{x:283,y:527},{x:333,y:470}]},gate:{blackwind:{x:413,y:435}}},
blackwind:{root:{x:451,y:283},branches:{eco:[{x:402,y:326},{x:351,y:293},{x:306,y:254}],fate:[{x:521,y:326},{x:605,y:299},{x:691,y:245}]},gate:{blood:{x:599,y:429}}},
blood:{root:{x:794,y:489},branches:{eco:[{x:795,y:586},{x:858,y:620},{x:875,y:676}],fate:[{x:697,y:555},{x:651,y:634},{x:559,y:657}],res:[{x:858,y:545},{x:935,y:587},{x:1004,y:632}]},gate:{foundation_trial:{x:897,y:459}}},
foundation_trial:{root:{x:950,y:331},branches:{},gate:{thunder:{x:1055,y:251}}},
thunder:{root:{x:1113,y:141},branches:{eco:[{x:992,y:238},{x:937,y:211},{x:890,y:187}],fate:[{x:1052,y:133},{x:995,y:100},{x:944,y:66}],res:[{x:1173,y:156},{x:1240,y:147},{x:1297,y:72}],storm:[{x:1221,y:237},{x:1288,y:221},{x:1349,y:203}]},gate:{marsh:{x:1272,y:328}}},
marsh:{root:{x:1433,y:386},branches:{eco:[{x:1350,y:451},{x:1266,y:433},{x:1174,y:402}],fate:[{x:1537,y:404},{x:1579,y:369},{x:1627,y:339}],res:[{x:1556,y:474},{x:1627,y:482},{x:1715,y:449}],miasma:[{x:1414,y:500},{x:1357,y:527},{x:1282,y:543}]},gate:{taixu:{x:1507,y:518}}},
taixu:{root:{x:1539,y:644},branches:{eco:[{x:1440,y:731},{x:1386,y:752},{x:1312,y:794}],fate:[{x:1453,y:678},{x:1396,y:668},{x:1342,y:656}],res:[{x:1619,y:670},{x:1659,y:636},{x:1681,y:586}],formation:[{x:1631,y:716},{x:1675,y:743},{x:1727,y:772}]},gate:{}}
};
const AFF_HINT={eco1:'요수 개체 수가 늘고 처치 영석 기대값이 오른다.',eco2:'요수가 더 자주 무리 지어 등장해 광역 법술의 가치가 커진다.',eco3:'희귀·강화 요수 출현과 고보상 전투가 늘어난다.',fate1:'산수와 탐보서가 등장해 전리품 경쟁이 시작된다.',fate2:'산수가 비보를 지닐 가능성과 빼앗을 보상이 커진다.',fate3:'붙잡으면 영초를 남기는 영수가 출현한다.',res1:'고정 영맥이 드러나 영석 채굴 루트가 생긴다.',res2:'영맥에 정예 수호수가 붙지만 채굴 가치도 커진다.',res3:'영맥 규모와 정예 보상이 크게 증가한다. R5 폭주 요수는 처치하지 않아도 영맥 곁에서 채굴이 계속된다.',storm1:'낙뢰 빈도와 연속·복합 패턴이 증가한다. 천뢰 직격 시 뢰흔을 얻는다.',storm2:'단계마다 낙뢰 전조 시간이 길어지고 직격 반경이 커져 일부러 맞기 쉬워진다.',storm3:'천뢰 직격 피해를 단계별로 줄여 연속 직격 수련의 안정성을 높인다.',miasma1:'폭발형 균열석갑충을 출현시킨다. 균열석갑충 처치 시 자운정수 +1.',miasma2:'묵령원과 폭발형 혼합팩을 활성화한다. 묵령원 처치 시 자운정수 +1.',miasma3:'옥린천산갑과 3종 정예 조합을 활성화한다. 옥린천산갑 처치 시 자운정수 +1.',formation1:'진안 활성 시 수호령 쇄도가 강해진다. R3부터 추가 수호령, R5에서 후반 웨이브가 강화된다.',formation2:'축기 8층부터 결절이 진법을 방해한다. 파괴하면 해당 방해가 사라지고 수성시간이 1초 줄어든다.',formation3:'축기 9층 태허진령이 태허대진을 전개한다. 살아있는 결절마다 보스 피해감소 15%, 파훼 시 4초 파진 상태가 된다.'};
const AREA_NODE_NAME={marsh:{eco1:'요수 흔적',eco2:'요수 군락',eco3:'희귀 요수',fate1:'안개 단서',fate2:'침몰 비보',fate3:'자운 영수',res1:'수맥 감응',res2:'수호 수맥',res3:'자운 결정',miasma1:'폭렬 요기',miasma2:'호령 요기',miasma3:'호체 요기'},taixu:{eco1:'수호령 흔적',eco2:'군진',eco3:'고대 수호령',fate1:'유물 단서',fate2:'유물 쟁탈',fate3:'잔령 추적',res1:'진법 동력',res2:'수호 동력',res3:'태허 핵',formation1:'진안 공명',formation2:'진법 결절',formation3:'태허대진'}};
const areaNodeName=(area,node)=>AREA_NODE_NAME[area]?.[node.id]||node.n;
function snap(){return debug.snapshot()}function state(){return snap().M}function clone(v){return JSON.parse(JSON.stringify(v))}function herbKey(g){return g===0?'herb':g===1?'herb2':'herb3'}function herbHave(M,g){return Number(M[herbKey(g)])||0}
function foundationMaterial(M){if((M.realm?.major??-1)!==1)return null;const s=M.realm?.stage||1;if(s<=3)return{key:'thunderMark',name:'뢰흔'};if(s<=6)return{key:'purpleEssence',name:'자운정수'};return{key:'taixuSigil',name:'태허진문'}}
function secondaryInfo(M,c){
  const amount=Math.max(0,+c?.h||0);if(!amount)return{kind:'none',amount:0,name:''};
  // Breakthrough costs carry an explicit material so the UI and the actual
  // deduction can never disagree after the realm changes.
  if(c?.mat){
    const names={thunderMark:'뢰흔',purpleEssence:'자운정수',taixuSigil:'태허진문',herb:'하급 영초',herb2:'중급 영초',herb3:'상급 영초'};
    const key=c.mat;
    if(key==='herb'||key==='herb2'||key==='herb3'){
      const grade=key==='herb'?0:key==='herb2'?1:2;
      return{kind:'herb',amount,grade,key,name:names[key]};
    }
    return{kind:'foundation',amount,key,name:names[key]||key};
  }
  const m=foundationMaterial(M);if(m)return{kind:'foundation',amount,key:m.key,name:m.name};
  const grade=Math.max(0,Math.min(2,+c?.hg||0));return{kind:'herb',amount,grade,key:herbKey(grade),name:`${['하급','중급','상급'][grade]} 영초`}
}
function secondaryHave(M,c){const q=secondaryInfo(M,c);if(!q.amount)return true;return q.kind==='foundation'?(+M[q.key]||0)>=q.amount:herbHave(M,q.grade)>=q.amount}
function secondarySpend(M,c){const q=secondaryInfo(M,c);if(!q.amount)return;if(q.kind==='foundation')M[q.key]=Math.max(0,(+M[q.key]||0)-q.amount);else M[herbKey(q.grade)]=Math.max(0,herbHave(M,q.grade)-q.amount)}
function reached(M,req){return M.realm?.major>=0&&(M.realm.major>req.major||(M.realm.major===req.major&&M.realm.stage>=req.stage))}function realmLabel(req){return `${MAJORS[req.major]||'상위경지'} ${req.stage}층`}
function ensure(M){M.trainingNodes||={};M.skills||={};M.skillUnlocks||={};if(M.balanceVersion!=='training-v0.6'){const legacy=M.balanceVersion==='core-v0.1';if(legacy){for(const[oldGuard,mergedHp]of[['q4_guard','q4_hp'],['q5_guard','q5_hp'],['q6_guard','q6_hp'],['q7_guard','q7_hp'],['q8_guard','q8_hp'],['q9_guard','q9_hp']])if(M.trainingNodes[oldGuard]&&!M.trainingNodes[mergedHp])M.trainingNodes[mergedHp]=1}const oldSkills=M.skills||{};M.cult={atk:1,mov:150,sen:1,hp:90,basicRange:0,basicHits:0};for(const st of TRAIN)for(const n of st.nodes)if(M.trainingNodes[n.id])applyCult(M,n.effect);for(const s of SPELLS()){const old=oldSkills?.[s.id]||{},known=!!M.skillUnlocks[s.id]||!!old.u;M.skillUnlocks[s.id]=known?1:0;const oldRank=Math.max(+old.pow||0,+old.range||0,+old.cycle||0);M.skills[s.id]={u:known?1:0,pow:known?Math.max(1,Math.min(5,Math.round(+old.pow||oldRank||1))):0,range:known?Math.max(0,Math.min(5,Math.round(+old.range||0))):0,cycle:known?Math.max(0,Math.min(5,Math.round(+old.cycle||0))):0}}M.trainingExtras={};M.balanceVersion='training-v0.6'}M.cult||={atk:1,mov:150,sen:1,hp:90,basicRange:0,basicHits:0};M.cult.basicRange=+M.cult.basicRange||0;M.cult.basicHits=+M.cult.basicHits||0;M.skills[BASIC_ID]||={u:1,pow:0,range:0,cycle:0};M.skills[BASIC_ID].u=1;for(const s of SPELLS()){M.skills[s.id]||={u:0,pow:0,range:0,cycle:0};M.skills[s.id].u=M.skillUnlocks[s.id]?1:0}return M}
function normalizeSkillUnlocks(){let M=state(),had=!!M.skillUnlocks;M.skillUnlocks||={};if(!had){for(const s of SPELLS()){const st=M.skills?.[s.id];if(st?.u&&(s.id!=='sword'||(+st.pow||0)+(+st.range||0)+(+st.cycle||0)>0))M.skillUnlocks[s.id]=1}}ensure(M);debug.replaceState(M)}
function currentStageIndex(M){let idx=-1;for(let i=0;i<TRAIN.length;i++)if(reached(M,TRAIN[i].req))idx=i;return idx}function completed(M,stage){return stage?.nodes.filter(n=>M.trainingNodes?.[n.id]).length||0}
const STAT_LABEL={atk:'공격력',hp:'최대 체력',mov:'이동 속도',sen:'감지 범위',basicRange:'기본 공격 거리',basicHits:'기본 공격 추가 타수'};function effectText(e){return Object.entries(e).map(([k,v])=>`${STAT_LABEL[k]||k} +${v}`).join(' · ')}function costHtml(c){if(!c)return'<span class="cost-chip free">돌파 비용 미적용</span>';const M=state(),a=[];if(c.s)a.push(`<span class="cost-chip stone"><i>◆</i>${c.s}</span>`);if(c.h){const q=secondaryInfo(M,c),have=q.kind==='foundation'?(+M[q.key]||0):herbHave(M,q.grade);a.push(`<span class="cost-chip herb g${c.hg}"><i>❧</i>${q.name} ${q.amount} <small>(보유 ${have})</small></span>`)}return a.join('')||'<span class="cost-chip free">무료</span>'}function needCount(i){return TRAIN[i]?.nodes.length||0}
function canBuyTrain(M,node){const sh=snap();if(sh.phase==='run')return[false,'원정 중'];if(M.trainingNodes?.[node.id])return[false,'이미 완료'];if(!reached(M,node.stage.req))return[false,`${node.stage.name} 필요`];if((+M.stone||0)<node.cost.s||!secondaryHave(M,node.cost))return[false,'재료 부족'];return[true,'수련 가능']}
function applyCult(M,effect){for(const[k,v]of Object.entries(effect))M.cult[k]=(+M.cult[k]||0)+v}function buyTrain(id){const n=NODE[id];if(!n)return;const M=ensure(state()),[ok,why]=canBuyTrain(M,n);if(!ok){notice.textContent=why;return}M.stone-=n.cost.s;secondarySpend(M,n.cost);applyCult(M,n.effect);M.trainingNodes[n.id]=1;debug.replaceState(M);scheduleRender()}
const BREAKTHROUGH_COST={
  q1:{s:0,h:8,hg:0,mat:'herb'},
  q2:{s:80,h:10,hg:0,mat:'herb'},
  q3:{s:180,h:14,hg:0,mat:'herb'},
  q4:{s:300,h:10,hg:1,mat:'herb2'},
  q5:{s:450,h:14,hg:1,mat:'herb2'},
  q6:{s:800,h:18,hg:1,mat:'herb2'},
  q7:{s:1300,h:15,hg:2,mat:'herb3'},
  q8:{s:1800,h:20,hg:2,mat:'herb3'},
  q9:{s:2600,h:28,hg:2,mat:'herb3'},
  // 축기권 몬스터 영석 보상이 2배이므로 소경지 돌파 영석도 정확히 2배.
  // 이렇게 해야 '돌파 영석을 모으는 판수'가 기존과 동일하게 유지된다.
  f1:{s:4500,h:40,hg:2,mat:'herb3',major:true},
  f2:{s:10800,h:8,hg:2,mat:'thunderMark'},
  f3:{s:13600,h:12,hg:2,mat:'thunderMark'},
  f4:{s:16800,h:16,hg:2,mat:'thunderMark'},
  f5:{s:22000,h:8,hg:2,mat:'purpleEssence'},
  f6:{s:26800,h:12,hg:2,mat:'purpleEssence'},
  f7:{s:32600,h:16,hg:2,mat:'purpleEssence'},
  f8:{s:42200,h:6,hg:2,mat:'taixuSigil'},
  f9:{s:54400,h:12,hg:2,mat:'taixuSigil'}
};
function breakthroughCost(target){
  const stage=typeof target==='number'?TRAIN[target]:target;
  return stage?BREAKTHROUGH_COST[stage.id]||null:null;
}
function breakthroughShortage(M,price){
  if(!price)return'돌파 비용 미설계';
  if((+M.stone||0)<price.s)return `영석 부족 · ${Math.floor(+M.stone||0)} / ${price.s}`;
  const q=secondaryInfo(M,price);
  if(q.amount){
    const have=q.kind==='foundation'?(+M[q.key]||0):herbHave(M,q.grade);
    if(have<q.amount)return `${q.name} 부족 · ${have} / ${q.amount}`;
  }
  return'';
}
function stageStatus(i){
  const sh=snap(),M=ensure(sh.M),cur=currentStageIndex(M),target=TRAIN[i];
  if(!target)return{can:false,text:'경지 정보 없음'};
  if(i<=cur)return{can:false,reached:true,text:i===cur?'현재 경지':'도달 완료'};
  if(i!==cur+1)return{can:false,text:'이전 경지 필요'};
  const price=breakthroughCost(target);
  if(!price)return{can:false,text:'다음 경지 돌파 비용 미설계',price:null};
  if(sh.phase==='run')return{can:false,text:'원정 중',price};
  if(i>0){
    const prev=TRAIN[i-1],d=completed(M,prev),need=needCount(i-1);
    if(d<need)return{can:false,text:`${prev.name} 수련 ${d}/${prev.nodes.length} · ${need}개 필요`,price};
  }
  if(price.major&&!M.events?.foundationInsight)return{can:false,text:'축기의 실마리 필요',price};
  const shortage=breakthroughShortage(M,price);
  if(shortage)return{can:false,text:shortage,price};
  return{can:true,text:'돌파 가능',price};
}
function breakthrough(i){
  const st=TRAIN[i],s=stageStatus(i);
  if(!st||!s.can){notice.textContent=s?.text||'돌파 불가';return}
  const M=ensure(state()),cost=breakthroughCost(st);
  if(!cost){notice.textContent='돌파 비용 미설계';return}
  const shortage=breakthroughShortage(M,cost);
  if(shortage){notice.textContent=shortage;renderTrainDetail();return}
  M.stone-=cost.s;
  secondarySpend(M,cost);
  M.realm={...st.req};
  debug.replaceState(M);
  renderAll()
}
const AFFINITY_COST={
 qingyun:{eco1:[60,90,132,192,270],eco2:[63,95,139,202,284],eco3:[69,104,152,221,311]},
 blackwind:{eco1:[154,231,338,492,692],eco2:[161,242,355,517,726],eco3:[177,265,389,566,796],fate1:[62,92,135,197,277],fate2:[62,92,135,197,277],fate3:[61,93,136,196,276]},
 blood:{eco1:[458,687,1008,1466,2062],eco2:[481,722,1058,1539,2165],eco3:[527,790,1159,1686,2371],fate1:[153,229,336,489,687],fate2:[153,229,336,489,687],fate3:[152,229,336,488,688],res1:[183,275,403,586,825],res2:[183,275,403,586,825],res3:[184,275,404,587,824]},
 thunder:{eco1:[1359,2039,2991,4350,6117],eco2:[1427,2141,3140,4568,6423],eco3:[1563,2345,3439,5003,7035],fate1:[453,680,997,1450,2039],fate2:[453,680,997,1450,2039],fate3:[453,679,997,1450,2039],res1:[521,782,1146,1668,2345],res2:[521,782,1146,1668,2345],res3:[521,781,1147,1667,2345],storm1:[544,816,1196,1740,2447],storm2:[544,816,1196,1740,2447],storm3:[543,815,1197,1740,2447]},
 marsh:{eco1:[800,1200,1760,2560,3600],eco2:[800,1200,1760,2560,3600],eco3:[800,1200,1760,2560,3600],fate1:[840,1260,1848,2688,3780],fate2:[840,1260,1848,2688,3780],fate3:[840,1260,1848,2688,3780],res1:[920,1380,2024,2944,4140],res2:[920,1380,2024,2944,4140],res3:[920,1380,2024,2944,4140],miasma1:[960,1440,2112,3072,4320],miasma2:[960,1440,2112,3072,4320],miasma3:[960,1440,2112,3072,4320]},
 taixu:{eco1:[1467,2200,3227,4693,6600],eco2:[1467,2200,3227,4693,6600],eco3:[1466,2200,3226,4694,6600],fate1:[1540,2310,3388,4928,6930],fate2:[1540,2310,3388,4928,6930],fate3:[1540,2310,3388,4928,6930],res1:[1687,2530,3711,5397,7590],res2:[1687,2530,3711,5397,7590],res3:[1686,2530,3710,5398,7590],formation1:[1760,2640,3872,5632,7920],formation2:[1760,2640,3872,5632,7920],formation3:[1760,2640,3872,5632,7920]}
};
function affinityRankCap(M,a,n){
  // Once a map node itself is available, all five ranks may be purchased.
  // The old 3→4→5 realm-stage cap made an already-open node stop after
  // rank 3 (often perceived as "two upgrades then frozen").
  return reached(M,nodeReq(a,n))?5:0;
}
function zoneRank(M,a,id){return Math.max(0,Math.min(5,+M.zones?.[a]?.tree?.[id]||0))}function areaIndex(id){return Math.max(0,C.AREAS.findIndex(a=>a.id===id))}function nodeReq(a,n){const z=C.AREAS.find(x=>x.id===a);if(a==='blood'&&n.id==='fate3')return{major:z.req.major,stage:z.baseStage+1};return{major:z.req.major,stage:z.baseStage+n.tier-1}}function affinityCost(M,a,n){const l=zoneRank(M,a,n.id),arr=AFFINITY_COST[a]?.[n.id]||[n.c.s,n.c.s*2,n.c.s*3,n.c.s*4,n.c.s*5];return{s:Math.ceil(arr[Math.min(4,l)]||arr[arr.length-1]||1),h:0,hg:Math.min(2,areaIndex(a))}}
function prereqNode(area,id){
  return Object.values(C.TREE).flat().find(node=>node.id===id)||null;
}
function prereqNodeLabel(area,id){
  const node=prereqNode(area,id),zone=C.AREAS.find(x=>x.id===area);
  return `${zone?.name||area} · ${node?areaNodeName(area,node):id}`;
}
function affinityPrereqText(M,a,n){
  if(!n?.p)return'';
  const have=zoneRank(M,a,n.p);
  return `선행 조건 · ${prereqNodeLabel(a,n.p)} 3/5 이상 (현재 ${have}/5)`;
}
function areaPrereqLines(M,id){
  const g=AREA_UNLOCKS[id];if(!g)return[];
  return (g.prereq||[]).map(([area,node,need])=>{
    const have=zoneRank(M,area,node),ok=have>=need;
    return `${ok?'✓':'○'} ${prereqNodeLabel(area,node)} ${need}/5 이상 (현재 ${have}/5)`;
  });
}
function canAffinity(M,a,n){if(snap().phase==='run')return[false,'원정 중'];if(!M.unlocked?.[a])return[false,'비경 미개방'];const l=zoneRank(M,a,n.id);if(l>=5)return[false,'완성'];const r=nodeReq(a,n);if(!reached(M,r))return[false,realmLabel(r)+' 필요'];if(n.p&&zoneRank(M,a,n.p)<3)return[false,affinityPrereqText(M,a,n)];const cap=affinityRankCap(M,a,n);if(l>=cap)return[false,'현재 경지 상한 '+cap+'/5'];const c=affinityCost(M,a,n);if(M.stone<c.s||herbHave(M,c.hg)<c.h)return[false,'재료 부족'];return[true,'개척 가능']}
function buyAffinity(a,id){const M=ensure(state()),n=Object.values(C.TREE).flat().find(x=>x.id===id);if(!n)return;const[ok,why]=canAffinity(M,a,n);if(!ok){notice.textContent=why;renderMapDetail();return}const c=affinityCost(M,a,n);M.stone-=c.s;if(c.h)M[herbKey(c.hg)]-=c.h;M.zones[a].tree[id]=zoneRank(M,a,id)+1;debug.replaceState(M);renderAll()}
function canUnlockArea(M,id){if(id==='thunder'&&!M.events?.foundationTrialCompleted)return[false,'축기 시련 완료 필요'];if(M.unlocked?.[id])return[true,'이미 개방'];const g=AREA_UNLOCKS[id];if(!g)return[false,'기본 비경'];if(!reached(M,g.req))return[false,realmLabel(g.req)+' 필요'];if(g.insight&&!M.events?.foundationInsight)return[false,'축기의 실마리 필요'];for(const[a,n,r]of g.prereq){const have=zoneRank(M,a,n);if(have<r)return[false,`선행 조건 · ${prereqNodeLabel(a,n)} ${r}/5 이상 (현재 ${have}/5)`]}if(M.stone<g.s||!secondaryHave(M,g))return[false,'개방 재료 부족'];return[true,'개방 가능']}
function unlockArea(id){const M=ensure(state());const[ok,why]=canUnlockArea(M,id);if(!ok){notice.textContent=why;return}if(M.unlocked?.[id]){debug.selectArea(id);scheduleRender();return}const g=AREA_UNLOCKS[id];M.stone-=g.s;secondarySpend(M,g);M.unlocked[id]=1;M.area=id;debug.replaceState(M);scheduleRender()}
function addCss(){if($('#v1117style'))return;const s=document.createElement('style');s.id='v1117style';s.textContent=`.tabs.v1117-tabs{grid-template-columns:repeat(3,1fr)}.v1117-hide,.tab-btn[data-tab="areas"],[data-panel="areas"]{display:none!important}.asc-section{margin-top:0}.asc-viewport,.map-viewport{position:relative;height:clamp(380px,52dvh,560px);overflow:hidden;border:1px solid #31474a;border-radius:12px;touch-action:none;cursor:grab;-webkit-user-select:none;user-select:none}.asc-viewport.dragging,.map-viewport.dragging{cursor:grabbing}.asc-viewport{background:radial-gradient(circle at 50% 100%,#21423899,#091317 54%,#071014)}.map-viewport{background:linear-gradient(160deg,#1b2019,#111a1c 48%,#17151a)}.asc-world,.map-world{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform}.asc-svg,.map-svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}.asc-line{fill:none;stroke:#405c53;stroke-width:3;opacity:.72}.asc-line.on{stroke:#67b295}.asc-line.branch{stroke-width:2}.asc-line.gate{stroke:#a88e50;stroke-dasharray:8 6}.asc-node{position:absolute;transform:translate(-50%,-50%);margin:0;border:1px solid #43575a;background:#111d22;color:#7e918d;box-shadow:0 5px 15px #0007}.asc-stage{width:68px;height:68px;border-radius:50%;display:grid;place-items:center;text-align:center;padding:5px}.asc-stage b{display:block;font:700 11px serif}.asc-stage small{font-size:7px}.asc-stage.on{border-color:#65ad94;background:#17362e;color:#ddf5eb}.asc-stage.current{outline:2px solid #edf7f2;outline-offset:4px}.asc-stage.available{border-color:#c8aa55;color:#ffe7a3}.asc-stage.root{width:82px;height:82px;border-color:#9c8550;background:#302a1b;color:#ffe8a1}.asc-leaf{width:50px;height:50px;padding:0;clip-path:polygon(28% 0,72% 0,100% 28%,100% 72%,72% 100%,28% 100%,0 72%,0 28%);display:grid;place-items:center}.asc-leaf .glyph{font:800 19px serif}.asc-leaf .mark{position:absolute;right:2px;bottom:2px;min-width:15px;height:14px;border:1px solid #50636a;border-radius:99px;background:#071014dd;font-size:7px}.asc-leaf.ready{border-color:#c8aa55;color:#f4dfa0}.asc-leaf.done{border-color:#5fae92;background:#17372f;color:#d4f3e8}.asc-leaf.locked{opacity:.42}.camera{position:absolute;z-index:10;right:7px;top:7px;display:flex;gap:3px;padding:3px;border:1px solid #344a4c;border-radius:9px;background:#081216dd}.camera button{width:31px;height:29px;margin:0;padding:0;border:1px solid #3b5153;border-radius:6px;background:#152529}.camera button:nth-child(2){width:44px;font-size:8px}.detail{margin-top:8px;padding:9px;border:1px solid #354c4c;border-radius:10px;background:#0d191d;min-height:88px}.detail-action{width:100%;min-height:37px;margin-top:7px;border:1px solid #647b67;border-radius:8px;background:#23463b}.detail-action.ready{border-color:#b79b4d;background:#4a3e20}.node-kicker{font-size:8px;color:#82938f}.node-effect{font-size:13px;line-height:1.32;font-weight:800;color:#edf7f2;margin:5px 0 7px}.node-expect{font-size:9px;line-height:1.35;color:#c8d8d3}.cost-row{display:flex;gap:5px;flex-wrap:wrap;margin-top:6px}.cost-chip{display:inline-flex;align-items:center;gap:3px;padding:3px 6px;border:1px solid #425055;border-radius:999px;background:#10191d;font-size:9px;font-weight:750}.cost-chip i{font-style:normal}.cost-chip.stone{color:#f2d47d;border-color:#806f3f}.cost-chip.herb.g0{color:#70d6a3;border-color:#39775a}.cost-chip.herb.g1{color:#72b8f0;border-color:#3f7198}.cost-chip.herb.g2{color:#c895f2;border-color:#765592}.cost-chip.free{color:#8da09c}.map-world{width:1760px;height:860px}.map-zone{position:absolute;border:1px solid #66735b44;background:#24302422}.map-zone span{position:absolute;font:700 13px serif;color:#9eab8c88}.map-route{fill:none;stroke:#8c886c;stroke-width:6;opacity:.38}.map-route.on{stroke:#77ad91;opacity:.72}.map-route.gate{stroke:#c0a55e;stroke-dasharray:11 8}.map-node{position:absolute;transform:translate(-50%,-50%);margin:0;border:1px solid #4a5550;background:#131b1b;color:#89928c}.map-root{width:88px;height:70px;border-radius:45%;padding:3px}.map-root b{display:flex;align-items:center;justify-content:center;gap:3px;font-size:9px}.area-symbol{width:34px;height:34px;object-fit:contain;filter:saturate(.78)}.map-root.on,.map-point.on{border-color:#5fae92;background:#17372f;color:#d4f3e8}.map-root.current{outline:2px solid #f0f3da}.map-point{width:45px;height:45px;border-radius:50%}.map-point .rank{position:absolute;right:-4px;bottom:-4px;font-size:7px}.map-point.available{border-color:#c5a957}.map-point.locked{opacity:.44}.map-gate{width:58px;height:42px;border-radius:12px;border-color:#a58c4c;background:#312a1b}.expedition-area-picker{margin:8px 0 6px;padding:7px;border:1px solid #32474c;border-radius:10px}.expedition-area-head{display:flex;justify-content:space-between}.expedition-area-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}.expedition-area-btn{min-height:48px;border:1px solid #354b50;border-radius:8px;background:#122026}.expedition-area-btn .area-symbol{display:block;width:25px;height:25px;margin:auto}.expedition-area-btn.active{border-color:#63ac96;background:#1b443b}.expedition-plan-label{margin:5px 0}.dev-milestones{margin-top:10px}.dev-milestone-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}@media(max-width:560px){.asc-viewport,.map-viewport{height:410px}.asc-leaf{width:46px;height:46px}}`;document.head.appendChild(s)}
function camera(view,world,w,h){
  const min=.22,max=1.7;
  const read=()=>{
    try{
      const raw=getComputedStyle(world).transform;
      if(raw&&raw!=='none'){
        const m=new DOMMatrixReadOnly(raw),s=Math.hypot(m.a,m.b)||1;
        return{x:m.e,y:m.f,s:Math.max(min,Math.min(max,s))};
      }
    }catch(_){}
    return{x:0,y:0,s:.6};
  };
  const apply=(x,y,s)=>{world.style.transform=`translate(${x}px,${y}px) scale(${s})`};
  const focus=(x,y,s=.68)=>{
    const r=view.getBoundingClientRect();if(r.width<40)return;
    const ns=Math.max(min,Math.min(max,s));
    apply(r.width/2-x*ns,r.height/2-y*ns,ns);
  };
  const fit=()=>{
    const r=view.getBoundingClientRect();if(r.width<40)return;
    const ns=Math.max(min,Math.min(.82,(r.width-18)/w,(r.height-18)/h));
    apply((r.width-w*ns)/2,(r.height-h*ns)/2,ns);
  };
  const zoom=f=>{
    const r=view.getBoundingClientRect();if(r.width<40)return;
    const cur=read(),cx=r.width/2,cy=r.height/2,wx=(cx-cur.x)/cur.s,wy=(cy-cur.y)/cur.s;
    const ns=Math.max(min,Math.min(max,cur.s*f));
    apply(cx-wx*ns,cy-wy*ns,ns);
  };
  // Pointer drag/pinch/tap ownership intentionally lives only in
  // tree_camera_gesture_v11_44.js. The old duplicate listeners here could retain
  // stale suppress/pointer state after a breakthrough re-render and swallow every
  // newly-created training-node click until a page refresh.
  return{focus,fit,zoom};
}
function svgPath(svg,a,b,cls='asc-line'){const p=document.createElementNS('http://www.w3.org/2000/svg','path'),mx=(a.y+b.y)/2;p.setAttribute('d',`M ${a.x} ${a.y} C ${a.x} ${mx}, ${b.x} ${mx}, ${b.x} ${b.y}`);p.setAttribute('class',cls);svg.appendChild(p)}function mapPath(svg,a,b,cls='map-route'){const ns='http://www.w3.org/2000/svg',g=document.createElementNS(ns,'g');g.setAttribute('class',cls);for(const[k,w]of[['glow',9],['color',3],['core',1]]){const l=document.createElementNS(ns,'line');l.setAttribute('x1',a.x);l.setAttribute('y1',a.y);l.setAttribute('x2',b.x);l.setAttribute('y2',b.y);l.setAttribute('class','route-'+k);l.setAttribute('stroke-width',w);l.setAttribute('stroke-linecap','round');g.appendChild(l)}svg.appendChild(g)}
function setupTabs(){const tabs=$('.tabs');tabs.className='tabs v1117-tabs';const train=$('.tab-btn[data-tab="train"]'),skills=$('.tab-btn[data-tab="skills"]'),areas=$('.tab-btn[data-tab="areas"]'),tree=$('.tab-btn[data-tab="tree"]');train.textContent='수련';skills.textContent='법술';tree.textContent='비경 지도';areas.classList.add('v1117-hide');$('[data-panel="areas"]')?.classList.add('v1117-hide');train.parentElement.style.gridTemplateColumns='repeat(3,1fr)';const tp=$('[data-panel="train"]');tp.querySelector('#breakthrough')?.closest('.section')?.classList.add('v1117-hide');tp.querySelector('.train-grid')?.closest('.section')?.classList.add('v1117-hide');tp.querySelector('.asc-section')?.remove();const sec=document.createElement('div');sec.className='section asc-section';sec.innerHTML=`<div class="section-head"><b>수련 도맥</b><span class="small">위로 오를수록 갈래가 늘어남</span></div><div id="ascViewport" class="asc-viewport"><div id="ascWorld" class="asc-world" style="width:1200px;height:${TRAIN_WORLD_H}px"><svg class="asc-svg" viewBox="0 0 1200 ${TRAIN_WORLD_H}"></svg></div><div class="camera"><button data-c="out">−</button><button data-c="fit">전체</button><button data-c="in">＋</button></div></div><div id="ascDetail" class="detail"></div>`;tp.prepend(sec);trainCam=camera($('#ascViewport'),$('#ascWorld'),1200,TRAIN_WORLD_H);sec.querySelector('[data-c="out"]').onclick=()=>trainCam.zoom(1/1.2);sec.querySelector('[data-c="fit"]').onclick=trainCam.fit;sec.querySelector('[data-c="in"]').onclick=()=>trainCam.zoom(1.2);const tr=$('[data-panel="tree"]');tr.innerHTML=`<div class="section"><div class="section-head"><b>비경 개척 지도</b><span class="small">한 손가락 드래그로 이동 · 노드 탭으로 상세</span></div><div id="mapViewport" class="map-viewport"><div id="mapWorld" class="map-world"><svg class="map-svg" viewBox="0 0 1760 860"></svg></div><div class="camera"><button data-m="out">−</button><button data-m="fit">전체</button><button data-m="in">＋</button></div></div><div id="mapDetail" class="detail"></div></div>`;mapCam=camera($('#mapViewport'),$('#mapWorld'),1760,860);tr.querySelector('[data-m="out"]').onclick=()=>mapCam.zoom(1/1.2);tr.querySelector('[data-m="fit"]').onclick=mapCam.fit;tr.querySelector('[data-m="in"]').onclick=()=>mapCam.zoom(1.2)}
function ascNode(w,o,f){const b=document.createElement('button');b.className=`asc-node ${o.cls||''}`;b.dataset.nodeId=o.id||'';b.style.left=o.x+'px';b.style.top=o.y+'px';b.innerHTML=o.html;b.onclick=e=>{e.stopPropagation();f?.()};w.appendChild(b);return b}function stageY(i){return TRAIN_ROOT_Y-140-i*140}
function renderTraining(){const M=ensure(state()),w=$('#ascWorld');if(!w)return;const svg=w.querySelector('svg');w.querySelectorAll('.asc-node').forEach(e=>e.remove());svg.innerHTML='';const root={x:CENTER_X,y:TRAIN_ROOT_Y};ascNode(w,{...root,id:'root',cls:`asc-stage root ${M.realm.major<0?'current':''}`,html:'<b>凡 · 범인</b><small>시작점</small>'},()=>{selectedTrain={type:'root'};renderTrainDetail()});TRAIN.forEach((st,i)=>{const y=stageY(i),open=reached(M,st.req),cur=M.realm.major===st.req.major&&M.realm.stage===st.req.stage,status=stageStatus(i),center={x:CENTER_X,y};svgPath(svg,i?{x:CENTER_X,y:stageY(i-1)}:root,center,`asc-line ${open?'on':status.can?'gate':''}`);const spread=Math.min(390,150+i*22);ascNode(w,{...center,id:`stage-${i}`,cls:`asc-stage ${open?'on':status.can?'available':'locked'} ${cur?'current':''}`,html:`<b>${st.name}</b><small>${completed(M,st)}/${st.nodes.length}</small>`},()=>{selectedTrain={type:'stage',idx:i};renderTrainDetail()});const n=st.nodes.length;st.nodes.forEach((r,j)=>{const d=NODE[r.id],t=n===1?0:j/(n-1)*2-1,p={x:CENTER_X+t*spread,y:y-50-40*(1-Math.abs(t))},done=!!M.trainingNodes?.[d.id],[can]=canBuyTrain(M,d);svgPath(svg,center,p,`asc-line branch ${done?'on':''}`);ascNode(w,{...p,id:d.id,cls:`asc-leaf ${done?'done':can?'ready':'locked'}`,html:`<span class="glyph">${d.glyph}</span><span class="mark">${done?'✓':can?'＋':'·'}</span>`},()=>{selectedTrain={type:'node',id:d.id};renderTrainDetail()})})});renderTrainDetail()}
function renderTrainDetail(){const M=ensure(state()),b=$('#ascDetail');if(!b)return;if(selectedTrain.type==='root'){const s=stageStatus(0),cost=breakthroughCost(TRAIN[0]);b.innerHTML=`<div class="node-kicker">凡 · 범인</div><div class="node-effect">영초를 모아 수선에 입문한다.</div><div class="node-expect">${s.text}</div><div class="cost-row">${costHtml(cost)}</div>`;if(s.can){const x=document.createElement('button');x.className='detail-action ready';x.textContent='수선 입문';x.onclick=()=>breakthrough(0);b.appendChild(x)}return}if(selectedTrain.type==='stage'){const i=selectedTrain.idx,st=TRAIN[i],cur=currentStageIndex(M),cnt=completed(M,st),ss=stageStatus(i);let targetIndex=-1;if(i===cur&&i+1<TRAIN.length)targetIndex=i+1;else if(i===cur+1)targetIndex=i;const target=targetIndex>=0?TRAIN[targetIndex]:null,targetStatus=target?stageStatus(targetIndex):null,targetCost=target?breakthroughCost(target):null;b.innerHTML=`<div class="node-kicker">${st.name} · ${cnt}/${st.nodes.length}</div><div class="node-effect">${i===cur?'현재 경지의 수련 가지를 선택한다.':i<cur?'이미 도달한 경지':'다음 경지로 돌파한다.'}</div><div class="node-expect"><b>현재 상태 · ${targetStatus?targetStatus.text:ss.text}</b></div>${target?`<div class="node-expect"><b>${target.name} 돌파 비용</b></div><div class="cost-row">${costHtml(targetCost)}</div>`:''}`;if(target){const x=document.createElement('button');x.className=`detail-action ${targetStatus?.can?'ready':''}`;x.disabled=!targetStatus?.can;x.textContent=targetStatus?.can?`${target.name} 돌파`:targetStatus?.text||'돌파 불가';x.onclick=()=>breakthrough(targetIndex);b.appendChild(x)}return}const n=NODE[selectedTrain.id],[can,why]=canBuyTrain(M,n),done=!!M.trainingNodes?.[n.id];b.innerHTML=`<div class="node-kicker">${n.stage.name} · ${n.name}</div><div class="node-effect">${n.desc}</div><div class="node-expect">${Object.keys(n.effect||{}).length?effectText(n.effect):"시스템 효과"}<br>현재 상태 · ${why}</div><div class="cost-row">${done?'<span class="cost-chip free">✓ 수련 완료</span>':costHtml(n.cost)}</div>`;const x=document.createElement('button');x.className=`detail-action ${can?'ready':''}`;x.disabled=!can;x.textContent=done?'완료':can?'수련':why;x.onclick=()=>buyTrain(n.id);b.appendChild(x)}function focusTraining(){const M=state(),i=currentStageIndex(M);trainCam?.focus(CENTER_X,i<0?TRAIN_ROOT_Y:stageY(i),.65)}
function region(w,id){const m=MAP[id],a=C.AREAS.find(x=>x.id===id),d=document.createElement('div');d.className='map-zone';d.style.cssText=`left:${m.region.x}px;top:${m.region.y}px;width:${m.region.w}px;height:${m.region.h}px`;d.innerHTML=`<span>${a.name}</span>`;w.appendChild(d)}function mapNode(w,o,f){const b=document.createElement('button');b.className=`map-node ${o.cls||''}`;b.dataset.area=o.area||'';b.dataset.affinity=o.id||'';b.style.left=o.x+'px';b.style.top=o.y+'px';b.innerHTML=o.html||'';if(o.label){b.setAttribute('aria-label',o.label);b.title=o.label}b.onclick=e=>{e.stopPropagation();f?.()};w.appendChild(b);return b}
function renderMap(){const M=ensure(state()),w=$('#mapWorld');if(!w)return;const svg=w.querySelector('svg');w.querySelectorAll('.map-zone,.map-node').forEach(e=>e.remove());svg.innerHTML='';for(const a of C.AREAS){const m=MAP[a.id],u=!!M.unlocked?.[a.id],cur=M.area===a.id;mapNode(w,{...m.root,area:a.id,cls:`map-root area-${a.id} ${u?'on':'locked'} ${cur?'current':''}`,html:'',label:a.name},()=>{selectedMap={type:'area',area:a.id};renderMapDetail()});for(const br of BRANCHES[a.id])C.TREE[br].forEach((d,i)=>{const p=m.branches[br][i],prev=i?m.branches[br][i-1]:m.root,l=zoneRank(M,a.id,d.id),[can]=canAffinity(M,a.id,d);mapPath(svg,prev,p,`map-route area-${a.id} ${l?'on':can?'available':'locked'}`);mapNode(w,{...p,area:a.id,id:d.id,cls:`map-point area-${a.id} ${l?'on':can?'available':'locked'}`,html:'',label:`${a.name} · ${areaNodeName(a.id,d)} · ${l}/5`},()=>{selectedMap={type:'node',area:a.id,id:d.id};renderMapDetail()})})}for(const[from,to]of[['qingyun','blackwind'],['blackwind','blood'],['blood','foundation_trial'],['foundation_trial','thunder'],['thunder','marsh'],['marsh','taixu']]){const p=MAP[from].gate[to],[can]=canUnlockArea(M,to),u=!!M.unlocked?.[to]&&can,cls=`map-route gate ${u?'on':can?'available':'locked'}`;mapPath(svg,MAP[from].root,p,cls);mapPath(svg,p,MAP[to].root,cls);mapNode(w,{...p,area:to,cls:`map-gate ${u?'on':can?'available':'locked'}`,html:'<span class="gate-mark"><i class="roof"></i><i class="beam"></i><i class="post p1"></i><i class="post p2"></i></span>',label:`관문 · ${C.AREAS.find(a=>a.id===to).name}`},()=>{selectedMap={type:'unlock',area:to};renderMapDetail()})}renderMapDetail()}
function renderMapDetail(){const M=ensure(state()),b=$('#mapDetail'),s=selectedMap,a=C.AREAS.find(x=>x.id===s.area);if(!b||!a)return;if(s.type==='area'){const resourceHint=s.area==='marsh'?'<br><b>자운정수 획득</b> · 폭렬 요기→균열석갑충, 호령 요기→묵령원, 호체 요기→옥린천산갑. 각 특수요수 처치 시 +1.':'';b.innerHTML=`<div class="node-kicker">${a.name}</div><div class="node-effect">${a.desc}</div><div class="node-expect">${M.unlocked?.[s.area]?'개방된 비경 · 언제든 재입장 가능':'아직 개방되지 않음'}${resourceHint}</div>`;if(M.unlocked?.[s.area]&&M.area!==s.area){const x=document.createElement('button');x.className='detail-action ready';x.textContent='원정지로 선택';x.onclick=()=>unlockArea(s.area);b.appendChild(x)}return}if(s.type==='unlock'){const g=AREA_UNLOCKS[s.area],[can,why]=canUnlockArea(M,s.area),opened=!!M.unlocked?.[s.area]&&can,prereqs=areaPrereqLines(M,s.area);if(opened){b.innerHTML=`<div class="node-kicker">관문 · ${g.label}</div><div class="node-effect">이미 열린 관문입니다.</div><div class="node-expect">개방 완료 · 비경 선택 화면에서 언제든 이 원정지를 선택할 수 있습니다.${prereqs.length?'<br>선행 조건 · '+prereqs.join('<br>'):''}</div><div class="cost-row"><span class="cost-chip free">✓ 개방 완료</span></div>`;return}b.innerHTML=`<div class="node-kicker">관문 · ${g.label}</div><div class="node-effect">새 비경과 새로운 개척 계통을 연다.</div><div class="node-expect"><b>현재 상태 · ${why}</b>${prereqs.length?'<br><br><b>선행 개척 조건</b><br>'+prereqs.join('<br>'):''}<br>경지 조건 · ${realmLabel(g.req)}</div><div class="cost-row">${costHtml(g)}</div>`;const x=document.createElement('button');x.className=`detail-action ${can?'ready':''}`;x.disabled=!can;x.textContent='관문 개방';x.onclick=()=>unlockArea(s.area);b.appendChild(x);return}const d=Object.values(C.TREE).flat().find(x=>x.id===s.id),l=zoneRank(M,s.area,s.id),[can,why]=canAffinity(M,s.area,d),c=affinityCost(M,s.area,d),pre=affinityPrereqText(M,s.area,d);b.innerHTML=`<div class="node-kicker">${a.name} · ${areaNodeName(s.area,d)} · ${l}/5</div><div class="node-effect">${AFF_HINT[d.id]||d.d}</div><div class="node-expect">다음 단계 기대 효과 · ${d.d}${pre?'<br><b>'+pre+'</b>':''}<br>현재 상태 · ${why}</div><div class="cost-row">${l>=5?'<span class="cost-chip free">✓ 완성</span>':costHtml(c)}</div>`;const x=document.createElement('button');x.className=`detail-action ${can?'ready':''}`;x.disabled=!can;x.textContent=l>=5?'완성':`${l+1}/5 개척`;x.onclick=()=>buyAffinity(s.area,s.id);b.appendChild(x)}function focusMap(){const p=MAP[state().area]?.root||MAP.qingyun.root;mapCam?.focus(p.x,p.y,.72)}
function areaPicker(){const plans=$('#planChoices');if(!plans)return null;let w=$('#expeditionAreaPicker');if(!w){w=document.createElement('div');w.id='expeditionAreaPicker';w.className='expedition-area-picker';w.innerHTML='<div class="expedition-area-head"><b>원정 비경</b></div><div class="expedition-area-grid"></div>';plans.parentNode.insertBefore(w,plans);const l=document.createElement('div');l.className='expedition-plan-label';l.textContent='탐색 방법 선택';plans.parentNode.insertBefore(l,plans)}return w}function renderAreaPicker(force=false){const w=areaPicker();if(!w)return;const sh=snap(),M=sh.M,areas=C.AREAS,sig=`${M.area}|${sh.phase}|${M.events?.foundationTrialCompleted?1:0}|${areas.map(a=>`${a.id}:${M.unlocked?.[a.id]?1:0}`).join(',')}`;if(!force&&sig===pickerSignature)return;pickerSignature=sig;const g=w.querySelector('.expedition-area-grid');g.replaceChildren();for(const a of areas){const[accessible,why]=canUnlockArea(M,a.id),unlocked=!!M.unlocked?.[a.id]&&accessible,b=document.createElement('button');b.className='expedition-area-btn'+(M.area===a.id?' active':'')+(unlocked?'':' locked');b.disabled=sh.phase==='run'||!unlocked;b.setAttribute('aria-disabled',String(b.disabled));if(!unlocked)b.title=why||'비경 지도에서 관문을 개방하면 선택할 수 있습니다.';b.innerHTML=`${areaIcon(a.id)}${a.name}`;b.onclick=()=>{if(!unlocked)return;debug.selectArea(a.id);pickerSignature='';scheduleRender()};g.appendChild(b)}}
function applyRunBalance(){}function restoreRunBalance(){}function bindRunBalance(){}
const FOUNDATION_TIMING=[
  {id:'f1',stage:1,area:'thunder',gross:2718.76,targetRuns:16},{id:'f2',stage:2,area:'thunder',gross:3250,targetRuns:16},{id:'f3',stage:3,area:'thunder',gross:3900,targetRuns:17},
  {id:'f4',stage:4,area:'marsh',gross:4800,targetRuns:17},{id:'f5',stage:5,area:'marsh',gross:5900,targetRuns:18},{id:'f6',stage:6,area:'marsh',gross:7200,targetRuns:18},
  {id:'f7',stage:7,area:'taixu',gross:8800,targetRuns:18},{id:'f8',stage:8,area:'taixu',gross:10800,targetRuns:19},{id:'f9',stage:9,area:'taixu',gross:13200,targetRuns:20}
];
function presetAreaFor(stage){
  if(stage.req.major===0){
    if(stage.req.stage>=9)return'foundation_trial';
    if(stage.req.stage>=6)return'blood';
    if(stage.req.stage>=3)return'blackwind';
    return'qingyun';
  }
  if(stage.req.major===1){
    if(stage.req.stage>=7)return'taixu';
    if(stage.req.stage>=4)return'marsh';
    return'thunder';
  }
  return'qingyun';
}
const PRESETS=Object.fromEntries(TRAIN.map((stage,idx)=>{
  const area=presetAreaFor(stage);
  const areaName={qingyun:'청운산',blackwind:'흑풍곡',blood:'적혈비경',foundation_trial:'축기 시련',thunder:'천뢰봉',marsh:'자운택',taixu:'태허유적'}[area]||area;
  return[stage.id,{label:`${stage.name} · ${areaName}`,idx,area}];
}));
const PRESET_ART_REQ={
  shield:[{major:1,stage:1},{major:1,stage:2},{major:1,stage:4},{major:1,stage:8},{major:1,stage:9}],
  dash:[{major:1,stage:1},{major:1,stage:3},{major:1,stage:6},{major:1,stage:7},{major:1,stage:9}],
  burst:[{major:1,stage:3},{major:1,stage:5},{major:1,stage:7},{major:1,stage:8},{major:1,stage:9}]
};
function presetSpellCap(M,s){
  if(!reached(M,s.req))return 0;
  if(s.id==='thunder'&&(M.realm?.major??-1)>0)return 5;
  if((M.realm?.major??-1)>s.req.major)return 5;
  return Math.max(1,Math.min(5,(M.realm?.stage||0)-s.req.stage+1));
}
function presetUnlockedAreas(M){
  const out=['qingyun'];
  for(const id of ['blackwind','blood','foundation_trial','thunder','marsh','taixu']){
    const g=AREA_UNLOCKS[id];
    if(g&&reached(M,g.req))out.push(id);
  }
  return out;
}
function jumpPreset(id){
  const p=PRESETS[id];if(!p||snap().phase==='run')return;
  const M=ensure(state()),target=TRAIN[p.idx];
  M.realm={...target.req};

  // "막 도착한 경지" 기준: 이전 경지 수련만 완료하고 현재 경지는 0부터 시작.
  M.cult={atk:1,mov:150,sen:1,hp:90,basicRange:0,basicHits:0};
  M.trainingNodes={};
  for(let i=0;i<p.idx;i++)for(const n of TRAIN[i].nodes){M.trainingNodes[n.id]=1;applyCult(M,n.effect)}

  // 법술/기법은 이 경지에서 정상적으로 도달 가능한 상한까지만 세팅.
  M.skillUnlocks={};M.skills={};
  for(const s of SPELLS()){
    const cap=presetSpellCap(M,s),known=cap>0;
    if(known)M.skillUnlocks[s.id]=1;
    M.skills[s.id]={u:known?1:0,pow:cap,range:0,cycle:0};
  }
  M.skills[BASIC_ID]={u:1,pow:0,range:0,cycle:0};
  M.formationSkills={version:1,daoMarks:0,ranks:{},traits:{}};
  for(const [art,reqs] of Object.entries(PRESET_ART_REQ)){
    M.formationSkills.ranks[art]=reqs.reduce((n,req)=>n+(reached(M,req)?1:0),0);
  }

  // 현재 경지에서 자연스럽게 열 수 있는 비경/개척만 해금하고, 가능한 노드는 현 경지 상한까지.
  const unlocked=presetUnlockedAreas(M);
  M.unlocked={};for(const a of unlocked)M.unlocked[a]=1;
  M.area=p.area;
  for(const a of C.AREAS){
    M.zones[a.id]??={tree:{}};
    M.zones[a.id].tree={};
    if(!M.unlocked[a.id])continue;
    for(const br of (BRANCHES[a.id]||[]))for(const d of (C.TREE[br]||[])){
      M.zones[a.id].tree[d.id]=reached(M,nodeReq(a.id,d))?5:0;
    }
  }

  // 축기 진입 이후 프리셋은 시련/실마리를 이미 통과한 상태로 본다.
  const foundation=M.realm.major>=1;
  M.events={...(M.events||{}),foundationInsight:foundation?1:0,foundationTrialCompleted:foundation?1:0};

  // 테스트 시작 자본은 항상 0. 도흔 포함 모든 성장 재화를 비운다.
  M.stone=0;M.herb=0;M.herb2=0;M.herb3=0;
  M.thunderMark=0;M.purpleEssence=0;M.taixuSigil=0;
  M.formationSkills.daoMarks=0;
  M.mastery={version:2,areas:{}};
  window.__xianxiaMastery?.ensure?.(M);

  debug.replaceState(M);
  document.dispatchEvent(new CustomEvent('xianxia:dev-preset-applied',{detail:{id,realm:{...M.realm},area:M.area,capital:0}}));
  scheduleRender();
}
function timingReport(){return FOUNDATION_TIMING.map(row=>({...row,runSeconds:window.__xianxiaFoundationContent?.runLimit?.(row.area,{major:1,stage:row.stage})||25,totalCombatMinutes:+(row.targetRuns*25/60).toFixed(2),netPerRun:+(row.gross*.93).toFixed(2)}))}
function devTools(){
  const d=$('details.dev');if(!d)return;d.querySelector('.dev-milestones')?.remove();
  const w=document.createElement('div');w.className='dev-milestones';
  w.innerHTML='<b>경지 테스트 프리셋</b><div class="small" style="margin:4px 0 7px">이전 경지 수련 완료 · 현재 경지 수련 0 · 해당 경지에서 가능한 법술/기법/개척만 상한 적용 · 영석/영초/특수재료/도흔 0</div><div class="dev-milestone-grid"></div><b style="display:block;margin-top:10px">축기 체류 시간 기준</b><div class="dev-timing" style="display:grid;grid-template-columns:auto 1fr auto;gap:4px 7px;align-items:center;margin-top:5px;padding:7px;border:1px solid #33484f;border-radius:8px"></div>';
  for(const[id,p]of Object.entries(PRESETS)){const b=document.createElement('button');b.textContent=p.label;b.onclick=()=>jumpPreset(id);w.querySelector('.dev-milestone-grid').appendChild(b)}
  w.querySelector('.dev-timing').innerHTML=timingReport().map(row=>`<span>축기 ${row.stage}층</span><b>${row.runSeconds}초 × ${row.targetRuns}판</b><em style="font-style:normal;color:#dfc77f">${row.totalCombatMinutes}분</em>`).join('');d.appendChild(w);
}
function guidance(){const sh=snap(),M=ensure(sh.M);if(sh.phase==='run')return{type:'run',text:'화면을 탭하거나 드래그해 이동하세요. 공격 예고 범위를 읽고 귀환진으로 돌아오면 됩니다.'};if(M.realm.major<0&&M.herb>=8)return{type:'train',selector:'[data-node-id="root"]',text:'수선 입문 재료가 모였습니다. 수련 탭을 열고 범인 노드를 눌러 입문하세요.'};const sword=SPELLS().find(s=>s.id==='sword');if(M.realm.major>=0&&!M.skillUnlocks?.sword&&sword&&M.stone>=sword.unlock.s&&herbHave(M,sword.grade)>=sword.unlock.h)return{type:'skill',skill:'sword',text:'어검술 전승 비용이 모였습니다. 법술 탭에서 어검술을 해금하세요.'};const cur=currentStageIndex(M);if(cur>=0&&cur+1<TRAIN.length&&stageStatus(cur+1).can)return{type:'train',selector:`[data-node-id="stage-${cur+1}"]`,text:`${TRAIN[cur+1].name} 돌파 준비가 끝났습니다.`};for(const id of ['blackwind','blood','foundation_trial','thunder','marsh','taixu']){const[can]=canUnlockArea(M,id);if(can&&!M.unlocked?.[id])return{type:'map',area:id,text:`${C.AREAS.find(a=>a.id===id).name} 관문을 개방할 수 있습니다.`}}return null}
function ensureModernShell(){
  const areasTab=$('.tab-btn[data-tab="areas"]'),areasPanel=$('[data-panel="areas"]');
  areasTab?.classList.add('v1117-hide');areasPanel?.classList.add('v1117-hide');
  if(!$('#ascWorld')||!$('#mapWorld')){
    try{setupTabs()}catch(err){console.error('[progression] shell restore failed',err)}
  }
}
function renderAll(){
  ensureModernShell();
  for(const [name,fn] of [['training',renderTraining],['map',renderMap],['picker',renderAreaPicker],['dev',devTools]]){
    try{fn()}catch(err){console.error('[progression] '+name+' render failed',err)}
  }
  document.dispatchEvent(new CustomEvent('xianxia:progression-rendered',{detail:{source:'progression-runtime'}}))
}
function scheduleRender(){if(renderQueued)return;renderQueued=true;requestAnimationFrame(()=>{renderQueued=false;renderAll()})}
function observe(){for(const e of[$('#realm'),$('#stone'),$('#herb'),$('#area')])if(e)new MutationObserver(scheduleRender).observe(e,{childList:true,characterData:true,subtree:true})}
function exposeProgression(){
  window.__xianxiaProgression={version:'11.51.1',trainingPath:TRAIN,render:renderAll,buyStageTraining:buyTrain,breakthroughStage:breakthrough,buyAffinity,unlockArea,focusStageTraining:focusTraining,focusCurrentRealm:focusMap,jumpMilestone:jumpPreset,timingReport,costHtml,effectText,guidance,spellList:SPELLS,BASIC_ID};
}
addCss();
try{setupTabs()}catch(err){console.error('[progression] initial shell setup failed',err)}
exposeProgression();
try{normalizeSkillUnlocks()}catch(err){console.error('[progression] save normalization failed',err)}
try{bindRunBalance()}catch(err){console.error('[progression] run-balance bind failed',err)}
try{observe()}catch(err){console.error('[progression] observer bind failed',err)}
renderAll();
requestAnimationFrame(()=>{try{focusTraining()}catch{}try{focusMap()}catch{}});
setTimeout(()=>{ensureModernShell();renderAll()},120);
})();

//# sourceURL=progression_runtime_v11_45.js
