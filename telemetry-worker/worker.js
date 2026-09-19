const SCHEMA = `
CREATE TABLE IF NOT EXISTS runs (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  client_started_at TEXT,
  game_version TEXT,
  client_version TEXT,
  area TEXT,
  realm_major INTEGER,
  realm_stage INTEGER,
  realm_name TEXT,
  plan TEXT,
  end_reason TEXT,
  duration_ms INTEGER,
  kills_total INTEGER DEFAULT 0,
  beast_kills INTEGER DEFAULT 0,
  elite_kills INTEGER DEFAULT 0,
  thieves INTEGER DEFAULT 0,
  mined INTEGER DEFAULT 0,
  dodges INTEGER DEFAULT 0,
  best_combo INTEGER DEFAULT 0,
  packs_activated INTEGER DEFAULT 0,
  stone_gross INTEGER DEFAULT 0,
  herb0_gross INTEGER DEFAULT 0,
  herb1_gross INTEGER DEFAULT 0,
  herb2_gross INTEGER DEFAULT 0,
  damage_taken REAL DEFAULT 0,
  death_source TEXT,
  max_enemies INTEGER DEFAULT 0,
  max_hazards INTEGER DEFAULT 0,
  avg_fps REAL,
  min_fps REAL,
  long_frames INTEGER DEFAULT 0,
  eco1 INTEGER DEFAULT 0,
  eco2 INTEGER DEFAULT 0,
  eco3 INTEGER DEFAULT 0,
  unique_rank INTEGER DEFAULT 0,
  skill_damage_json TEXT,
  skill_casts_json TEXT,
  damage_by_source_json TEXT,
  area_tree_json TEXT,
  build_json TEXT,
  device_json TEXT,
  perf_json TEXT
);
CREATE INDEX IF NOT EXISTS idx_runs_created_at ON runs(created_at);
CREATE INDEX IF NOT EXISTS idx_runs_area_created ON runs(area, created_at);
CREATE INDEX IF NOT EXISTS idx_runs_version_created ON runs(game_version, created_at);
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  client_created_at TEXT,
  game_version TEXT,
  client_version TEXT,
  event_type TEXT NOT NULL,
  area TEXT,
  realm_major INTEGER,
  realm_stage INTEGER,
  payload_json TEXT
);
CREATE INDEX IF NOT EXISTS idx_events_type_created ON events(event_type, created_at);
`;

const OFFICIAL_ORIGIN='https://tjr0524.github.io';
let schemaPromise=null;

function originAllowed(origin){
  if(!origin)return true;
  if(origin===OFFICIAL_ORIGIN||origin==='null')return true;
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}
function cors(request){
  const origin=request.headers.get('Origin')||'';
  const h={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Vary':'Origin'};
  if(originAllowed(origin)&&origin)h['Access-Control-Allow-Origin']=origin;
  h['Access-Control-Allow-Methods']='GET,POST,OPTIONS';
  h['Access-Control-Allow-Headers']='Content-Type';
  h['Access-Control-Max-Age']='86400';
  return h;
}
function json(request,data,status=200){return new Response(JSON.stringify(data),{status,headers:cors(request)})}
function txt(v,max=160){return typeof v==='string'?v.slice(0,max):String(v??'').slice(0,max)}
function n(v,min=-1e9,max=1e9){const x=Number(v);return Number.isFinite(x)?Math.max(min,Math.min(max,x)):0}
function i(v,min=-1e9,max=1e9){return Math.round(n(v,min,max))}
function j(v,max=12000){
  try{const s=JSON.stringify(v??{});return s.length<=max?s:JSON.stringify({truncated:true})}
  catch{return '{}'}
}
async function ensureSchema(db){
  if(!schemaPromise)schemaPromise=db.exec(SCHEMA).catch(err=>{schemaPromise=null;throw err});
  return schemaPromise;
}
async function readBody(request){
  const len=Number(request.headers.get('Content-Length')||0);
  if(len>32768)throw new Error('payload_too_large');
  const data=await request.json();
  if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('invalid_json');
  return data;
}
function requireId(value,name){
  const v=txt(value,100);
  if(!/^[A-Za-z0-9_.:-]{8,100}$/.test(v))throw new Error('invalid_'+name);
  return v;
}
async function insertRun(db,p){
  const id=requireId(p.run_id,'run_id'),player=requireId(p.player_id,'player_id');
  await db.prepare(`
    INSERT OR IGNORE INTO runs (
      id,player_id,client_started_at,game_version,client_version,area,realm_major,realm_stage,realm_name,plan,end_reason,duration_ms,
      kills_total,beast_kills,elite_kills,thieves,mined,dodges,best_combo,packs_activated,stone_gross,herb0_gross,herb1_gross,herb2_gross,
      damage_taken,death_source,max_enemies,max_hazards,avg_fps,min_fps,long_frames,eco1,eco2,eco3,unique_rank,
      skill_damage_json,skill_casts_json,damage_by_source_json,area_tree_json,build_json,device_json,perf_json
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).bind(
    id,player,txt(p.client_started_at,40),txt(p.game_version,40),txt(p.client_version,24),txt(p.area,40),
    i(p.realm_major,-1,20),i(p.realm_stage,0,99),txt(p.realm_name,60),txt(p.plan,40),txt(p.end_reason,24),i(p.duration_ms,0,3600000),
    i(p.kills_total,0,100000),i(p.beast_kills,0,100000),i(p.elite_kills,0,10000),i(p.thieves,0,10000),i(p.mined,0,1000000),i(p.dodges,0,100000),
    i(p.best_combo,0,1000),i(p.packs_activated,0,10000),i(p.stone_gross,0,1e9),i(p.herb0_gross,0,1e7),i(p.herb1_gross,0,1e7),i(p.herb2_gross,0,1e7),
    n(p.damage_taken,0,1e9),txt(p.death_source,60),i(p.max_enemies,0,1000),i(p.max_hazards,0,1000),n(p.avg_fps,0,1000),
    p.min_fps==null?null:n(p.min_fps,0,1000),i(p.long_frames,0,100000),i(p.eco1,0,20),i(p.eco2,0,20),i(p.eco3,0,20),i(p.unique_rank,0,20),
    j(p.skill_damage),j(p.skill_casts),j(p.damage_by_source),j(p.area_tree),j(p.build),j(p.device,4000),j(p.perf,4000)
  ).run();
  return id;
}
async function insertEvent(db,p){
  const id=requireId(p.event_id,'event_id'),player=requireId(p.player_id,'player_id'),type=txt(p.event_type,80);
  if(!type)throw new Error('invalid_event_type');
  await db.prepare(`
    INSERT OR IGNORE INTO events (
      id,player_id,client_created_at,game_version,client_version,event_type,area,realm_major,realm_stage,payload_json
    ) VALUES (?,?,?,?,?,?,?,?,?,?)
  `).bind(
    id,player,txt(p.client_created_at,40),txt(p.game_version,40),txt(p.client_version,24),type,txt(p.area,40),
    i(p.realm_major,-1,20),i(p.realm_stage,0,99),j(p.payload)
  ).run();
  return id;
}
async function stats(db,days){
  const modifier='-'+days+' days';
  const total=await db.prepare(`
    SELECT COUNT(*) runs,COUNT(DISTINCT player_id) players,
      ROUND(AVG(duration_ms)/1000.0,1) avg_seconds,ROUND(AVG(kills_total),1) avg_kills,
      ROUND(AVG(avg_fps),1) avg_fps,
      SUM(CASE WHEN end_reason='return' THEN 1 ELSE 0 END) safe_returns,
      SUM(CASE WHEN end_reason='dead' THEN 1 ELSE 0 END) deaths,
      SUM(CASE WHEN end_reason='collapse' THEN 1 ELSE 0 END) collapses
    FROM runs WHERE created_at >= datetime('now', ?)
  `).bind(modifier).first();
  const areas=await db.prepare(`
    SELECT area,COUNT(*) runs,ROUND(AVG(duration_ms)/1000.0,1) avg_seconds,
      ROUND(AVG(kills_total),1) avg_kills,ROUND(AVG(damage_taken),1) avg_damage,
      ROUND(AVG(avg_fps),1) avg_fps
    FROM runs WHERE created_at >= datetime('now', ?)
    GROUP BY area ORDER BY runs DESC
  `).bind(modifier).all();
  return {days,total,areas:areas.results||[]};
}

export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(request.method==='OPTIONS'){
      if(!originAllowed(request.headers.get('Origin')||''))return json(request,{ok:false,error:'origin_not_allowed'},403);
      return new Response(null,{status:204,headers:cors(request)});
    }
    if(!env.DB)return json(request,{ok:false,error:'missing_D1_binding_DB'},500);
    try{await ensureSchema(env.DB)}
    catch(err){return json(request,{ok:false,error:'db_init_failed',detail:txt(err?.message,160)},500)}
    if(request.method==='GET'&&url.pathname==='/health'){
      const row=await env.DB.prepare('SELECT COUNT(*) AS runs FROM runs').first();
      return json(request,{ok:true,service:'xianxia-telemetry',schema:1,runs:i(row?.runs,0,1e9)});
    }
    if(request.method==='GET'&&url.pathname==='/stats'){
      const days=Math.max(1,Math.min(90,i(url.searchParams.get('days')||7,1,90)));
      return json(request,{ok:true,...await stats(env.DB,days)});
    }
    if(request.method==='POST'){
      const origin=request.headers.get('Origin')||'';
      if(!originAllowed(origin))return json(request,{ok:false,error:'origin_not_allowed'},403);
      let p;try{p=await readBody(request)}catch(err){return json(request,{ok:false,error:txt(err?.message,80)},400)}
      try{
        if(url.pathname==='/run')return json(request,{ok:true,id:await insertRun(env.DB,p)},201);
        if(url.pathname==='/event')return json(request,{ok:true,id:await insertEvent(env.DB,p)},201);
      }catch(err){return json(request,{ok:false,error:'invalid_payload',detail:txt(err?.message,160)},400)}
    }
    return json(request,{ok:false,error:'not_found'},404);
  }
};