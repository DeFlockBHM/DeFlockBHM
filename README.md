# DeFlockBHM

These are aggregated statistics from community-maintained, open-source trackers documenting the fallout from Flock Safety's ALPR (automated license plate reader) camera network: municipalities
that have deflocked, civil lawsuits over misuse and mistaken-identity stops,
and officers fired, arrested, or convicted for misusing the system.

<!-- STATS:START -->

To date, **100 municipalities** have deflocked. **56** of those (56%) have deflocked YTD and **93** of those (93%) have happened since the start of 2025. 
At least **9 civil lawsuits** have been filed alleging mistaken-identity stops or other civil-rights violations tied to Flock's ALPR network, **3** of them since the start of 2025. **5** have settled, totaling **$2,229,500 (~$2.23M)** in publicly reported, actually-paid settlements. 
Separately, at least **34 officers** have been fired, arrested, or convicted for misusing Flock or similar ALPR access (23 fired, 23 arrested, 6 convicted — some overlap, e.g. fired *and* arrested), including **20** in the last 90 days.

| Metric | Count |
|---|---|
| Municipalities deflocked (total) | 100 |
| ...deflocked YTD | 56 |
| ...since start of 2025 | 93 |
| Civil lawsuits tracked (total) | 9 |
| ...since start of 2025 | 3 |
| ...settled | 5 |
| Total reported settlements paid | $2,229,500 (~$2.23M) |
| Officers fired/arrested/convicted (total) | 34 |
| ...in the last 90 days | 20 |

*Figures are computed directly from each tracker's published data file (links below) — news-sourced, not exhaustive court/police-record pulls; see each repo's `SCHEMA.md` for scope and caveats. Regenerated daily, last refreshed 2026-08-08.*

<!-- STATS:END -->

## Repositories

- [**deflocked-municipalities**](https://github.com/DeFlockBHM/deflocked-municipalities) — municipalities that have deactivated, cancelled, or rejected Flock Safety ALPR contracts.
- [**flock-lawsuit-tracker**](https://github.com/DeFlockBHM/flock-lawsuit-tracker) — civil lawsuits alleging mistaken-identity stops or other civil-rights violations tied to Flock's ALPR network.
- [**flock-officer-misuse**](https://github.com/DeFlockBHM/flock-officer-misuse) — officers fired, arrested, or convicted for misusing Flock or similar ALPR access.

Each repo publishes a single machine-readable JSON file in `data/`, documented
in that repo's `SCHEMA.md`.

## How this README stays current

The block above is regenerated daily by [`scripts/generate-readme.js`](scripts/generate-readme.js),
run on a schedule by [`.github/workflows/update-readme.yml`](.github/workflows/update-readme.yml).
The script fetches the three data files above directly and recomputes every
number from scratch — no AI, no manual editing. Edits made inside the
`STATS:START` / `STATS:END` markers will be overwritten on the next run; edit
everything else in this file freely.
