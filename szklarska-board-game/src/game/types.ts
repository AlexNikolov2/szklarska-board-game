/* =====================================================================
   DOMAIN TYPES
   ---------------------------------------------------------------------
   Pure vocabulary of the game. No React, no styling, no data.
   ===================================================================== */

/** The three tile families the board is generated from. */
export const SQUARE_KINDS = ["base", "question", "action"] as const;
export type SquareKind = (typeof SQUARE_KINDS)[number];

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export type PropertyId = "apartment" | "gym" | "hotel" | "office";
export type CompanyId = "alpha" | "beta" | "gamma";

/** A single tile on the path. Content is decided by `kind` at runtime. */
export type BoardSquare = {
  /** 0-based position along the path. */
  id: number;
  kind: SquareKind;
};

/** Where a tile sits once the snake path is unrolled onto a CSS grid. */
export type SquarePlacement = {
  /** 0-based row, counted from the bottom of the board. */
  row: number;
  /** 0-based column within that row. */
  col: number;
  /** 1-based CSS grid row. */
  gridRow: number;
  /** 1-based CSS grid column. */
  gridColumn: number;
  /** Travel direction as the player enters this tile. */
  direction: "right" | "left" | "up";
};

/* ---------------------------------------------------------------------
   Purchasable assets
   --------------------------------------------------------------------- */

/** Bought once, held for its face value. */
export type Property = {
  id: PropertyId;
  label: string;
  /** Points paid to acquire it. */
  cost: number;
};

/** Bought per share, pays out for every square the owner travels. */
export type Company = {
  id: CompanyId;
  name: string;
  /** Points paid for one share. */
  sharePrice: number;
  /** Points earned per share for every square the owner moves. */
  incomePerSquare: number;
};

/* ---------------------------------------------------------------------
   Questions
   --------------------------------------------------------------------- */

export type Question = {
  id: string;
  difficulty: Difficulty;
  prompt: string;
  options: string[];
  /** Index into `options`. */
  answerIndex: number;
  explanation: string;
};

/* ---------------------------------------------------------------------
   Players
   --------------------------------------------------------------------- */

export type Player = {
  id: string;
  name: string;
  /** Seat index, drives the pawn colour. */
  seat: number;
  /** Index along the path; -1 means the pawn is still on START. */
  position: number;
  points: number;
  properties: PropertyId[];
  shares: Record<CompanyId, number>;
  /**
   * Queued forced move left by a base square: next turn the player does
   * not roll, they simply advance this many squares.
   */
  pendingSteps: number;
};

/* ---------------------------------------------------------------------
   Turn state machine
   --------------------------------------------------------------------- */

export type TurnPhase =
  /** Waiting for the active player to roll (or take their forced move). */
  | "awaiting-roll"
  /** Landed on a question square, difficulty not chosen yet. */
  | "question-difficulty"
  /** Difficulty chosen, question on screen. */
  | "question-answer"
  /** Answered correctly, the bonus dice roll is unlocked. */
  | "question-bonus-roll"
  /** Landed on an action square, deal on screen. */
  | "action"
  /** Everything resolved, waiting to hand over to the next player. */
  | "turn-end"
  /** Someone reached the finish. */
  | "finished";

export type LogEntry = {
  id: number;
  turn: number;
  playerId: string;
  message: string;
};

export type GameState = {
  seed: number;
  squares: BoardSquare[];
  players: Player[];
  activePlayerIndex: number;
  turn: number;
  phase: TurnPhase;
  lastRoll: number | null;
  /** Question drawn for the square the active player is standing on. */
  pendingQuestion: Question | null;
  /** Ids already used this game, so questions do not repeat. */
  usedQuestionIds: string[];
  winnerId: string | null;
  log: LogEntry[];
};
