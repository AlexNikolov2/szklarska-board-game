import type { Difficulty, SquareKind } from "./types.ts";

/* =====================================================================
   RULES
   ---------------------------------------------------------------------
   Every tunable number of the game lives here. Balancing the game must
   never require touching a component.
   ===================================================================== */

export const RULES = {
  /** Board shape: the snake runs right -> up -> left -> up -> right. */
  board: {
    columns: 7,
    rows: 3,
  },

  /**
   * Relative frequency of each tile family. Values are weights, not
   * percentages, so they do not have to add up to 100.
   */
  distribution: {
    base: 50,
    question: 30,
    action: 20,
  } satisfies Record<SquareKind, number>,

  /** Base square: no question, no deal — just a short forced hop next turn. */
  base: {
    forcedSteps: 1,
  },

  question: {
    /** Points awarded for a correct answer, by difficulty. */
    reward: {
      easy: 1,
      medium: 3,
      hard: 6,
    } satisfies Record<Difficulty, number>,
    /** A correct answer unlocks a dice roll and a free move. */
    bonusRoll: true,
  },

  dice: {
    sides: 6,
  },

  player: {
    /** Points everyone starts the game with. */
    startingPoints: 0,
  },
} as const;

export const TOTAL_SQUARES = RULES.board.columns * RULES.board.rows;
