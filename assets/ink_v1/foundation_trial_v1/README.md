# 축기 시련 에셋 v1

축기 시련을 적혈비경과 분리된 독립 관문으로 구성하기 위한 에셋 묶음이다.

## 파일 구성

- `background/foundation_trial_arena.png`: 세로형 전투 배경, 1024×1536
- `boss/foundation_guardian_sheet_6x4.png`: 축기 수문장 6열×4행 스프라이트 시트, 셀당 256×256
- `boss/frames/`: 시트를 셀 단위로 분리한 PNG 24장
- `boss/foundation_guardian_body_sheet_6x4.png`: 크기 정규화된 본체 전용 시트
- `boss/foundation_guardian_fx_sheet_6x4.png`: 공격 궤적 등 이펙트 전용 시트
- `boss/body_frames/`, `boss/fx_frames/`: 본체·이펙트 분리 프레임
- `boss/foundation_guardian_sprite_manifest.json`: 공통 피벗·스케일·레이어 규칙
- `boss/source_strips_ink/`: 수묵담채 재설계의 행별 생성 원본 4장
- `boss/foundation_guardian_sheet_6x4_original_v1.png`: 잘림 수정 전 원본 보존본
- `boss/foundation_guardian_sheet_6x4_pre_ink_redesign.png`: 수묵담채 재설계 전 시트
- `QA_REPORT.md`: 그리드·투명도·안전 여백 검증 결과
- `docs/SPRITE_PRODUCTION_PROTOCOL.md`: 이후 모든 캐릭터에 적용할 공통 제작 규격
- `docs/REMAINING_ASSET_PLAN.md`: 캐릭터 완료 이후 맵·UI·공통 효과 제작 순서와 중복 방지 기준
- `tools/validate_sprite_sheet.py`: 시트·레이어·피벗 자동 검사기
- `qa/foundation_guardian_animation_preview.gif`: 실제 픽셀 크기 애니메이션 검수본
- `ui/foundation_guardian_ui_sheet_3x1.png`: 초상·지도 노드·경고 문양 통합 시트
- `ui/foundation_guardian_portrait.png`: 보스 초상
- `ui/foundation_trial_map_node.png`: 축기 시련 지도 노드
- `ui/foundation_trial_warning_crest.png`: 시련 경고 문양
- `ui/archive_pre_ink_redesign/`: 수묵담채 재설계 전 UI 보존본
- `enemies/ink_armored_charging_boar/`: 축기 1층 돌진형 일반 몬스터 `묵갑돌저`의 본체·FX·합성 시트와 직사각형 돌진 예고 범위
- `enemies/celadon_mist_toad/`: 축기 2층 원거리형 일반 몬스터 `벽연섬`의 본체·FX·합성 시트, 탄환·착탄 시트와 원형 착탄 예고
- `enemies/cracked_stone_beetle/`: 축기 4층 폭발형 `균열석충`과 원형 폭발 전조·폭발 시트
- `enemies/ink_command_ape/`: 축기 5층 호령형 `묵령후원`과 영향 대상 문양·범위 표시
- `enemies/jade_scale_pangolin/`: 축기 6층 수호막형 `옥린천산갑`과 대상별 보호막·범위 표시
- `enemies/taixu_sword_sentinel/`: 축기 7층 태허유적 수호령 A `태허검위`와 검격 장판
- `enemies/taixu_formation_warden/`: 축기 8층 태허유적 수호령 B `태허법위`와 진법 표식·투사체
- `boss/taixu_formation_sovereign/`: 축기 9층 최종 보스 `태허진령`의 6×4 본체·FX·합성 시트와 이동 진법 영역
- `ui/taixu_formation_sovereign_portrait.png`: 태허진령 보스 초상, 724×724
- `ui/taixu_ruins_map_node.png`: 태허유적 지도 노드, 724×724
- `ui/taixu_ruins_ui_sheet_2x1.png`: 태허진령 초상·태허유적 지도 노드 통합 시트
- `ui/source_generated/`: 태허유적 UI 정규화 전 생성 원본
- `regions/taixu_ruins/background/`: 태허유적 세로형 전투 배경, 1024×1536
- `regions/taixu_ruins/objects/`: 태허 진법 결절, 512×512
- `regions/taixu_ruins/decor/`: 태허유적 장식 4종과 2×2 아틀라스
- `regions/purple_cloud_marsh/background/`: 자운택 세로형 전투 배경, 1024×1536
- `regions/purple_cloud_marsh/decor/`: 자운택 습지 장식 4종과 2×2 아틀라스
- `regions/purple_cloud_marsh/fx/`: 안개·수면 효과 4종과 2×2 아틀라스
- `regions/purple_cloud_marsh/ui/`: 자운택 지도 노드, 724×724
- `regions/thunder_peak/objects/`: 천뢰봉 피뢰 결절, 512×512
- `fx/common/shield_break/`: 수호막 파괴 6프레임·6×1 시트
- `fx/common/area_field/`: 공통 장판 발동 6프레임·6×1 시트
- `source_generated/remaining_map_assets/`: 최종 정규화 전 생성 원본 10종
- `qa/remaining_assets_overview.png`: 잔여 맵 에셋 전체 미리보기
- `ui/node_icons/`: 전투 개편과 한자 대체용 노드 픽토그램 63종, 상태 프레임 4종
- `ui/node_icons/node_icon_manifest.json`: 아이콘 ID·한글 표기·파일 경로 매핑
- `ui/node_icons/NODE_ICON_GUIDE.md`: 계통 아이콘 재사용 및 상태 프레임 합성 규칙
- `qa/node_icons/node_icons_overview.jpg`: 전 아이콘 분리·정규화 검수표

## 보스 시트 행 규칙

1. `row1`: 대기·이동 6프레임
2. `row2`: 기본 공격 6프레임
3. `row3`: 돌진 준비 3프레임 + 직선 돌진 3프레임
4. `row4`: 포효 2프레임 + 경직 2프레임 + 쓰러짐·사망 2프레임

모든 보스 및 UI PNG는 투명 배경이다. 돌진 직사각형 예고 범위와 실제 충돌 판정은 에셋에 포함하지 않고 런타임에서 동일한 좌표로 그린다.

## 시각 규칙

- 피해 예고 범위: 적색
- 수문장 고유색: 묵색·백옥색·퇴색한 청옥색·극소량의 고금색
- 시련 공간: 백색·회묵색·옥색·옅은 금색
- 적혈비경과 구분하기 위해 수문장과 배경에는 적색을 사용하지 않는다.
- 수문장 본체는 선명한 디지털 외곽선 대신 먹 번짐, 마른 붓결, 끊기는 윤곽을 사용한다.
- 공격·돌진 효과는 매끈한 광선이 아니라 독립된 먹 붓획과 안개 잔상으로 표현한다.

## 맵 에셋 재사용 원칙

- 천뢰봉 배경과 낙뢰 예고·판정·회피 보상은 기존 구현을 사용한다.
- 천뢰봉 신규 오브젝트는 `lightning_conduction_node_512.png`만 추가한다.
- 기존 요수 폴더의 돌진·원거리·폭발·호령·수호막 효과를 공통 전투 효과로 재사용한다.
- 신규 공통 효과는 기존에 없던 수호막 파괴와 독립 장판 발동만 포함한다.

## 노드 아이콘 원칙

- 검결·체수련·경신법·신식·호체의 단계 노드는 계통 아이콘을 공유한다.
- 고유 패시브, 술법, 전투 변형, 적 기믹, 탐험 사건만 개별 픽토그램을 사용한다.
- 한자 한 글자를 노드 아이콘으로 사용하지 않는다.
- 잠금·해금 가능·선택·완성 상태는 아이콘 위에 별도 프레임을 합성한다.
