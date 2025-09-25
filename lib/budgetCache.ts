'use client'

import { Budget, Transaction } from '@/type'

interface BudgetData {
  budget: Budget
  transactions: Transaction[]
  timestamp: number
}

class BudgetCache {
  private cache = new Map<string, BudgetData>()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  set(budgetId: string, budget: Budget, transactions: Transaction[]) {
    this.cache.set(budgetId, {
      budget,
      transactions,
      timestamp: Date.now()
    })
  }

  get(budgetId: string): { budget: Budget; transactions: Transaction[] } | null {
    const data = this.cache.get(budgetId)
    if (!data) return null

    // Vérifier si les données sont encore valides
    if (Date.now() - data.timestamp > this.CACHE_DURATION) {
      this.cache.delete(budgetId)
      return null
    }

    return {
      budget: data.budget,
      transactions: data.transactions
    }
  }

  invalidate(budgetId: string) {
    this.cache.delete(budgetId)
  }

  clear() {
    this.cache.clear()
  }
}

export const budgetCache = new BudgetCache()