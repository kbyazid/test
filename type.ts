
export type Period = 'last7' | 'last30' | 'last90' | 'last365' | 'all';

export type Totals = {
    balance: number;
    totalIncome: number;
    totalExpenses: number;
};

export interface User {
    id: string;
    email: string;
  }

export interface Budget {
    id: string;
    createdAt: Date;
    name: string;
    amount: number;
    emoji: string | null;
    transaction?: Transaction[];
}

export interface Transaction {
    id: string;
    amount: number;
    emoji: string | null;
    description: string;
    createdAt: Date;
    budgetName?: string | null;
    budgetId?: string | null;
    type: "income" | "expense"; // 👈 Nouveau champ
    userId: string | null
  }