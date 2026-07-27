import type { SquareCategory } from "./theme";

/** A single tile on the path. */
export type BoardSquare = {
  /** 0-based position along the path. */
  id: number;
  category: SquareCategory;
  /** Short text printed on the tile. */
  label: string;
  /** Steps gained (+) or lost (-) when the challenge is answered correctly. */
  bonus?: number;
};

/** Where a tile sits once the straight snail path is unrolled onto a grid. */
export type SquarePlacement = {
  /** 0-based row, counted from the bottom of the board. */
  row: number;
  /** 0-based column within that row's visual grid. */
  col: number;
  /** 1-based CSS grid row. */
  gridRow: number;
  /** 1-based CSS grid column. */
  gridColumn: number;
  /** Travel direction as the player enters this tile. */
  direction: "right" | "left" | "up";
};

export type Question = {
  id: string;
  category: SquareCategory;
  prompt: string;
  options: string[];
  /** Index into `options`. */
  answerIndex: number;
  explanation: string;
};

export type Player = {
  id: string;
  name: string;
  /** Index along the path; -1 means still on START. */
  position: number;
};
