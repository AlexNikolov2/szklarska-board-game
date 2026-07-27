import type { Company, CompanyId, Property, PropertyId } from "./types";

/* =====================================================================
   ASSET CATALOG
   ---------------------------------------------------------------------
   What an action square can offer. Pure data — prices and yields only.
   ===================================================================== */

export const PROPERTIES: Property[] = [
  { id: "apartment", label: "Apartment", cost: 2 },
  { id: "gym", label: "Gym", cost: 4 },
  { id: "hotel", label: "Hotel", cost: 6 },
  { id: "office", label: "Office Building", cost: 8 },
];

export const COMPANIES: Company[] = [
  {
    id: "alpha",
    name: "AlphaInvestments",
    sharePrice: 30,
    incomePerSquare: 3,
  },
  { id: "beta", name: "BetaAI", sharePrice: 20, incomePerSquare: 2 },
  { id: "gamma", name: "GammaFoods", sharePrice: 10, incomePerSquare: 1 },
];

export const PROPERTY_BY_ID = Object.fromEntries(
  PROPERTIES.map((property) => [property.id, property]),
) as Record<PropertyId, Property>;

export const COMPANY_BY_ID = Object.fromEntries(
  COMPANIES.map((company) => [company.id, company]),
) as Record<CompanyId, Company>;

/** A fresh, unowned share portfolio. A factory so players never share one. */
export function emptyPortfolio(): Record<CompanyId, number> {
  return {
    alpha: 0,
    beta: 0,
    gamma: 0,
  };
}
