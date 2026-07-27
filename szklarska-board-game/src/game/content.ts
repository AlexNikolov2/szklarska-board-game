import type { Difficulty, Question } from "./types";

/* =====================================================================
   QUESTION BANK
   ---------------------------------------------------------------------
   Grouped by difficulty. Add entries freely — the engine draws from
   whatever is here and never repeats a question within a game.
   ===================================================================== */

export const QUESTION_BANK: Question[] = [
  /* ---------------------------- EASY ------------------------------- */
  {
    id: "easy-1",
    difficulty: "easy",
    prompt: "What is a business plan mainly used for?",
    options: [
      "Decorating the office",
      "Describing how the business will make money and reach its goals",
      "Paying taxes",
      "Hiring interns",
    ],
    answerIndex: 1,
    explanation:
      "A business plan sets out the model, market, operations and finances so the team and investors share one picture.",
  },
  {
    id: "easy-2",
    difficulty: "easy",
    prompt: 'What does "revenue" mean?',
    options: [
      "Money left after all costs",
      "Total money earned from sales before costs",
      "Money borrowed from a bank",
      "The value of the founders’ shares",
    ],
    answerIndex: 1,
    explanation:
      "Revenue is top-line sales. Profit is what survives the costs.",
  },
  {
    id: "easy-3",
    difficulty: "easy",
    prompt: 'Who is a "target customer"?',
    options: [
      "Anyone who might one day buy anything",
      "The specific group whose problem your product solves best",
      "Your investors",
      "Your suppliers",
    ],
    answerIndex: 1,
    explanation:
      "Naming a narrow target makes marketing cheaper and the product sharper.",
  },
  {
    id: "easy-4",
    difficulty: "easy",
    prompt: "What is an MVP?",
    options: [
      "The most valuable person on the team",
      "The smallest version of the product that tests the core idea with real users",
      "A finished, fully featured product",
      "A marketing video",
    ],
    answerIndex: 1,
    explanation:
      "A minimum viable product buys you evidence at the lowest possible cost.",
  },

  /* --------------------------- MEDIUM ------------------------------ */
  {
    id: "medium-1",
    difficulty: "medium",
    prompt: 'What does "runway" tell a founder?',
    options: [
      "How long until the product launches",
      "How many months the company can operate before it runs out of cash",
      "Total money raised so far",
      "The margin on each sale",
    ],
    answerIndex: 1,
    explanation:
      "Runway = cash ÷ net monthly burn. It is the clock every other decision runs against.",
  },
  {
    id: "medium-2",
    difficulty: "medium",
    prompt: "Why do co-founders normally agree on a vesting schedule?",
    options: [
      "It is legally required everywhere",
      "It guarantees equal ownership forever",
      "It ties equity to time actually spent building the company",
      "It lowers the company’s tax bill",
    ],
    answerIndex: 2,
    explanation:
      "If someone leaves early their unvested shares return to the company, protecting those who stay.",
  },
  {
    id: "medium-3",
    difficulty: "medium",
    prompt: "Which is the strongest early signal of real demand?",
    options: [
      "A lot of social media likes",
      "Friends saying the idea sounds great",
      "Customers paying before the product is finished",
      "A large addressable market on paper",
    ],
    answerIndex: 2,
    explanation: "Opinions are cheap. Pre-payment is commitment.",
  },
  {
    id: "medium-4",
    difficulty: "medium",
    prompt: "What does gross margin measure?",
    options: [
      "Revenue minus the direct cost of delivering the product",
      "Revenue minus all company expenses",
      "Cash in the bank at year end",
      "The company’s valuation",
    ],
    answerIndex: 0,
    explanation:
      "Gross margin shows whether the product itself is economically viable before overheads.",
  },

  /* ---------------------------- HARD ------------------------------- */
  {
    id: "hard-1",
    difficulty: "hard",
    prompt:
      "A startup has a CAC of 120 and a customer lifetime value of 300. What does that ratio suggest?",
    options: [
      "Acquisition is unsustainable and must stop",
      "The unit economics work, so acquisition can likely be scaled",
      "The company is already profitable",
      "The company should immediately raise prices",
    ],
    answerIndex: 1,
    explanation:
      "An LTV:CAC of 2.5:1 is workable; roughly 3:1 is the usual benchmark for confident scaling.",
  },
  {
    id: "hard-2",
    difficulty: "hard",
    prompt:
      "What is the main effect of a liquidation preference for investors?",
    options: [
      "It gives investors board control",
      "It sets who gets paid first, and how much, when the company is sold",
      "It fixes the share price of future rounds",
      "It forces the founders to stay",
    ],
    answerIndex: 1,
    explanation:
      "Preferences reorder the exit waterfall. A 1x non-participating preference is the founder-friendly norm.",
  },
  {
    id: "hard-3",
    difficulty: "hard",
    prompt: "Product-market fit is best described as:",
    options: [
      "Having a finished product",
      "A market that visibly pulls the product out of the company",
      "Being profitable",
      "Having raised venture funding",
    ],
    answerIndex: 1,
    explanation:
      "At fit, retention and word of mouth grow faster than you can serve them; funding is an input, not proof.",
  },
  {
    id: "hard-4",
    difficulty: "hard",
    prompt: "Why is a convertible note used instead of a priced round?",
    options: [
      "It avoids agreeing on a valuation while still raising money now",
      "It is always cheaper than equity",
      "It gives investors no rights at all",
      "It removes the need for legal documents",
    ],
    answerIndex: 0,
    explanation:
      "The note converts at the next priced round, usually with a discount or cap, deferring the valuation debate.",
  },
];

export function questionsByDifficulty(difficulty: Difficulty): Question[] {
  return QUESTION_BANK.filter((question) => question.difficulty === difficulty);
}
