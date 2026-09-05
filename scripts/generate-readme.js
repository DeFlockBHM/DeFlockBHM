#!/usr/bin/env node
// Regenerates the block between the STATS markers in README.md from the
// three tracker repos' published data files. Deterministic — no AI, no
// judgment calls at run time. Every number here is a plain count/sum over
// the fetched JSON; see the per-repo SCHEMA.md files for what each field
// means and how confident the upstream data is.

const README_PATH = new URL("../README.md", import.meta.url);

const SOURCES = {
  municipalities:
    "https://raw.githubusercontent.com/DeFlockBHM/deflocked-municipalities/main/data/municipalities.json",
  lawsuits:
    "https://raw.githubusercontent.com/DeFlockBHM/flock-lawsuit-tracker/main/data/lawsuits.json",
  misuse:
    "https://raw.githubusercontent.com/DeFlockBHM/flock-officer-misuse/main/data/cases.json",
};

const MARKER_START = "<!-- STATS:START -->";
const MARKER_END = "<!-- STATS:END -->";
const MALFEASANCE_MARKER_START = "<!-- MALFEASANCE:START -->";
const MALFEASANCE_MARKER_END = "<!-- MALFEASANCE:END -->";

// Display order/labels for the outcome breakdown table. Mirrors the
// `outcomes[]` enum documented in flock-officer-misuse's SCHEMA.md.
const OUTCOME_LABELS = [
  ["fired", "Fired"],
  ["arrested", "Arrested"],
  ["charged", "Charged"],
  ["pleaded_guilty", "Pleaded guilty"],
  ["convicted", "Convicted"],
  ["sentenced", "Sentenced"],
  ["resigned", "Resigned"],
  ["retired", "Retired"],
  ["suspended", "Suspended"],
  ["administrative_leave", "Administrative leave"],
  ["demoted", "Demoted"],
  ["disciplined", "Disciplined (reprimand/corrective action)"],
  ["access_revoked", "Access revoked"],
  ["under_investigation", "Under investigation"],
  ["no_action_reported", "No outcome reported"],
];
const RECENT_WINDOW_DAYS = 90;
const CUTOFF_YEAR = 2025;

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

// Pulls a leading 4-digit year out of loosely-formatted date strings like
// "2026-07-14", "2024-01", "2023", or "" (no match -> null).
function parseYear(dateStr) {
  const m = typeof dateStr === "string" && dateStr.match(/(\d{4})/);
  return m ? parseInt(m[1], 10) : null;
}

// Only trusts full "YYYY-MM-DD" or "YYYY-MM" strings for recency windows —
// year-only values are too coarse to say something happened "in the last
// N days" without overclaiming precision the source data doesn't have.
function parseRecentDate(dateStr) {
  if (typeof dateStr !== "string") return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return new Date(dateStr + "T00:00:00Z");
  if (/^\d{4}-\d{2}$/.test(dateStr)) return new Date(dateStr + "-01T00:00:00Z");
  return null;
}

function formatUsd(amount) {
  const whole = `$${Math.round(amount).toLocaleString("en-US")}`;
  if (amount >= 1_000_000) return `${whole} (~$${(amount / 1_000_000).toFixed(2)}M)`;
  return whole;
}

function pct(part, whole) {
  if (!whole) return "0%";
  return `${Math.round((part / whole) * 100)}%`;
}

function summarizeMunicipalities(data) {
  const entries = data.entries || [];
  const total = entries.length;
  const since2025 = entries.filter((e) => (e.date?.year ?? null) >= CUTOFF_YEAR).length;
  const YTD = entries.filter(e => (e.date?.year ?? null) == (new Date()).getFullYear()).length;
  return { total, since2025, YTD };
}

function summarizeLawsuits(data) {
  const lawsuits = data.lawsuits || [];
  const total = lawsuits.length;
  const since2025 = lawsuits.filter((l) => {
    const y = parseYear(l.filed_date);
    return y !== null && y >= CUTOFF_YEAR;
  }).length;
  const settled = lawsuits.filter((l) => l.status === "settled");
  const settledWithAmount = settled.filter(
    (l) => typeof l.settlement_amount_usd === "number"
  );
  const totalSettlementUsd = settledWithAmount.reduce(
    (sum, l) => sum + l.settlement_amount_usd,
    0
  );
  return {
    total,
    since2025,
    settledCount: settled.length,
    settledWithAmountCount: settledWithAmount.length,
    totalSettlementUsd,
  };
}

function summarizeMisuse(data) {
  // v3 schema (flock-officer-misuse, post IJ-scraper rewrite): a flat
  // `incidents[]` array, no more cases/incidents split. Entries can be
  // `status: "removed_from_source"` (no longer on IJ's page but kept for
  // history, per SCHEMA.md) — those are excluded from these counts as they
  // may represent stale/retracted reports.
  const incidents = (data.incidents || []).filter((i) => i.status !== "removed_from_source");
  const now = Date.now();
  const recentCutoff = now - RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  const hasTrackedOutcome = (i) =>
    (i.outcomes || []).some((o) => ["fired", "arrested", "convicted"].includes(o));

  const tracked = incidents.filter(hasTrackedOutcome);
  // Recency is measured against when the incident happened/was reported
  // (date.iso, IJ's own field), not when this tracker last scraped it.
  const recent = tracked.filter((i) => {
    const d = parseRecentDate(i.date?.iso);
    return d && d.getTime() >= recentCutoff;
  });

  const outcomeCounts = {};
  for (const i of incidents) {
    for (const o of i.outcomes || []) {
      outcomeCounts[o] = (outcomeCounts[o] || 0) + 1;
    }
  }

  return {
    officersWithOutcome: tracked.length,
    recentCount: recent.length,
    firedCount: outcomeCounts.fired || 0,
    arrestedCount: outcomeCounts.arrested || 0,
    convictedCount: outcomeCounts.convicted || 0,
  };
}

// Full outcome breakdown across every documented ALPR malfeasance incident
// (all vendors, not just Flock — see flock-officer-misuse's README for why
// that tracker isn't Flock-only). Rows are independent counts, not a
// partition: one incident can carry multiple outcomes (e.g. arrested *and*
// charged), so rows overlap and won't sum to the incident total.
function summarizeMalfeasance(data) {
  const incidents = (data.incidents || []).filter((i) => i.status !== "removed_from_source");
  const total = incidents.length;
  const flockCount = incidents.filter((i) => i.is_flock).length;

  const outcomeCounts = {};
  for (const i of incidents) {
    for (const o of i.outcomes || []) {
      outcomeCounts[o] = (outcomeCounts[o] || 0) + 1;
    }
  }

  return { total, flockCount, otherVendorCount: total - flockCount, outcomeCounts };
}

function renderStatsBlock({ muni, suits, misuse }, generatedAt) {
  const lines = [];

  lines.push(
    `To date, **${muni.total} municipalities** have deflocked. ${muni.YTD > 0 ? `**${muni.YTD}** of those (${pct(muni.YTD, muni.total)}) have deflocked YTD` : ""} and **${muni.since2025}** of those (${pct(muni.since2025, muni.total)}) ` +
      `have happened since the start of ${CUTOFF_YEAR}.`
  );

  const settlementSentence =
    suits.settledCount > 0
      ? ` **${suits.settledCount}** have settled, totaling **${formatUsd(
          suits.totalSettlementUsd
        )}** in publicly reported, actually-paid settlements` +
        (suits.settledWithAmountCount < suits.settledCount
          ? ` (amount confirmed for ${suits.settledWithAmountCount} of those ${suits.settledCount})`
          : "") +
        "."
      : "";
  lines.push(
    `At least **${suits.total} civil lawsuits** have been filed alleging ` +
      `mistaken-identity stops or other civil-rights violations tied to Flock's ` +
      `ALPR network, **${suits.since2025}** of them since the start of ${CUTOFF_YEAR}.` +
      settlementSentence
  );

  lines.push(
    `Separately, at least **${misuse.officersWithOutcome} officers** have been ` +
      `fired, arrested, or convicted for misusing Flock or similar ALPR access ` +
      `(${misuse.firedCount} fired, ${misuse.arrestedCount} arrested, ` +
      `${misuse.convictedCount} convicted — some overlap, e.g. fired *and* arrested), ` +
      `including **${misuse.recentCount}** in the last ${RECENT_WINDOW_DAYS} days.`
  );

  const narrative = lines.join(" \n");

  const table = [
    "| Metric | Count |",
    "|---|---|",
    `| Municipalities deflocked (total) | ${muni.total} |`,
    `| ...deflocked YTD | ${muni.YTD} |`,
    `| ...since start of ${CUTOFF_YEAR} | ${muni.since2025} |`,
    `| Civil lawsuits tracked (total) | ${suits.total} |`,
    `| ...since start of ${CUTOFF_YEAR} | ${suits.since2025} |`,
    `| ...settled | ${suits.settledCount} |`,
    `| Total reported settlements paid | ${formatUsd(suits.totalSettlementUsd)} |`,
    `| Officers fired/arrested/convicted (total) | ${misuse.officersWithOutcome} |`,
    `| ...in the last ${RECENT_WINDOW_DAYS} days | ${misuse.recentCount} |`,
  ].join("\n");

  const disclaimer =
    "*Figures are computed directly from each tracker's published data file " +
    "(links below) — news-sourced, not exhaustive court/police-record pulls; " +
    "see each repo's `SCHEMA.md` for scope and caveats. Regenerated daily, " +
    `last refreshed ${generatedAt}.*`;

  return `${narrative}\n\n${table}\n\n${disclaimer}`;
}

function renderMalfeasanceBlock(malfeasance, generatedAt) {
  const { total, flockCount, otherVendorCount, outcomeCounts } = malfeasance;

  const intro =
    `**${total} documented ALPR malfeasance incidents** in total ` +
    `(${flockCount} Flock, ${otherVendorCount} other/unspecified vendor), ` +
    `sourced from the Institute for Justice's ALPR abuse database via ` +
    `[flock-officer-misuse](https://github.com/DeFlockBHM/flock-officer-misuse). ` +
    `An incident can carry more than one outcome (e.g. arrested *and* ` +
    `charged), so the rows below are independent counts, not a partition — ` +
    `they overlap with each other and won't sum to ${total}.`;

  const table = [
    "| Outcome | Count |",
    "|---|---|",
    ...OUTCOME_LABELS.map(
      ([key, label]) => `| ${label} | ${outcomeCounts[key] || 0} |`
    ),
  ].join("\n");

  const disclaimer =
    "*Counts are independent per outcome (see note above); computed " +
    "directly from flock-officer-misuse's published data file — see its " +
    `\`SCHEMA.md\` for how outcomes are tagged and its scope/caveats. ` +
    `Regenerated daily, last refreshed ${generatedAt}.*`;

  return `${intro}\n\n${table}\n\n${disclaimer}`;
}

function spliceMarkerBlock(content, startMarker, endMarker, block) {
  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    throw new Error(`README.md is missing ${startMarker} / ${endMarker} markers`);
  }
  return (
    content.slice(0, startIdx + startMarker.length) +
    "\n\n" +
    block +
    "\n\n" +
    content.slice(endIdx)
  );
}

async function main() {
  const [muniData, suitsData, misuseData] = await Promise.all([
    fetchJson(SOURCES.municipalities),
    fetchJson(SOURCES.lawsuits),
    fetchJson(SOURCES.misuse),
  ]);

  const stats = {
    muni: summarizeMunicipalities(muniData),
    suits: summarizeLawsuits(suitsData),
    misuse: summarizeMisuse(misuseData),
  };
  const malfeasance = summarizeMalfeasance(misuseData);

  const generatedAt = new Date().toISOString().slice(0, 10);
  const statsBlock = renderStatsBlock(stats, generatedAt);
  const malfeasanceBlock = renderMalfeasanceBlock(malfeasance, generatedAt);

  const fs = await import("node:fs/promises");
  let readme = await fs.readFile(README_PATH, "utf8");

  readme = spliceMarkerBlock(readme, MARKER_START, MARKER_END, statsBlock);
  readme = spliceMarkerBlock(
    readme,
    MALFEASANCE_MARKER_START,
    MALFEASANCE_MARKER_END,
    malfeasanceBlock
  );

  await fs.writeFile(README_PATH, readme);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
