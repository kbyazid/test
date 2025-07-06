"use client"

import { Transaction } from '@/type'
import Wrapper from '../components/Wrapper'
import React, { useEffect, useState } from 'react'
import { getAllTransactions, getTotalTransactionAmountByEmail } from '@/action';
import Notification, { NotificationType, NotificationPosition } from '@/app/components/Notification'
import { formatCurrency, formatDate } from '@/lib/utils'
import {  
    ArrowDownCircle,
    ArrowUpCircle,
    CircleDollarSignIcon,
    Trash, 
    View 
  } from 'lucide-react'
  import Link from 'next/link'
import DashboardCard from '../components/DashboardCard';
import TransactionCard from '../components/TransactionCard';


// Types et interfaces
/* type Period = 'last7' | 'last30' | 'last90' | 'last365' | 'all' */

interface NotificationDetails {
  message: string;
  type: NotificationType;
  position: NotificationPosition;
}

type Totals = {
  balance: number
  totalIncome: number
  totalExpenses: number
} 

const TransactionPage = () => {
    // États
  
  const [loading, setLoading] = useState<boolean>(true)   
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null)
  const [, setTransactionToDelete] = useState<string | null>(null)
  const [notification, setNotification] = useState<NotificationDetails | null>(null)  
  // Fonctions utilitaires
 
  const showNotification = (message: string, type: NotificationType, position: NotificationPosition) => {
    setNotification({ message, type, position });
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };
  
  /* const transactions = await getAllTransactions(); */   /* - Récupération des Transactions */
  // Gestion des transactions
  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const data = await getAllTransactions();
      setTransactions(data);
      showNotification("Transactions chargées", "success", "top-center");
    } catch (error) {
      console.error("Erreur de chargement :", error);
      showNotification("Erreur lors du chargement", "error", "top-center");
    } finally {
      setLoading(false)
    }
  };

  const fetchTotals = async () => {
        
    try {
      const result = await getTotalTransactionAmountByEmail()
      setTotals(result || null); // Utilisez || null pour gérer le cas où 'result' est undefined
    } catch (err) {
      console.error("Failed to fetch totals:", err)
      showNotification("Erreur lors de la récupération des totaux.", "error", "top-center")
    }
  };

   // Effets
  useEffect(() => { 
    fetchTransactions();
    fetchTotals();
  }, []);
  
  /* showNotification("Test notification.", "error", "top-center") */
  // Rendu
  return (
    <Wrapper >
        {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          onclose={handleCloseNotification}
          type={notification.type}
          position={notification.position}
        />
      )}

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <DashboardCard
          label="Solde"
          value={totals?.balance != null ? formatCurrency(totals.balance) : "N/A"}
          icon={<CircleDollarSignIcon />}
        />

        <TransactionCard
          label="Recettes"
          value={totals?.totalIncome != null ? formatCurrency(totals.totalIncome) : "N/A"}
          icon={<ArrowDownCircle className="text-blue-600 w-8 h-8" />}
          cardColor="income"
        />

        <TransactionCard
          label="Dépenses"
          value={totals?.totalExpenses != null ? formatCurrency(totals.totalExpenses) : "N/A"}
          icon={<ArrowUpCircle className="text-red-600 w-8 h-8" />}
          cardColor="expense"
        />
      </div>

      {/* Transactions List */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        
        <TransactionsTable 
          transactions={transactions}
          onDelete={(id) => {
            setTransactionToDelete(id)
            ;(document.getElementById('delete_transaction_modal') as HTMLDialogElement)?.showModal()
          }}
        />
    )}
  </Wrapper>
  )
}

// Sous-composants
const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-10">
      <span className="loading loading-spinner loading-lg text-accent"></span>
      <span className="ml-4 font-bold text-accent">Chargement des transactions...</span>
    </div>
  )

const TransactionsTable = ({
    transactions,
    onDelete
  }: {
    transactions: Transaction[],
    onDelete: (id: string) => void
  }) => (
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
              <TransactionRow 
                key={transaction.id} 
                transaction={transaction} 
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )


const TransactionRow = ({
    transaction,
    onDelete
  }: {
    transaction: Transaction,
    onDelete: (id: string) => void
  }) => {
    const isIncome = transaction.type === "income"
    const amountClass = isIncome ? "text-green-600" : "text-red-600"
    const amountSign = isIncome ? '+' : '-'
    const formattedAmount = formatCurrency(Math.abs(transaction.amount))
    
    return (
      <tr className="hover">
        <td className='text-lg md:text-3xl p-2 md:p-4'>{transaction.emoji || '💸'}</td>
        
        <td className='hidden md:table-cell p-2 md:p-4'>
          <div className='flex flex-col'>
            <span className='text-sm font-medium'>
              {formatDate(transaction.createdAt, { withTime: false })}
            </span>
            <span className='text-xs text-gray-500'>
              {formatDate(transaction.createdAt, { withTime: true })}
            </span>
          </div>
        </td>
  
        <td className="md:hidden px-2 py-3">
          <div className='flex flex-col items-start'>
            <span className='text-xs text-gray-500 mb-1'>
              {formatDate(transaction.createdAt, { withTime: true })}
            </span>
            <span className='font-bold text-sm mb-1'>{transaction.description}</span>
            {transaction.budgetName && (
              <span className="badge badge-outline badge-info text-xs mb-1">
                {transaction.budgetName}
              </span>
            )}
            <span className={`badge badge-outline ${
              isIncome ? 'badge-success' : 'badge-error'
            } text-xs mb-1`}>
              {isIncome ? 'Recette' : 'Dépense'}
            </span>
            <div className='flex items-center gap-2 mt-2'>
              {isIncome ? (
                <DeleteButton onClick={() => onDelete(transaction.id)} />
              ) : transaction.budgetId ? (
                <ViewButton budgetId={transaction.budgetId} />
              ) : null}
            </div>
          </div>
        </td>
        
        <td className='hidden md:table-cell p-2 md:p-4'>
          {transaction.description}
        </td>
        
        <td className='hidden md:table-cell p-2 md:p-4'>
          {transaction.budgetName && (
            <span className="badge badge-soft badge-info inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mb-1">
              {transaction.budgetName}
            </span>
          )}
          <span className={`badge badge-soft ${
            isIncome ? 'badge-success' : 'badge-error'
          } inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium`}>
            {isIncome ? 'Recette' : 'Dépense'}
          </span>
        </td>
        
        <td className={`text-right p-2 md:p-4 font-semibold ${amountClass}`}>
          {amountSign}{formattedAmount}
        </td>
        
        <td className='hidden md:table-cell text-center p-2 md:p-4'>
          <div className="flex items-center justify-center gap-2">
            {isIncome ? (
              <DeleteButton onClick={() => onDelete(transaction.id)} />
            ) : transaction.budgetId ? (
              <ViewButton budgetId={transaction.budgetId} />
            ) : null}
          </div>
        </td>
      </tr>
    )
  }

  const DeleteButton = ({ onClick }: { onClick: () => void }) => (
    <button
      title="Supprimer"
      onClick={onClick}
      className='btn btn-sm btn-ghost text-red-500 hover:bg-red-100'
    >
      <Trash className='w-4 h-4' />
    </button>
  )
  
  const ViewButton = ({ budgetId }: { budgetId: string }) => (
    <Link 
      href={`/manage/${budgetId}`} 
      title="Voir le budget associé" 
      className='btn btn-sm btn-ghost text-blue-500 hover:bg-blue-100'
    >
      <View className='w-4 h-4' />
    </Link>
  )

export default TransactionPage