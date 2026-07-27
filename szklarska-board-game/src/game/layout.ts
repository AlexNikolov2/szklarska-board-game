import type { SquarePlacement } from "./types";

/* =====================================================================
   STRAIGHT SNAIL (BOUSTROPHEDON) PATH
   ---------------------------------------------------------------------
   The path is unrolled bottom-to-top. Even rows run left -> right, odd
   rows run right -> left, so the last tile of a row sits directly below
   the first tile of the next one and the turn happens vertically -
   exactly like the reference board.

     row 2  [15][16][17][18][19][20][21] -> FINISH
     row 1  [13][12][11][10][ 9][ 8][ 7]
     row 0  [ 0][ 1][ 2][ 3][ 4][ 5][ 6]
       ^ START
   ===================================================================== */

/** One spare grid column on each side, reserved for the START/FINISH discs. */
const GUTTER = 1;

export function getRowCount(total: number, columns: number): number {
  return Math.max(1, Math.ceil(total / columns));
}

/** Total CSS grid columns, including the START/FINISH gutters. */
export function getGridColumnCount(columns: number): number {
  return columns + GUTTER * 2;
}

export function getPlacement(
  index: number,
  columns: number,
  total: number,
): SquarePlacement {
  const rows = getRowCount(total, columns);
  const row = Math.floor(index / columns);
  const offset = index % columns;
  const goingRight = row % 2 === 0;
  const col = goingRight ? offset : columns - 1 - offset;

  return {
    row,
    col,
    // Row 0 is the bottom row, but CSS grid rows are numbered from the top.
    gridRow: rows - row,
    gridColumn: col + 1 + GUTTER,
    direction: offset === 0 && row > 0 ? "up" : goingRight ? "right" : "left",
  };
}

/** Grid cell for the START disc: immediately before the first tile. */
export function getStartPlacement(columns: number, total: number) {
  const rows = getRowCount(total, columns);
  return { gridRow: rows, gridColumn: 1 };
}

/** Grid cell for the FINISH disc: immediately after the last tile. */
export function getFinishPlacement(columns: number, total: number) {
  const last = getPlacement(total - 1, columns, total);
  const goingRight = last.row % 2 === 0;
  return {
    gridRow: last.gridRow,
    gridColumn: goingRight ? last.gridColumn + 1 : last.gridColumn - 1,
  };
}
