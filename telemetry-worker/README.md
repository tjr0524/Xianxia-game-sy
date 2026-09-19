# Xianxia telemetry Worker

Cloudflare Worker: `xianxia-telemetry-api`  
D1 binding: `DB`

## Dashboard deployment
1. Workers & Pages → `xianxia-telemetry-api`
2. Keep the existing D1 binding named `DB`
3. Edit code → replace Hello World with `worker.js`
4. Deploy
5. Open `/health` and then `/stats?days=7`

The Worker auto-creates tables on the first request. `schema.sql` is kept for manual recovery.

Collected data is anonymous expedition telemetry only: run outcome, area/realm, node ranks, kills, loot, damage, skill contribution, and coarse performance counters. The Worker does not store names, email addresses, save data, raw IP addresses, or full user-agent strings.
