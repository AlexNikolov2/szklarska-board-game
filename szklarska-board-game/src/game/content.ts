import type { BoardSquare, Question } from "./types";

/* =====================================================================
   BOARD CONTENT
   ---------------------------------------------------------------------
   Pure data. Swap these arrays to change the game without touching a
   single component. Square count only has to be a multiple of
   BOARD_CONFIG.columns if you want perfectly full rows.
   ===================================================================== */

export const BOARD_SQUARES: BoardSquare[] = [
  { id: 0, category: "idea", label: "Spot a problem" },
  { id: 1, category: "market", label: "Talk to 5 users" },
  { id: 2, category: "idea", label: "Value proposition" },
  { id: 3, category: "chance", label: "Chance", bonus: 1 },
  { id: 4, category: "finance", label: "Bootstrap budget" },
  { id: 5, category: "team", label: "Find a co-founder" },
  { id: 6, category: "risk", label: "Register the company" },
  { id: 7, category: "market", label: "First landing page" },
  { id: 8, category: "idea", label: "Build an MVP" },
  { id: 9, category: "finance", label: "Price the product" },
  { id: 10, category: "chance", label: "Chance", bonus: -1 },
  { id: 11, category: "market", label: "First paying client" },
  { id: 12, category: "risk", label: "Sign a contract" },
  { id: 13, category: "team", label: "First hire" },
  { id: 14, category: "finance", label: "Cash-flow crunch", bonus: -1 },
  { id: 15, category: "growth", label: "Product-market fit" },
  { id: 16, category: "market", label: "Acquisition channel" },
  { id: 17, category: "chance", label: "Chance", bonus: 2 },
  { id: 18, category: "finance", label: "Raise a round" },
  { id: 19, category: "team", label: "Build the culture" },
  { id: 20, category: "growth", label: "Scale up" },
];

export const QUESTIONS: Question[] = [
  {
    id: "idea-1",
    category: "idea",
    prompt: "What is the main purpose of a value proposition?",
    options: [
      "To describe the company’s legal structure",
      "To state clearly which customer problem you solve and why it matters",
      "To list every feature the product has",
      "To set the annual revenue target",
    ],
    answerIndex: 1,
    explanation:
      "A value proposition names the customer, their problem, and the specific benefit your solution delivers.",
  },
  {
    id: "finance-1",
    category: "finance",
    prompt: 'What does "runway" mean for a startup?',
    options: [
      "The time until the product launches",
      "The number of months the company can operate before it runs out of cash",
      "The total money raised so far",
      "The profit margin on each sale",
    ],
    answerIndex: 1,
    explanation:
      "Runway = cash in the bank ÷ net monthly burn. It tells you how long you have to reach the next milestone.",
  },
  {
    id: "market-1",
    category: "market",
    prompt: "Which is the strongest early signal of demand?",
    options: [
      "Lots of social media likes",
      "Friends saying the idea sounds great",
      "Customers paying for the product before it is finished",
      "A large addressable market on paper",
    ],
    answerIndex: 2,
    explanation:
      "Pre-payment is real commitment. Opinions are cheap; money is evidence.",
  },
  {
    id: "team-1",
    category: "team",
    prompt: "Why do founders usually agree on a vesting schedule?",
    options: [
      "It is legally required in every country",
      "It guarantees equal ownership forever",
      "It ties equity to time actually spent building the company",
      "It reduces the company’s tax bill",
    ],
    answerIndex: 2,
    explanation:
      "Vesting protects the remaining founders if someone leaves early, since unvested shares return to the company.",
  },
  {
    id: "risk-1",
    category: "risk",
    prompt: "What is the point of an NDA in early business talks?",
    options: [
      "It transfers ownership of the idea",
      "It legally restricts the other side from sharing information you disclose",
      "It replaces a founders’ agreement",
      "It registers your trademark",
    ],
    answerIndex: 1,
    explanation:
      "An NDA governs confidentiality only. Ownership needs assignment clauses or IP registration.",
  },
  {
    id: "growth-1",
    category: "growth",
    prompt: "Product-market fit is best described as:",
    options: [
      "Having a finished product",
      "A market that clearly pulls the product out of the company",
      "Being profitable",
      "Having raised venture funding",
    ],
    answerIndex: 1,
    explanation:
      "At fit, demand outpaces your ability to serve it: usage, retention and word of mouth grow on their own.",
  },
  {
    id: "chance-1",
    category: "chance",
    prompt: "A competitor just raised a huge round. What is the sane response?",
    options: [
      "Copy their roadmap immediately",
      "Stay on your own strategy and keep talking to your customers",
      "Cut prices to zero",
      "Announce a pivot",
    ],
    answerIndex: 1,
    explanation:
      "Funding is an input, not an outcome. Your customers, not their press release, should set your roadmap.",
  },
];
