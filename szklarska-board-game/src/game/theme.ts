import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Cpu,
  Dumbbell,
  Footprints,
  Handshake,
  Hotel,
  House,
  CircleHelp,
  Rocket,
  Wheat,
} from "lucide-react";

import { RULES } from "./rules";
import type { CompanyId, Difficulty, PropertyId, SquareKind } from "./types";

/* =====================================================================
   GAME THEME
   ---------------------------------------------------------------------
   The semantic layer of the design system. Colours themselves live in
   src/index.css as CSS variables; this file only decides WHICH token a
   given game concept uses. To re-skin: edit index.css. To re-map a
   concept to a different token or icon: edit this file.
   ===================================================================== */

export type SurfaceTheme = {
  label: string;
  description: string;
  icon: LucideIcon;
  /** Tile surface: background + foreground + border tokens. */
  tile: string;
  /** Small colour chip used in legends. */
  swatch: string;
  /** Accent text colour for headings. */
  accent: string;
};

export const SQUARE_KIND_THEME: Record<SquareKind, SurfaceTheme> = {
  base: {
    label: "Base",
    description: "Nothing happens here — but you only move 1 square next turn.",
    icon: Footprints,
    tile: "bg-kind-base text-kind-base-fg border-kind-base-border",
    swatch: "bg-kind-base border-kind-base-border",
    accent: "text-kind-base-fg",
  },
  question: {
    label: "Question",
    description: "Pick a difficulty, answer it, then roll for a free move.",
    icon: CircleHelp,
    tile: "bg-kind-question text-kind-question-fg border-kind-question-border",
    swatch: "bg-kind-question border-kind-question-border",
    accent: "text-kind-question-fg",
  },
  action: {
    label: "Action",
    description:
      "Buy a property or invest in a company — then move 1 square next turn.",
    icon: Handshake,
    tile: "bg-kind-action text-kind-action-fg border-kind-action-border",
    swatch: "bg-kind-action border-kind-action-border",
    accent: "text-kind-action-fg",
  },
};

export type DifficultyTheme = {
  label: string;
  tile: string;
  accent: string;
};

export const DIFFICULTY_THEME: Record<Difficulty, DifficultyTheme> = {
  easy: {
    label: "Easy",
    tile: "bg-level-easy text-level-easy-fg border-level-easy-border",
    accent: "text-level-easy-fg",
  },
  medium: {
    label: "Medium",
    tile: "bg-level-medium text-level-medium-fg border-level-medium-border",
    accent: "text-level-medium-fg",
  },
  hard: {
    label: "Hard",
    tile: "bg-level-hard text-level-hard-fg border-level-hard-border",
    accent: "text-level-hard-fg",
  },
};

export const PROPERTY_ICON: Record<PropertyId, LucideIcon> = {
  apartment: House,
  gym: Dumbbell,
  hotel: Hotel,
  office: Building2,
};

export const COMPANY_ICON: Record<CompanyId, LucideIcon> = {
  alpha: Rocket,
  beta: Cpu,
  gamma: Wheat,
};

/** Surfaces for the two halves of an action square's offer. */
export const ASSET_THEME = {
  property:
    "bg-asset-property text-asset-property-fg border-asset-property-border",
  company: "bg-asset-company text-asset-company-fg border-asset-company-border",
} as const;

/* ---------------------------------------------------------------------
   Terminals (START / FINISH) use their own tokens.
   --------------------------------------------------------------------- */
export const TERMINAL_THEME = {
  start: "bg-start text-start-fg border-start-border",
  finish: "bg-finish text-finish-fg border-finish-border",
} as const;

/* ---------------------------------------------------------------------
   Pawn colours, indexed by seat.
   --------------------------------------------------------------------- */
export const PAWN_THEME = [
  "bg-pawn-1",
  "bg-pawn-2",
  "bg-pawn-3",
  "bg-pawn-4",
] as const;

/* ---------------------------------------------------------------------
   Board geometry. Sizes come from --square-size / --square-gap in CSS;
   the shape comes from RULES.board.
   --------------------------------------------------------------------- */
export const BOARD_CONFIG = {
  columns: RULES.board.columns,
  rows: RULES.board.rows,
  startLabel: "START",
  finishLabel: "FINISH",
} as const;
