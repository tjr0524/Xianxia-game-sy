# Telemetry 확인

Worker 배포 후:

- Health: `https://xianxia-telemetry-api.tjr0524.workers.dev/health`
- 7일 요약: `https://xianxia-telemetry-api.tjr0524.workers.dev/stats?days=7`

정상 Health 예:
```json
{"ok":true,"service":"xianxia-telemetry","schema":1,"runs":3}
```

D1 Console에서 최근 원정:
```sql
SELECT created_at, game_version, area, realm_name, end_reason,
       duration_ms, kills_total, stone_gross, damage_taken,
       death_source, avg_fps, min_fps
FROM runs
ORDER BY created_at DESC
LIMIT 30;
```

법술별 기여:
```sql
SELECT created_at, area, skill_damage_json, skill_casts_json
FROM runs
ORDER BY created_at DESC
LIMIT 20;
```

클라이언트는 원정 중 서버 요청을 반복하지 않고 로컬에서 집계한 뒤 원정 종료 시 요약 1건을 전송합니다. 전송 실패 시 로컬 큐에 보관하고 다음 온라인 시 재시도합니다.
