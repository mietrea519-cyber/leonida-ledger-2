# leonida-ledger-2

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/mietrea519-cyber/leonida-ledger-2/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/mietrea519-cyber/leonida-ledger-2/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Ledger is an offline guide and tracker for all 55 Grand Theft Auto VI trophies on PlayStation 5: the official names, descriptions and grades, a checklist saved in the browser with export and import, filters by kind and grade, a spoiler setting that hides story trophies until earned, a 7-stage roadmap to the platinum, and a guide for every trophy — numbered steps, a Where / How block, a progress counter and a Sources section — written in our own words from the official list.

## Run it

```sh
node serve.ts
```

Then open the address it prints (port 8080) in desktop Chrome. Or serve `app/` with any static file server. Everything runs from the files in this repo — no network requests, no account, no upload.

## Tracker features

- **Checklist** — all 55 trophies with official name, description, grade, PSN progress target (where one exists) and a Hidden-on-PSN tag. Tick one off and it stays ticked in this browser.
- **Filters** — by kind (story, missable, collectibles, activities, online), by grade, and by search. The online filter is empty on purpose: all 55 trophies are offline single-player.
- **Spoiler shield** — hides the names and descriptions of story trophies until they are earned.
- **Roadmap** — seven stages to the platinum, each with its own progress, built from the official descriptions.
- **Missable flag** — exactly one trophy is flagged possibly missable: Positive Mental Attitude, first offered in Chapter 1, labelled as an inference with manual-save advice.
- **Export / import / reset** — save progress to a JSON file and bring it back on any machine.

## Screenshots

The four screenshots in `screenshots/` are renders of the app's own code at 1280×800:

- `1-cover.jpg` — the checklist with the Positive Mental Attitude guide open beside it, filters and the spoiler setting visible, demo progress 13/55 (24%).
- `2-roadmap.jpg` — the 7-stage roadmap to the platinum with per-stage progress.
- `3-tracker.jpg` — the missable filter active with its one result and the full guide panel, spoiler shield on.
- `4-guide.jpg` — the head of The Shootist guide: title, grade, official description, steps, the 0/42 counter and sources.

The demo scenes behind them are built into the app: `?shot=cover`, `?shot=roadmap`, `?shot=tracker` and `?shot=guide` (see `shots.json` for the exact queries).

## What is in this repo

- `app/` — the app: `index.html`, `style.css`, `js/main.js` (boot and wiring), `js/store.js` (saved progress, export/import), `js/render.js` (checklist and guide panel), `js/roadmap.js` (the 7 stages), `js/shots.js` (demo scenes) and `data/trophies.json` (the official 55 with our guides).
- `screenshots/` — the four screenshots above.
- `main.ts` — the hand-in program: it copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library (`vendor/makefun-frontend.ts`). Run it with `MAKEFUN_OUTPUT_DIR=out node main.ts`.
- `serve.ts` — the little static server for trying the app locally.
- `shots.json` — the `?shot=` queries that reproduce the screenshots.
- `LICENSE` — MIT.

## Sources and originality

Official trophy names, descriptions, grades and PSN progress targets as published by PlayStation, as listed by PSNProfiles and cross-checked on Exophase (retrieved 2026-11-19). The missable flag on Positive Mental Attitude follows PowerPyx's flag, via GTA Zone, that it is the only trophy reported as possibly missable — labelled as an inference in the guide. Every guide is written in our own words for this entry and names its sources beside it. The app uses no Rockstar logo, artwork or game screenshot.

---

Entered on [make.fun](https://make.fun/?ref=1e3qpbvy&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards
