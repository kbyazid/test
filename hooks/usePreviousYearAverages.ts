import { useMemo } from 'react';
import { DailyExpense } from '@/action';

export interface MonthlyAverage {
  month: string;
  average: number;
}

export function usePreviousYearAverages(dailyExpenses: DailyExpense[]) {
  return useMemo(() => {
    const previousYear = new Date().getFullYear() - 1;
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    const previousYearData = months.map((month, index) => {
      const monthExpenses = dailyExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === previousYear && expenseDate.getMonth() === index;
      });
      
      const monthTotal = monthExpenses.reduce((sum, expense) => sum + expense.totalAmount, 0);
      const daysInMonth = monthExpenses.length || 1;
      
      return {
        month,
        average: monthTotal / daysInMonth
      };
    });

    // Vérifier s'il y a des données pour l'année précédente
    const hasData = previousYearData.some(item => item.average > 0);
    
    return {
      data: previousYearData,
      hasData,
      year: previousYear
    };
  }, [dailyExpenses]);
}