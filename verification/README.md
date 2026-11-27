# Verification

All checks performed November 27, 2026. Screenshots are unedited Chromium headless-shell renders.

- Local source, data, screenshot and canonical-dossier checks: **18 passed, 0 failed** (`npm test`, which exports to `/tmp/dealcheck-out` first).
- Browser interaction checks: **16 passed, 0 failed**. Exercised every filter chip, all four sorts, search and hash reload, empty-state reset, all 20 detail routes, AirPods comparisons, and direct file opening.
- Responsive overflow checks: home, comparison and detail at 360, 390, 600, 768 and 1280 pixels wide.
- Browser audit: **0 script errors, 0 external network requests**; all seven first-load files are local. Source scan found only the 20 supplied store URLs in `app/deals.js`.
- Official local scoring: unavailable. `grade-local --kit <kit> --bot .` reports that this competition’s scorer and reference data are not published.
- Kit pre-submit check without transcripts: **5 passed, 1 failed, 16 skipped, 3 checked at submission** on the committed repository. The sole failure is `transcripts_present`. The parent handles transcript bundling and submission; neither operation was performed here. A full zero-failure pre-submit check requires the parent’s transcript input.

## Artifact sizes

| Screenshot | Pixels | Bytes |
| --- | --- | ---: |
| 1-home.jpg | 1280 × 800 | 127,864 |
| 2-audio50.jpg | 1280 × 800 | 125,728 |
| 3-compare.jpg | 1280 × 800 | 97,956 |
| 4-phone.jpg | 390 × 844 | 59,763 |

- App source / first-load raw files: **43,160 bytes** across seven files.
- Canonical dossier: **597,925 bytes**.
- Vendor SHA-256: `4c8da1c8e76490b3a847670f49137d3ec23953e3c988fe6a6cb320fce5739240` (matches the kit).
- Both polish passes were followed by recapture and verification.

## Store link checks

One HEAD request was made to each of the 20 supplied URLs after writing the deal records. These are reachability results, not new price observations; the supplied source snapshots and links remain unchanged. Per-deal results are in `store-links.json`.

| Store | Result |
| --- | --- |
| Target | 5 × HTTP 200 |
| Dell | 1 × HTTP 200 |
| Walmart | 3 × HTTP 307 |
| Amazon | 2 × HTTP 503 |
| Best Buy | 9 × timeout (HTTP 000, curl exit 28) |

No transcripts were bundled, and no entry was submitted.
