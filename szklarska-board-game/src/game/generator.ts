import { RULES, TOTAL_SQUARES } from "./rules";
import { createRng, shuffle, type Rng } from "./random";
import { SQUARE_KINDS, type BoardSquare, type SquareKind } from "./types";

/* =====================================================================
   BOARD GENERATOR
   ---------------------------------------------------------------------
   Builds a fresh tile distribution every game from RULES.distribution
   (50 base : 30 question : 20 action by default), using the largest
   remainder method so the counts always add up to the exact tile count.
   ===================================================================== */

export type Distribution = Record<SquareKind, number>;

export function countsFor(
  total: number,
  distribution: Distribution = RULES.distribution,
): Distribution {
  const weightTotal = SQUARE_KINDS.reduce(
    (sum, kind) => sum + distribution[kind],
    0,
  );

  const exact = SQUARE_KINDS.map((kind) => ({
    kind,
    value: (total * distribution[kind]) / weightTotal,
  }));

  const counts = Object.fromEntries(
    exact.map(({ kind, value }) => [kind, Math.floor(value)]),
  ) as Distribution;

  // Hand out the leftovers to the largest fractional parts.
  let remaining = total - SQUARE_KINDS.reduce((sum, k) => sum + counts[k], 0);
  const byRemainder = [...exact].sort(
    (a, b) =>
      (b.value % 1) - (a.value % 1) ||
      distribution[b.kind] - distribution[a.kind],
  );

  for (let i = 0; remaining > 0; i = (i + 1) % byRemainder.length) {
    counts[byRemainder[i].kind] += 1;
    remaining -= 1;
  }

  return counts;
}

export function generateSquares(
  seed: number,
  total: number = TOTAL_SQUARES,
  distribution: Distribution = RULES.distribution,
): BoardSquare[] {
  const rng: Rng = createRng(seed);
  const counts = countsFor(total, distribution);

  const pool: SquareKind[] = SQUARE_KINDS.flatMap((kind) =>
    Array.from({ length: counts[kind] }, () => kind),
  );

  return shuffle(pool, rng).map((kind, id) => ({ id, kind }));
}
