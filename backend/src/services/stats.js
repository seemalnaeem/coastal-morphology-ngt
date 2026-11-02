// Dashboard summary stats from the region_stats SQL function.
import { query } from "../db/pool.js";

export async function getRegionStats(region) {
  const { rows } = await query("SELECT * FROM region_stats($1)", [region]);
  return rows.map((r) => ({
    region: r.region,
    transects: Number(r.transects),
    meanEpr: num(r.mean_epr),
    meanNsm: num(r.mean_nsm),
    pctEroding: num(r.pct_eroding),
    pctAccreting: num(r.pct_accreting),
    maxErosion: num(r.max_erosion),
    maxAccretion: num(r.max_accretion),
  }));
}

const num = (v) => (v === null || v === undefined ? null : Number(v));
