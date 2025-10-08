import { useState, useEffect } from 'react';
import {
  getLastBudgets,
  getLastTransactions,
  getReachedBudgets,
  getTotalTransactionAmount,
  getTransactionCount,
  getUserBudgetData,
  getDailyExpensesSummary,
  DailyExpense
} from '@/action';
import { Budget, Transaction } from '@/type';

interface BudgetSummary {
  budgetName: string;
  totalBudgetAmount: number;
  totalTransactionsAmount: number;
}

export interface DashboardData {
  totalAmount: number;
  totalCount: number;
  reachedBudgetsRatio: string;
  budgetData: BudgetSummary[];
  transactions: Transaction[];
  budgets: Budget[];
  dailyExpenses: DailyExpense[];
}

export function useDashboardData(email: string | undefined) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Requêtes parallèles avec Promise.all
        const [
          amount,
          count,
          reachedBudgets,
          budgetsData,
          lastTransactions,
          lastBudgets,
          dailySummary
        ] = await Promise.all([
          getTotalTransactionAmount(email),
          getTransactionCount(email),
          getReachedBudgets(email),
          getUserBudgetData(email),
          getLastTransactions(email),
          getLastBudgets(email),
          getDailyExpensesSummary(email)
        ]);

        setData({
          totalAmount: amount,
          totalCount: count,
          reachedBudgetsRatio: reachedBudgets,
          budgetData: budgetsData,
          transactions: lastTransactions,
          budgets: lastBudgets,
          dailyExpenses: dailySummary
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Impossible de charger les données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [email]);

  return { data, isLoading, error };
}