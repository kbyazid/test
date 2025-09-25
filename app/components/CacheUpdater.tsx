'use client'

import { useEffect } from 'react'
import { budgetCache } from '@/lib/budgetCache'
import { Budget, Transaction } from '@/type'

interface CacheUpdaterProps {
  budgetId: string
  budget: Budget
  transactions: Transaction[]
}

export default function CacheUpdater({ budgetId, budget, transactions }: CacheUpdaterProps) {
  useEffect(() => {
    budgetCache.set(budgetId, budget, transactions)
  }, [budgetId, budget, transactions])

  return null
}