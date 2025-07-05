import React from 'react'
import Wrapper from '../components/Wrapper'
import { getAllTransactions } from '@/action';
import TransactionItem from '../components/TransactionItem';

const Transaction = async () => {
  const transactions = await getAllTransactions();   /* - Récupération des Transactions */

  return (
    <Wrapper >
    <div className="md:mt-0 mt-4 mx-auto max-w-full">
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th></th>
            <th className="hidden md:table-cell">Date</th>
            <th className="md:hidden text-left px-2 py-3">Détails</th>
            <th className="hidden md:table-cell">Description</th>
            <th className="hidden md:table-cell">Budget / Type</th>
            <th className="text-right">Montant</th>
            <th className="text-center hidden md:table-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <TransactionItem 
              key={transaction.id} 
              transaction={transaction} 
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
  </Wrapper>
  )
}

export default Transaction