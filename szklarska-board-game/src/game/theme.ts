import type { LucideIcon } from "lucide-react";
import {
  Coins,
  Lightbulb,
  Megaphone,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

/* =====================================================================
   GAME THEME
   ---------------------------------------------------------------------
   The semantic layer of the design system. Colours themselves live in
   src/index.css as CSS variables; this file only decides WHICH token a
   given game concept uses. To re-skin: edit index.css. To re-map a
   category to a different token or icon: edit this file.
   ===================================================================== */

export const SQUARE_CATEGORIES = [
  "idea",
  "finance",
  "market",
  "team",
  "risk",
  "growth",
  "chance",
] as const;

export type SquareCategory = (typeof SQUARE_CATEGORIES)[number];

export type CategoryTheme = {
  /** Human readable name shown in the legend and question dialog. */
  label: string;
  /** One-liner used as the dialog subtitle. */
  description: string;
  icon: LucideIcon;
  /** Tile surface: background + foreground + border tokens. */
  tile: string;
  /** Small colour chip used in the legend. */
  swatch: string;
  /** Accent text colour, used for the question dialog heading. */
  accent: string;
};

export const CATEGORY_THEME: Record<SquareCategory, CategoryTheme> = {
  idea: {
    label: "Idea & Innovation",
    description: "Spot the opportunity and shape the value proposition.",
    icon: Lightbulb,
    tile: "bg-cat-idea text-cat-idea-fg border-cat-idea-border",
    swatch: "bg-cat-idea border-cat-idea-border",
    accent: "text-cat-idea-fg",
  },
  finance: {
    label: "Finance & Funding",
    description: "Runway, unit economics and where the money comes from.",
    icon: Coins,
    tile: "bg-cat-finance text-cat-finance-fg border-cat-finance-border",
    swatch: "bg-cat-finance border-cat-finance-border",
    accent: "text-cat-finance-fg",
  },
  market: {
    label: "Market & Customers",
    description: "Who you serve, and how they find out about you.",
    icon: Megaphone,
    tile: "bg-cat-market text-cat-market-fg border-cat-market-border",
    swatch: "bg-cat-market border-cat-market-border",
    accent: "text-cat-market-fg",
  },
  team: {
    label: "Team & Leadership",
    description: "Hiring, culture and the decisions only founders make.",
    icon: Users,
    tile: "bg-cat-team text-cat-team-fg border-cat-team-border",
    swatch: "bg-cat-team border-cat-team-border",
    accent: "text-cat-team-fg",
  },
  risk: {
    label: "Risk & Legal",
    description: "Contracts, compliance and the things that can sink you.",
    icon: ShieldAlert,
    tile: "bg-cat-risk text-cat-risk-fg border-cat-risk-border",
    swatch: "bg-cat-risk border-cat-risk-border",
    accent: "text-cat-risk-fg",
  },
  growth: {
    label: "Growth & Scale",
    description: "Turning something that works into something bigger.",
    icon: TrendingUp,
    tile: "bg-cat-growth text-cat-growth-fg border-cat-growth-border",
    swatch: "bg-cat-growth border-cat-growth-border",
    accent: "text-cat-growth-fg",
  },
  chance: {
    label: "Chance",
    description: "The market does what it wants. Draw and find out.",
    icon: Sparkles,
    tile: "bg-cat-chance text-cat-chance-fg border-cat-chance-border",
    swatch: "bg-cat-chance border-cat-chance-border",
    accent: "text-cat-chance-fg",
  },
};

/* ---------------------------------------------------------------------
   Terminals (START / FINISH) use their own tokens rather than a category.
   --------------------------------------------------------------------- */
export const TERMINAL_THEME = {
  start: "bg-start text-start-fg border-start-border",
  finish: "bg-finish text-finish-fg border-finish-border",
} as const;

/* ---------------------------------------------------------------------
   Pawn colours, indexed by player order.
   --------------------------------------------------------------------- */
export const PAWN_THEME = [
  "bg-pawn-1",
  "bg-pawn-2",
  "bg-pawn-3",
  "bg-pawn-4",
] as const;

/* ---------------------------------------------------------------------
   Board geometry. Sizes come from --square-size / --square-gap in CSS;
   only structural choices live here.
   --------------------------------------------------------------------- */
export const BOARD_CONFIG = {
  /** Tiles per row before the path turns and reverses direction. */
  columns: 7,
  startLabel: "START",
  finishLabel: "FINISH",
} as const;
