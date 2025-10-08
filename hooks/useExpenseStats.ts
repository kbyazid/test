import { useMemo } from 'react';
import { DailyExpense } from '@/action';

export function useExpenseStats(dailyExpenses: DailyExpense[], days: number = 30) {
  return useMemo(() => {
    const daysToShow = Math.min(dailyExpenses.length, days);
    const expensesSlice = dailyExpenses.slice(0, daysToShow);
    const totalSum = expensesSlice.reduce((sum, expense) => sum + expense.totalAmount, 0);
    const average = daysToShow > 0 ? totalSum / daysToShow : 0;

    return { expensesSlice, average, daysToShow };
  }, [dailyExpenses, days]);
}