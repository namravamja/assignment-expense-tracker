// types.ts
export type Category =
  | "food"
  | "housing"
  | "transportation"
  | "utilities"
  | "insurance"
  | "healthcare"
  | "entertainment"
  | "personal"
  | "education"
  | "income"
  | "other";

export interface BudgetFormData {
  category: Category;
  maxAmount: number;
}

export interface Budget extends BudgetFormData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  type: "income" | "expense";
  createdAt: string;
  updatedAt: string;
}

export interface ComparisonData {
  category: string;
  budget: number;
  actual: number;
  remaining: number;
  percentUsed: number;
}

export const CATEGORIES: Category[] = [
  "food",
  "housing",
  "transportation",
  "utilities",
  "insurance",
  "healthcare",
  "entertainment",
  "personal",
  "education",
  "income",
  "other",
];