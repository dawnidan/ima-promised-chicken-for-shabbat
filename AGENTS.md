# AGENTS.md

## Product direction

Project: `אמא, הבטחת לנו עוף לשבת 🍗`

This product should feel like a warm Hebrew family recipe notebook, not a generic SaaS dashboard.

## Design system

Use `סגנון מתכון 1` across the entire website:

- warm beige backgrounds
- soft cream surfaces
- rounded corners
- gentle shadows
- illustrated notebook mood
- small kitchen/food motifs
- friendly, funny, homey Hebrew copy
- mobile-first layout
- RTL by default

## MVP constraints

- one homepage only
- no search
- no filters
- no login
- no database
- local mock data only

## Implementation notes

- Prefer small React components with clear responsibilities.
- Keep shared mock data under `src/data/`.
- Keep reusable formatting helpers under `src/utils/`.
- Keep global styling in `src/styles/main.css`.
- Preserve Hebrew RTL behavior when adding new UI.
