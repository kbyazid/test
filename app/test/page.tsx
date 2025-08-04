"use client"

import { Transaction } from '@/type'
import Wrapper from '../components/Wrapper'
import React, { useCallback, useEffect, useState } from 'react'
import { addIncomeTransaction, deleteTransaction,  getTotalTransactionAmountByEmailEffacer,  getTransactionsByPeriodEffacer } from '@/action';
import Notification, { NotificationType, NotificationPosition, NotificationDetails } from '@/app/components/Notification'
import { formatCurrency, formatDate } from '@/lib/utils'
import {  
    ArrowDownCircle,
    ArrowUpCircle,
    CircleDollarSignIcon,
    Send,
    Search, 
    Trash, 
    View, 
    Plus,
    Calculator,
  } from 'lucide-react'   /* X: a joute */
  import Link from 'next/link'
import DashboardCard from '../components/DashboardCard';
import TransactionCard from '../components/TransactionCard';


// Types et interfaces
type Period = 'last7' | 'last30' | 'last90' | 'last365' | 'all' 

/* interface NotificationDetails {
  message: string;
  type: NotificationType;
  position: NotificationPosition;
} */

type Totals = {
  balance: number
  totalIncome: number
  totalExpenses: number
} 

const TransactionPage = () => {
    // États
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)   
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)
  /*   const [, setTransactionToDelete] = useState<string | null>(null) */
  const [totals, setTotals] = useState<Totals | null>(null)
  const [notification, setNotification] = useState<NotificationDetails | null>(null)  
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPeriod, setCurrentPeriod] = useState<Period>('all')

 /*  const [filteredCount, setFilteredCount] = useState(0);
  const [filteredTotal, setFilteredTotal] = useState(0); */

  // Fonctions utilitaires 
   // Notification 
   const showNotification =(
     (message: string, type: NotificationType, position: NotificationPosition, persist?: boolean, opaque?: boolean, ) => {
       setNotification({ message, type, position, persist, opaque });
       /* setTimeout(() => setNotification(null), 3000); */
     });
 
   const handleCloseNotification = () => setNotification(null);

  const closeModal = (modalId: string) => {
    const modal = document.getElementById(modalId) as HTMLDialogElement | null
    modal?.close()
  }
  
  /* const transactions = await getAllTransactions(); */   /* - Récupération des Transactions */
  // Gestion des transactions
  // Récupérer les transactions pour une période donnée
  const fetchTransactions = async (period: Period) => {
    setLoading(true)
    try {
      const data = await getTransactionsByPeriodEffacer("tlemcencrma20@gmail.com",period);
      /* console.log("📦 Données reçues pour la période:", period, data); */ // ← AJOUT ICI
      /* console.log(`🔢 ${data?.length ?? 0} transactions récupérées`); */

      setTransactions(data|| []); // Utilisez || [] pour gérer undefined
      

      setCurrentPeriod(period)
      /* showNotification("Transactions chargées", "success", "top-center"); */
    } catch (error) {
      console.error("Erreur de chargement :", error);
      showNotification("Erreur lors du chargement", "error", "top-center");
    } finally {
      setLoading(false)
    }
  };

  const fetchTotals = async () => {     
    try {
      const result = await getTotalTransactionAmountByEmailEffacer()
      setTotals(result || null); // Utilisez || null pour gérer le cas où 'result' est undefined
    } catch (err) {
      console.error("Failed to fetch totals:", err)
      showNotification("Erreur lors de la récupération des totaux.", "error", "top-center")
    }
  };

   // Effets
  useEffect(() => { 
    fetchTransactions(currentPeriod);
    fetchTotals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPeriod]);
  
  const handleAddTransaction = async () => {
    /* if (!user?.primaryEmailAddress?.emailAddress) return */
    try {
      setIsAdding(true)
      const MIN_LOADING_TIME = 500
      const start = Date.now()

      // Validation
      const amountNumber = parseFloat(amount)
      if (isNaN(amountNumber) || amountNumber <= 0) {
        showNotification("Le montant doit être un nombre positif.", "warning", "top-center")
        return
      }

      const trimmedDescription = description.trim()
      if (!trimmedDescription) {
        showNotification("La description est requise.", "error", "top-center")
        return
      }

      await addIncomeTransaction(
        amountNumber, 
        trimmedDescription, 
        "tlemcencrma20@gmail.com"
      )
      
      await Promise.all([
        fetchTransactions(currentPeriod),
        fetchTotals()
      ])

      // Fermeture modale
      closeModal("add_income_modal")

      // Minimum loading time for better UX
      const elapsed = Date.now() - start
      const remainingTime = MIN_LOADING_TIME - elapsed
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime))
      }

      showNotification('Depense ajoutée avec succès', 'info', 'bottom-right')
      setAmount('')
      setDescription('')
    } catch (error) {
      console.error("Failed to add transaction:", error)
      showNotification(
        error instanceof Error ? error.message : "Une erreur est survenue",
        "error",
        "top-center"
      )
    } finally {
      setIsAdding(false)
    }
  };

  const handleDeleteTransaction = useCallback(async () => {
    if (!transactionToDelete) return

    try {
      await deleteTransaction(transactionToDelete)
      await fetchTransactions(currentPeriod)
      await fetchTotals()

      // ✅ Fermer la modale après suppression
   /*  const modal = document.getElementById("delete_transaction_modal") as HTMLDialogElement | null
    modal?.close() */
    closeModal("delete_transaction_modal")

      showNotification('Depense supprimée avec succès.', 'success', 'bottom-center')
      setTransactionToDelete(null)
    } catch (error) {
      console.error("Erreur lors de la suppression de la transaction:", error)
      showNotification("Erreur lors de la suppression de la transaction.", "error", "top-center")
    }
  }, [transactionToDelete, currentPeriod])

  // Filtrage
  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (transaction.budgetName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  )
  
  //setFilteredCount(filteredTransactions.length);
  
  /* const sum = filteredTransactions.reduce((acc, t) => acc + t.amount, 0); */
  const sum = filteredTransactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);
  const filterLabel = (
    <>
    <div className="grid md:grid-cols-2 font-bold text-accent gap-4">
    <div>
      <span className="text-blue-600 font-semibold">
        Résultat du filtre : {" "}
      </span>
      {filteredTransactions.length} transactions {" "}
      
    </div>
    <div>
      <span className="text-blue-600 font-semibold">
      Total : {" "}
      </span>
      {formatCurrency(sum)}
    </div>
    </div>
      
    </>
  );
  
  /* const filterLabel =`Résultat du filtre : ${filteredTransactions.length} transactions   – Total : ${formatCurrency(sum)}` */
  /* setFilteredTotal(sum);*/
  /* console.log("Totaux :", filteredTransactions.length, sum);  */

  /*       showNotification(
        `Résultat : ${filteredCount} transactions – Total : ${formatCurrency(filteredTotal)}`,
        'info',
        'top-center',
        true, 
        true  // ← nouveauté
      ); */
  

 /*  showNotification("Test notification.", "error", "top-center")  genere une erreur de render*/
  // Rendu
return (
  <Wrapper >
      {/* Composant Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          position={notification.position}
          persist={notification.persist}
          opaque={notification.opaque}
          onclose={handleCloseNotification}
        />
      )}

{/* Modals */}   
    <DeleteTransactionModal 
        onConfirm={handleDeleteTransaction}
        onCancel={() => {
            setTransactionToDelete(null)
            closeModal("delete_transaction_modal")
            /* const modal = document.getElementById("delete_transaction_modal") as HTMLDialogElement | null
            modal?.close() */
        }}
    />  
    <AddIncomeModal 
        description={description}
        amount={amount}
        isAdding={isAdding}
        onDescriptionChange={setDescription}
        onAmountChange={setAmount}
        onSubmit={handleAddTransaction}
      />

 {/* Header */}
 <div className="space-y-6 mb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recettes / Dépenses</h1>
          <p className="text-muted-foreground">Suivez et gérez vos transactions.</p>
        </div>
        <button
          onClick={() => (document.getElementById('add_income_modal') as HTMLDialogElement)?.showModal()}
          className='btn btn-primary flex items-center gap-2 bg-base-600 hover:bg-base-700 px-6 py-3 rounded-lg transition-all duration-200 font-medium whitespace-nowrap shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
        >
          <Plus className="h-5 w-5" />
          Ajouter une recette
        </button>
      </div>

{/* Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <DashboardCard
          label="Solde"
          value={totals?.balance != null ? formatCurrency(totals.balance) : "N/A"}
          icon={<CircleDollarSignIcon />}
        />
         
      
{/*
        <DashboardCard
          label="Dépenses"
          value={totals?.totalExpenses != null ? formatCurrency(totals.totalExpenses) : "N/A"}
          icon={<ArrowUpCircle className="text-red-600 w-8 h-8" />}
        /> */}
        <TransactionCard
          label="Recettes"
          value={totals?.totalIncome != null ? formatCurrency(totals.totalIncome): "N/A"}
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

{/* Search and Filter */}
      {/* <div className="flex flex-col md:flex-row items-center gap-4 mb-6"> */}
      {/* ici a mettre la version search */}
      {/* </div> */}

     {/* Version search operationnelle seulement la recherche  */}
     {/* search input 1 */}
{/*   <div className="input relative w-full md:flex-1">
          
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          
          <input
            type="search"
            value={searchQuery}
            placeholder="Rechercher par description ou budget..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-6'
          />
      </div>  */}

      {/* search input 2 */}
{/*   <div className="w-full md:flex-1 mt-4">
      <label className="input">
        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          type="search"
          value={searchQuery}
          placeholder="Rechercher par description ou budget..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </label>
      </div> */}

      {/* search input 3 */}
     {/*  <div className="relative w-full flex-1">
            <div className="relative">
              <button
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <Search className="h-4 w-4" />
              </button>

              <input
                type="text"
                placeholder="Rechercher par email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-base-50 focus:bg-base-200"
              />

              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
      </div> */}
    
     {/* Version search ameliore operationnelle   */}   
    <div className="card w-full bg-base-150 card-md shadow-md rounded-xl border-2 border-gray-300 ">
      <div className="card-body">
        <h2 className="card-title text-xl font-bold">Recherche</h2>
        <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
          <div className="input relative w-full md:flex-1">

            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />

            <input
              type="search"
              value={searchQuery}
              placeholder="Rechercher par description ou budget..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-6'
            />
          </div>


          {/* <div className='w-full md:w-auto'>
            <select
              className='input input-bordered input-md w-full'
              value={currentPeriod}
              onChange={(e) => fetchTransactions(e.target.value as Period)}
            >
              <option value="last7">Derniers 7 jours</option>
              <option value="last30">Derniers 30 jours</option>
              <option value="last90">Derniers 90 jours</option>
              <option value="last365">Derniers 365 jours</option>
              <option value="all">Toutes les transactions</option>
            </select>
          </div> */}

          <div className='w-full md:w-auto'>
            <select
              className='select w-full'
              value={currentPeriod}
              onChange={(e) => fetchTransactions(e.target.value as Period)}
            >
              <option value="last7">Derniers 7 jours</option>
              <option value="last30">Derniers 30 jours</option>
              <option value="last90">Derniers 90 jours</option>
              <option value="last365">Derniers 365 jours</option>
              <option value="all">Toutes les transactions</option>
            </select>
          </div>



        </div>

        <div className="justify-center card-actions">
          <div>
            <DashboardCard
              label={filterLabel}
              value={""}
              icon={<Calculator className="text-blue-500 w-8 h-8" />}
            />
          </div>
        </div>
      </div>
    </div> 

    {/* Version search operationnelle simple lui manque l initialisation  */}
 {/*    <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
      <div className="relative w-full flex-1">
        <div className="relative">
          <button
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <Search className="h-4 w-4" />
          </button>

          <input
            type="text"
            placeholder="Rechercher par email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-base-50 focus:bg-base-200"
          />

          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>


      <div className='w-full md:w-auto'>
        <select
          className='input input-bordered input-md w-full'
          value={currentPeriod}
          onChange={(e) => fetchTransactions(e.target.value as Period)}
        >
          <option value="last7">Derniers 7 jours</option>
          <option value="last30">Derniers 30 jours</option>
          <option value="last90">Derniers 90 jours</option>
          <option value="last365">Derniers 365 jours</option>
          <option value="all">Toutes les transactions</option>
        </select>
      </div>

    </div>  */}

    
{/*<div>
        <DashboardCard
            label= {filterLabel}
            value={""}
            icon={<Calculator className= "text-blue-500 w-8 h-8" />}
          />
    </div> */}
     

{/* Transactions List */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredTransactions.length === 0 ? (
        <EmptyState 
          searchQuery={searchQuery} 
          transactionsCount={transactions.length}
        />
      ) : (
        
        <TransactionsTable 
          transactions={filteredTransactions}
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

  const AddIncomeModal = ({
    description,
    amount,
    isAdding,
    onDescriptionChange,
    onAmountChange,
    onSubmit
  }: {
    description: string,
    amount: string,
    isAdding: boolean,
    onDescriptionChange: (value: string) => void,
    onAmountChange: (value: string) => void,
    onSubmit: () => void
  }) => (
    <dialog id="add_income_modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">Creation d une recette</h3>
        <p className="py-4">Ajoutez une nouvelle entree de revenu.</p>
        <div className="w-full flex flex-col space-y-4 mt-4">
          <input
            type="text"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Description de la recette"
            required
            className="input input-bordered"
          />
          <input
            type="number"
            placeholder="Montant"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            required
            className="input input-bordered"
          />
          <button 
            onClick={onSubmit} 
            className="btn" 
            disabled={isAdding || !description.trim() || !amount}
          >
            {isAdding ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Création...
              </>
            ) : "Ajouter Recette"}
          </button>
        </div>
      </div>
    </dialog>
  )

  const DeleteTransactionModal = ({ 
    onConfirm, 
    onCancel 
  }: { 
    onConfirm: () => void, 
    onCancel: () => void 
  }) => (
    <dialog id="delete_transaction_modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">Confirmation de suppression</h3>
        <p className="py-4">Êtes-vous sûr de vouloir supprimer cette transaction ?</p>
        <div className="flex justify-end gap-4">
          <button className="btn btn-ghost" onClick={onCancel}>
            Annuler
          </button>
          <button className="btn btn-error" onClick={onConfirm}>
            Supprimer
          </button>
        </div>
      </div>
    </dialog>
  )

  const EmptyState = ({ 
    searchQuery, 
    transactionsCount 
  }: { 
    searchQuery: string, 
    transactionsCount: number 
  }) => (
    <div className='flex flex-col justify-center items-center h-64 text-center'>
      <Send strokeWidth={1.5} className='w-12 h-12 text-accent mb-4' />
      <span className='text-gray-500 text-xl'>
        {searchQuery ? 
          "Aucune transaction ne correspond à votre recherche." : 
          "Aucune transaction à afficher pour le moment."}
      </span>
      {!searchQuery && transactionsCount === 0 && (
        <button
          onClick={() => (document.getElementById('add_income_modal') as HTMLDialogElement)?.showModal()}
          className='btn btn-accent mt-6'
        >
          Ajouter votre première recette de la periode
        </button>
      )}
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
    const amountClass = isIncome ? "text-green-600" : "text-sky-600"
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
      className='btn btn-sm btn-ghost text-red-300 hover:bg-red-100'
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