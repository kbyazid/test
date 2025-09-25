'use client'

import { useEffect, useState } from 'react'
import { budgetCache } from '@/lib/budgetCache'
import { Budget, Transaction } from '@/type'
import BudgetDetailsClient from './BudgetDetailsClient'

interface BudgetDetailsWithCacheProps {
  budgetId: string
  fallbackBudget: Budget
  fallbackTransactions: Transaction[]
}

export default function BudgetDetailsWithCache({ 
  budgetId, 
  fallbackBudget, 
  fallbackTransactions 
}: BudgetDetailsWithCacheProps) {
  const [budget, setBudget] = useState(fallbackBudget)
  const [transactions, setTransactions] = useState(fallbackTransactions)
  const [isFromCache, setIsFromCache] = useState(false)

  useEffect(() => {
    const cachedData = budgetCache.get(budgetId)
    if (cachedData) {
      setBudget(cachedData.budget)
      setTransactions(cachedData.transactions)
      setIsFromCache(true)
    }
  }, [budgetId])

  return (
    <>
      {isFromCache && (
        <div className="alert alert-info mb-4">
          <span>Données chargées depuis le cache (navigation rapide)</span>
        </div>
      )}
      <BudgetDetailsClient budget={budget} initialTransactions={transactions} />
    </>
  )
}