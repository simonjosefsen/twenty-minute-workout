## Goal
Give each Featured workout card its own subtle, premium gradient background instead of reusing the same accent-based gradient for all workouts of the same accent color.

## Current behavior
- Featured cards use an `accents` map keyed by `accent` (`lime` | `cyan` | `amber` | `rose`).
- All workouts with the same accent share the same ring/chip/icon styling.

## Changes
### `src/pages/Index.tsx`
1. Add a `featuredCardBg` map keyed by workout `id`:
   - `"full-body"` → `from-lime-500/20 via-green-500/10 to-transparent` (lime/green)
   - `"emom-15-full-body"` → `from-orange-500/20 via-amber-500/10 to-transparent` (warm orange/amber)
   - `"kb-full-body-burn"` → `from-emerald-500/20 via-teal-500/10 to-transparent` (deeper green/teal)
   - `"pp-starter"` (for future use) → `from-pink-400/20 via-purple-400/10 to-transparent` (soft pink/purple)
2. In `renderRoutineCard`, replace the shared `bg-gradient-to-br {a.ring}` with the per-workout gradient from `featuredCardBg[r.id]`.
3. Keep the badge chip, icon, and text colors unchanged (still driven by `a.chip` / `a.icon`).

## Out of scope
- No changes to workout data, logic, timers, EMOM, onboarding, tabs, or custom workouts.
- No new components.
- No global redesign.