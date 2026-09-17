# Core Balance v0.1 — Build 11.36.0

This file records the first integrated combat/progression/economy balance pass.

## Stable core
- Expedition duration: 25 seconds.
- Mobile world/camera baseline: 1800×2400 world, 960-unit visible camera height.
- Player growth uses direct attack coefficient / HP / movement / sense targets.
- Skills use one mastery Rank (R1–R5) instead of separate power/range/cycle purchase branches.
- Dungeon affinity nodes are capped by realm: first available realm R3, next realm R4, following realm R5.
- New-area gates require both realm progress and specific prior-dungeon mastery.

## Combat roles
- Basic, guardian, chaser, attacker, elite.
- Enhanced and rare grades; rare monsters gain one trait only in the current content range.
- Attacker role uses a telegraphed heavy strike.
- Blood-vein encounters use elite/regular waves; Thunder adds environmental lightning pressure.

## Economy
- Safe-return target income and costs are balanced backward from target runs per realm.
- Failed expeditions retain the existing 40% recovery rule.
- Dungeon affinity spending is intentionally optional and increases both pressure and earning potential.

## Implementation
Runtime loaders keep world/camera/background work isolated from balance logic:
- `balance_core_v11_36.js`
- `balance_progression_v11_36.js`
- `balance_ui_v11_36.js`
- `balance_systems21_v11_36.js`
- `balance_progression_extras_v11_36.js`

The old progression extras no longer mutate skill ranks.

## Deferred to playtest / spatial tuning
- Final movement feel and area movement soft caps.
- Detection and off-screen indicator distances.
- Auto-pickup radius.
- Final spell world ranges.
- Spawn activation distances.
- Storm reward identity.
- Exact major-event concurrency rules.
