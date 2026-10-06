# DeFlockBHM

These are aggregated statistics from community-maintained, open-source trackers documenting the fallout from Flock Safety's ALPR (automated license plate reader) camera network: municipalities
that have deflocked, civil lawsuits over misuse and mistaken-identity stops,
and officers fired, arrested, or convicted for misusing the system.

<!-- STATS:START -->

To date, **250 municipalities** have deflocked. **229** of those (92%) have deflocked YTD and **250** of those (100%) have happened since the start of 2025. At least **16,903,770 (~16.90M) people** live in a deflocked municipality (based on the **250** of those matched to Census population data). 
At least **18 civil lawsuits** have been filed alleging mistaken-identity stops or other civil-rights violations tied to Flock's ALPR network, **10** of them since the start of 2025. **6** have settled, totaling **$2,229,500 (~$2.23M)** in publicly reported, actually-paid settlements (amount confirmed for 5 of those 6). 
Separately, at least **84 officers** have been fired, arrested, or convicted for misusing Flock or similar ALPR access (59 fired, 37 arrested, 1 convicted — some overlap, e.g. fired *and* arrested), including **25** in the last 90 days.

| Metric | Count |
|---|---|
| Municipalities deflocked (total) | 250 |
| ...deflocked YTD | 229 |
| ...since start of 2025 | 250 |
| ...in October so far | 0 |
| ...in September | 85 |
| ...matched to Census population data | 250 of 250 |
| People living in deflocked municipalities | 16,903,770 (~16.90M) |
| Civil lawsuits tracked (total) | 18 |
| ...since start of 2025 | 10 |
| ...settled | 6 |
| Total reported settlements paid | $2,229,500 (~$2.23M) |
| Officers fired/arrested/convicted (total) | 84 |
| ...in the last 90 days | 25 |

*Figures are computed directly from each tracker's published data file (links below) — news-sourced, not exhaustive court/police-record pulls; see each repo's `SCHEMA.md` for scope and caveats. Regenerated daily, last refreshed 2026-10-06.*

<!-- STATS:END -->

## ALPR malfeasance, by outcome

<!-- MALFEASANCE:START -->

**265 documented ALPR malfeasance incidents** in total (247 Flock, 18 other/unspecified vendor), sourced from the Institute for Justice's ALPR abuse database via [flock-officer-misuse](https://github.com/DeFlockBHM/flock-officer-misuse). An incident can carry more than one outcome (e.g. arrested *and* charged), so the rows below are independent counts, not a partition — they overlap with each other and won't sum to 265.

| Outcome | Count |
|---|---|
| Fired | 59 |
| Arrested | 37 |
| Charged | 45 |
| Pleaded guilty | 3 |
| Convicted | 1 |
| Sentenced | 1 |
| Resigned | 38 |
| Retired | 2 |
| Suspended | 20 |
| Administrative leave | 20 |
| Demoted | 5 |
| Disciplined (reprimand/corrective action) | 1 |
| Access revoked | 1 |
| Under investigation | 9 |
| No outcome reported | 78 |

*Counts are independent per outcome (see note above); computed directly from flock-officer-misuse's published data file — see its `SCHEMA.md` for how outcomes are tagged and its scope/caveats. Regenerated daily, last refreshed 2026-10-06.*

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
