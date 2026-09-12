# DeFlockBHM

These are aggregated statistics from community-maintained, open-source trackers documenting the fallout from Flock Safety's ALPR (automated license plate reader) camera network: municipalities
that have deflocked, civil lawsuits over misuse and mistaken-identity stops,
and officers fired, arrested, or convicted for misusing the system.

<!-- STATS:START -->

To date, **204 municipalities** have deflocked. **184** of those (90%) have deflocked YTD and **204** of those (100%) have happened since the start of 2025. 
At least **14 civil lawsuits** have been filed alleging mistaken-identity stops or other civil-rights violations tied to Flock's ALPR network, **7** of them since the start of 2025. **6** have settled, totaling **$2,229,500 (~$2.23M)** in publicly reported, actually-paid settlements (amount confirmed for 5 of those 6). 
Separately, at least **74 officers** have been fired, arrested, or convicted for misusing Flock or similar ALPR access (54 fired, 32 arrested, 1 convicted — some overlap, e.g. fired *and* arrested), including **40** in the last 90 days.

| Metric | Count |
|---|---|
| Municipalities deflocked (total) | 204 |
| ...deflocked YTD | 184 |
| ...since start of 2025 | 204 |
| Civil lawsuits tracked (total) | 14 |
| ...since start of 2025 | 7 |
| ...settled | 6 |
| Total reported settlements paid | $2,229,500 (~$2.23M) |
| Officers fired/arrested/convicted (total) | 74 |
| ...in the last 90 days | 40 |

*Figures are computed directly from each tracker's published data file (links below) — news-sourced, not exhaustive court/police-record pulls; see each repo's `SCHEMA.md` for scope and caveats. Regenerated daily, last refreshed 2026-09-12.*

<!-- STATS:END -->

## ALPR malfeasance, by outcome

<!-- MALFEASANCE:START -->

**227 documented ALPR malfeasance incidents** in total (212 Flock, 15 other/unspecified vendor), sourced from the Institute for Justice's ALPR abuse database via [flock-officer-misuse](https://github.com/DeFlockBHM/flock-officer-misuse). An incident can carry more than one outcome (e.g. arrested *and* charged), so the rows below are independent counts, not a partition — they overlap with each other and won't sum to 227.

| Outcome | Count |
|---|---|
| Fired | 54 |
| Arrested | 32 |
| Charged | 42 |
| Pleaded guilty | 3 |
| Convicted | 1 |
| Sentenced | 1 |
| Resigned | 32 |
| Retired | 1 |
| Suspended | 17 |
| Administrative leave | 17 |
| Demoted | 4 |
| Disciplined (reprimand/corrective action) | 1 |
| Access revoked | 1 |
| Under investigation | 8 |
| No outcome reported | 67 |

*Counts are independent per outcome (see note above); computed directly from flock-officer-misuse's published data file — see its `SCHEMA.md` for how outcomes are tagged and its scope/caveats. Regenerated daily, last refreshed 2026-09-12.*

<!-- MALFEASANCE:END -->

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
`STATS:START` / `STATS:END` or `MALFEASANCE:START` / `MALFEASANCE:END`
markers will be overwritten on the next run; edit everything else in this
file freely.
