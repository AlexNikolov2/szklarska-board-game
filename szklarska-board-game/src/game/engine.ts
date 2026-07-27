import { COMPANY_BY_ID, EMPTY_PORTFOLIO, PROPERTY_BY_ID } from "./catalog";
import { generateSquares } from "./generator";
import { RULES } from "./rules";
import type {
  CompanyId,
  GameState,
  LogEntry,
  Player,
  PropertyId,
  Question,
  TurnPhase,
} from "./types";

/* =====================================================================
   GAME ENGINE
   ---------------------------------------------------------------------
   A pure reducer. It never rolls a dice or draws a question itself —
   those values are produced at the edge (see random.ts / useGame) and
   passed in, which keeps every transition reproducible and testable.
   ===================================================================== */

export type GameAction =
  | { type: "reset"; seed: number; playerNames: string[] }
  /** Main move of the turn. `value` is ignored if a forced move is queued. */
  | { type: "roll"; value: number }
  | { type: "choose-difficulty"; question: Question }
  | { type: "answer"; optionIndex: number }
  | { type: "bonus-roll"; value: number }
  | { type: "buy-property"; propertyId: PropertyId }
  | { type: "buy-shares"; companyId: CompanyId; quantity: number }
  /** Walk away from an action square without buying anything. */
  | { type: "decline" }
  | { type: "end-turn" };

/* ---------------------------------------------------------------------
   Selectors
   --------------------------------------------------------------------- */

export function activePlayer(state: GameState): Player {
  return state.players[state.activePlayerIndex];
}

export function currentSquare(state: GameState) {
  const player = activePlayer(state);
  return player.position >= 0 ? state.squares[player.position] : null;
}

/** Points earned per square travelled, from the whole share portfolio. */
export function incomePerSquare(player: Player): number {
  return (Object.keys(player.shares) as CompanyId[]).reduce(
    (sum, id) => sum + player.shares[id] * COMPANY_BY_ID[id].incomePerSquare,
    0,
  );
}

/** Points tied up in property, used for the final score. */
export function propertyValue(player: Player): number {
  return player.properties.reduce(
    (sum, id) => sum + PROPERTY_BY_ID[id].cost,
    0,
  );
}

export function netWorth(player: Player): number {
  const shareValue = (Object.keys(player.shares) as CompanyId[]).reduce(
    (sum, id) => sum + player.shares[id] * COMPANY_BY_ID[id].sharePrice,
    0,
  );
  return player.points + propertyValue(player) + shareValue;
}

/* ---------------------------------------------------------------------
   Setup
   --------------------------------------------------------------------- */

export function createPlayers(names: string[]): Player[] {
  return names.map((name, seat) => ({
    id: `p${seat + 1}`,
    name,
    seat,
    position: -1,
    points: RULES.player.startingPoints,
    properties: [],
    shares: { ...EMPTY_PORTFOLIO },
    pendingSteps: 0,
  }));
}

export function createGame(seed: number, playerNames: string[]): GameState {
  return {
    seed,
    squares: generateSquares(seed),
    players: createPlayers(playerNames),
    activePlayerIndex: 0,
    turn: 1,
    phase: "awaiting-roll",
    lastRoll: null,
    pendingQuestion: null,
    usedQuestionIds: [],
    winnerId: null,
    log: [],
  };
}

/* ---------------------------------------------------------------------
   Internal helpers
   --------------------------------------------------------------------- */

function withLog(state: GameState, message: string): GameState {
  const entry: LogEntry = {
    id: state.log.length + 1,
    turn: state.turn,
    playerId: activePlayer(state).id,
    message,
  };
  return { ...state, log: [entry, ...state.log].slice(0, 50) };
}

function updateActive(
  state: GameState,
  update: (player: Player) => Player,
): GameState {
  return {
    ...state,
    players: state.players.map((player, index) =>
      index === state.activePlayerIndex ? update(player) : player,
    ),
  };
}

/** "1 pt" / "3 pts" — keeps the game log readable. */
function pts(amount: number): string {
  return `${amount} pt${amount === 1 ? "" : "s"}`;
}

/** "an easy" / "a hard" — English articles for the difficulty labels. */
function article(word: string): string {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

/** Moves the active player, paying out share income for every square passed. */
function advance(state: GameState, steps: number): GameState {
  const player = activePlayer(state);
  const lastIndex = state.squares.length - 1;
  const target = Math.min(player.position + steps, lastIndex);
  const travelled = Math.max(0, target - player.position);
  const income = travelled * incomePerSquare(player);

  let next = updateActive(state, (p) => ({
    ...p,
    position: target,
    points: p.points + income,
  }));

  next = withLog(
    next,
    `moved ${travelled} square${travelled === 1 ? "" : "s"}`,
  );

  if (income > 0) {
    next = withLog(next, `earned ${pts(income)} of share income`);
  }

  return next;
}

/**
 * Applies the effect of the square the active player just landed on.
 * `allowQuestion` is false after a bonus move so question squares cannot
 * chain into another question in the same turn.
 */
function resolveLanding(state: GameState, allowQuestion: boolean): GameState {
  const player = activePlayer(state);

  if (player.position >= state.squares.length - 1) {
    return {
      ...withLog(state, "reached the FINISH"),
      phase: "finished",
      winnerId: player.id,
    };
  }

  const square = state.squares[player.position];

  switch (square.kind) {
    case "base": {
      const next = updateActive(state, (p) => ({
        ...p,
        pendingSteps: RULES.base.forcedSteps,
      }));
      return {
        ...withLog(
          next,
          `landed on a base square — moves ${RULES.base.forcedSteps} next turn`,
        ),
        phase: "turn-end",
      };
    }

    case "question":
      return allowQuestion
        ? { ...state, phase: "question-difficulty" }
        : { ...state, phase: "turn-end" };

    case "action":
      return { ...state, phase: "action" };
  }
}

const PHASE_GUARD: Record<GameAction["type"], TurnPhase[]> = {
  reset: [],
  roll: ["awaiting-roll"],
  "choose-difficulty": ["question-difficulty"],
  answer: ["question-answer"],
  "bonus-roll": ["question-bonus-roll"],
  "buy-property": ["action"],
  "buy-shares": ["action"],
  decline: ["action"],
  "end-turn": ["turn-end"],
};

/* ---------------------------------------------------------------------
   Reducer
   --------------------------------------------------------------------- */

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === "reset") {
    return createGame(action.seed, action.playerNames);
  }

  // Every other action is only legal in specific phases.
  if (!PHASE_GUARD[action.type].includes(state.phase)) return state;

  switch (action.type) {
    case "roll": {
      const player = activePlayer(state);
      const forced = player.pendingSteps > 0;
      const steps = forced ? player.pendingSteps : action.value;

      let next = updateActive(state, (p) => ({ ...p, pendingSteps: 0 }));
      next = { ...next, lastRoll: forced ? null : action.value };
      next = withLog(
        next,
        forced ? `took a forced move of ${steps}` : `rolled ${steps}`,
      );
      next = advance(next, steps);

      return resolveLanding(next, true);
    }

    case "choose-difficulty": {
      const next = withLog(
        state,
        `drew ${article(action.question.difficulty)} ${action.question.difficulty} question`,
      );
      return {
        ...next,
        phase: "question-answer",
        pendingQuestion: action.question,
        usedQuestionIds: [...state.usedQuestionIds, action.question.id],
      };
    }

    case "answer": {
      const question = state.pendingQuestion;
      if (!question) return state;

      const correct = action.optionIndex === question.answerIndex;
      if (!correct) {
        return { ...withLog(state, "answered incorrectly"), phase: "turn-end" };
      }

      const reward = RULES.question.reward[question.difficulty];
      const next = updateActive(state, (p) => ({
        ...p,
        points: p.points + reward,
      }));

      return {
        ...withLog(next, `answered correctly for +${pts(reward)}`),
        phase: RULES.question.bonusRoll ? "question-bonus-roll" : "turn-end",
      };
    }

    case "bonus-roll": {
      let next: GameState = { ...state, lastRoll: action.value };
      next = withLog(next, `rolled a bonus ${action.value}`);
      next = advance(next, action.value);
      return resolveLanding(next, false);
    }

    case "buy-property": {
      const player = activePlayer(state);
      const property = PROPERTY_BY_ID[action.propertyId];
      if (
        player.points < property.cost ||
        player.properties.includes(property.id)
      ) {
        return state;
      }

      const next = updateActive(state, (p) => ({
        ...p,
        points: p.points - property.cost,
        properties: [...p.properties, property.id],
      }));

      return {
        ...withLog(next, `bought ${property.label} for ${pts(property.cost)}`),
        phase: "turn-end",
      };
    }

    case "buy-shares": {
      const player = activePlayer(state);
      const company = COMPANY_BY_ID[action.companyId];
      const cost = company.sharePrice * action.quantity;
      if (action.quantity < 1 || player.points < cost) return state;

      const next = updateActive(state, (p) => ({
        ...p,
        points: p.points - cost,
        shares: {
          ...p.shares,
          [company.id]: p.shares[company.id] + action.quantity,
        },
      }));

      return {
        ...withLog(
          next,
          `bought ${action.quantity} ${company.name} share${
            action.quantity === 1 ? "" : "s"
          } for ${pts(cost)}`,
        ),
        phase: "turn-end",
      };
    }

    case "decline":
      return { ...withLog(state, "passed on the deal"), phase: "turn-end" };

    case "end-turn": {
      const nextIndex = (state.activePlayerIndex + 1) % state.players.length;
      return {
        ...state,
        activePlayerIndex: nextIndex,
        turn: nextIndex === 0 ? state.turn + 1 : state.turn,
        phase: "awaiting-roll",
        pendingQuestion: null,
        lastRoll: null,
      };
    }
  }
}
