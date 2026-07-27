import * as React from "react";

import { questionsByDifficulty } from "@/game/content";
import { createGame, gameReducer, type GameAction } from "@/game/engine";
import { pickOne, randomSeed, rollDice } from "@/game/random";
import { RULES } from "@/game/rules";
import type { CompanyId, Difficulty, PropertyId } from "@/game/types";

/* =====================================================================
   useGame
   ---------------------------------------------------------------------
   The only place where randomness happens. It rolls the dice and draws
   the questions, then feeds concrete values into the pure reducer.
   ===================================================================== */

export function useGame(playerNames: string[]) {
  const [state, dispatch] = React.useReducer(gameReducer, undefined, () =>
    createGame(randomSeed(), playerNames),
  );

  const drawQuestion = React.useCallback(
    (difficulty: Difficulty) => {
      const pool = questionsByDifficulty(difficulty);
      const unused = pool.filter(
        (question) => !state.usedQuestionIds.includes(question.id),
      );
      return pickOne(unused.length > 0 ? unused : pool, Math.random);
    },
    [state.usedQuestionIds],
  );

  const actions = React.useMemo(
    () => ({
      roll: () => dispatch({ type: "roll", value: rollDice(RULES.dice.sides) }),
      bonusRoll: () =>
        dispatch({ type: "bonus-roll", value: rollDice(RULES.dice.sides) }),
      chooseDifficulty: (difficulty: Difficulty) => {
        const question = drawQuestion(difficulty);
        if (question) dispatch({ type: "choose-difficulty", question });
      },
      answer: (optionIndex: number) =>
        dispatch({ type: "answer", optionIndex }),
      buyProperty: (propertyId: PropertyId) =>
        dispatch({ type: "buy-property", propertyId }),
      buyShares: (companyId: CompanyId, quantity: number) =>
        dispatch({ type: "buy-shares", companyId, quantity }),
      decline: () => dispatch({ type: "decline" }),
      endTurn: () => dispatch({ type: "end-turn" }),
      newGame: () =>
        dispatch({ type: "reset", seed: randomSeed(), playerNames }),
      dispatch: dispatch as React.Dispatch<GameAction>,
    }),
    [drawQuestion, playerNames],
  );

  return { state, ...actions };
}
