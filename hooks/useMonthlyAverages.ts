import { useMemo } from 'react';
import { DailyExpense } from '@/action';

export interface MonthlyAverage {
  month: string;
  average: number;
}

export function useMonthlyAverages(dailyExpenses: DailyExpense[]) {
  return useMemo(() => {
    const currentYear = new Date().getFullYear();
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    return months.map((month, index) => {
      const monthExpenses = dailyExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === currentYear && expenseDate.getMonth() === index;
      });
      
      const monthTotal = monthExpenses.reduce((sum, expense) => sum + expense.totalAmount, 0);
      const daysInMonth = monthExpenses.length || 1;
      
      return {
        month,
        average: monthTotal / daysInMonth
      };
    });
  }, [dailyExpenses]);
}