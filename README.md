# black-friday-deal-finder-01
[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/Kodoku05/black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/Kodoku05/black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

DealCheck puts 20 checked Black Friday deals in one clear, compact edit, with product search and category, store, discount, and verdict filters. Evidence and conditions sit next to every saving, while an AirPods comparison makes the cross-store choice easy. Prices and check times are fixed snapshots; the store page is final.

## Run

Requires Node.js 22.18 or newer. No dependencies or build step.

```sh
MAKEFUN_OUTPUT_DIR=/tmp/out node main.ts
```

Open `app/index.html` directly in your browser, or serve it locally:

```sh
python3 -m http.server 8765 --directory app
```

Open `http://localhost:8765/`. Routes include `#/audio50`, `#/compare`, and `#/deal/beats-studio-pro`. Filters are shareable in the URL hash, and the entire site works offline. Store links open only when clicked.

Run the local structural and deal-data checks with `npm test`. The competition does not provide a local score; the supplied kit check is separate from these checks. `shots.json` records the four unedited browser captures.

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>
