"use client";
import React, { useEffect, useState } from 'react'
import { Send, Trash } from 'lucide-react';
import BudgetItemPrct from '@/app/components/BudgetItemPrct';
/* import { redirect } from 'next/navigation'; */
import { Budget } from "@/type";
import { getTransactionsByBudgetId } from '@/action';
import Wrapper from '@/app/components/Wrapper';

const BudgetItems = ({ params }: { params: Promise<{ budgetId: string }> }) => {
  const [budgetId, setBudgetId] = useState<string>('');
  const [budget, setBudget] = useState<Budget | null>(null);
  const [description, setDescription] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  
const [, setTransactionToDelete] = useState<string | null>(null);

// Utilisation factice pour éviter le warning ESLint
useEffect(() => {
  if (budgetId) {
    console.log("ID du budget sélectionné :", budgetId);
  }
}, [budgetId]);

  async function fetchBudgetData(budgetId: string) {
    try {
      
        const budgetData = await getTransactionsByBudgetId(budgetId)
        console.log(budgetData)
        setBudget(budgetData)
      
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du budget et des transactions:",
        error)
    }
  }

  useEffect(() => {
    const getId = async () => {
      const resolvedParams = await params;
      setBudgetId(resolvedParams.budgetId)
      fetchBudgetData(resolvedParams.budgetId)
    }
    getId()
  }, [params])
  
  return (
    <Wrapper>
     {/* Afficher la notification si elle existe */}
     

      {/* Modal de suppression de transaction */}
      <dialog id="delete_transaction_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Confirmation de suppression</h3>
          <p className="py-4">Êtes-vous sûr de vouloir supprimer cette transaction ?</p>
          <div className="flex justify-end gap-4">
            <button
              className="btn btn-ghost"
              onClick={() => {
                const modal = document.getElementById('delete_transaction_modal');
                if (modal instanceof HTMLDialogElement) {
                  modal.close();
                }
              }}
            >
              Annuler
            </button>
            {/* <button className="btn btn-ghost" onClick={() => document.getElementById('delete_transaction_modal')?.close()}>
              Annuler
            </button> */}
            <button
              className="btn btn-error"
              onClick={() => {
               /*  handleDeleteTransaction(); */
                const modal = document.getElementById('delete_transaction_modal');
                if (modal instanceof HTMLDialogElement) {
                  modal.close();
                }
              }}
            >
               Supprimer
            </button>

            {/* <button
              className="btn btn-error"
              onClick={() => {
                handleDeleteTransaction();
                document.getElementById('delete_transaction_modal')?.close();
              }}
            >
              Supprimer
            </button>
 */}
          </div>
        </div>
      </dialog>

      {/* Modal de suppression de budget */}

      {budget && (
        <div className='flex md:flex-row flex-col'>
          <div className='md:w-1/3'>
            <BudgetItemPrct budget={budget} enableHover={0} depenseColor='text-red-500 font-bold' />
                       
            <div className='space-y-4 flex flex-col mt-4'>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
                className="input input-bordered"
              />

              <input
                type="number"
                id="amount"
                placeholder="Montant"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className=" input input-bordered"
              />

              <button
                className="btn"
              >
                Ajouter votre dépense
              </button>
            </div>
          </div>

          {budget?.transaction && budget.transaction.length > 0 ? (
            <div className="md:mt-0 mt-4 md:w-2/3 mx-2">
              <div className="overflow-x-auto space-y-4 flex flex-col">
                <table className="table table-zebra ">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Montant</th>
                      <th>Description</th>
                      <th>Date</th>
                      <th>Heure</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budget?.transaction?.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className='text-lg md:text-3xl'>{transaction.emoji}</td>
                        <td>
                          <div className="badge badge-accent badge-xs md:badge-sm">
                            - {transaction.amount} Da</div>
                        </td>
                        <td>{transaction.description}</td>
                        <td>
                          {transaction.createdAt.toLocaleDateString("fr-FR")}
                        </td>
                        <td>
                          {transaction.createdAt.toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                          })}
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              setTransactionToDelete(transaction.id);
                              const modal = document.getElementById('delete_transaction_modal');
                              if (modal instanceof HTMLDialogElement) {
                                modal.showModal();
                              }
                              
                            }}
                            className='btn btn-sm'
                          >
                            <Trash className='w-4' />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className='md:w-2/3 mt-10 md:ml-4 flex items-center justify-center'>
              <Send strokeWidth={1.5} className='w-8 h-8 text-accent' />
              <span className='text-gray-500 ml-2'>aucune transaction.</span>
            </div>
          )}
        </div>
      )}
    </Wrapper>
  )
}

export default BudgetItems
