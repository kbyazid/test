"use client";

import { useParams } from "next/navigation";
import Wrapper from "@/app/components/Wrapper";
import React, { useEffect, useState, useCallback } from "react";
import { Send, Trash } from "lucide-react";
import { Budget } from "@/type";
import {  deleteTransaction } from "@/action";
import Notification, { NotificationType, NotificationPosition } from "@/app/components/Notification";

interface NotificationDetails {
  message: string;
  type: NotificationType;
  position: NotificationPosition;
}

const BudgetDetailPage = () => {
  const { budgetId } = useParams<{ budgetId: string }>(); // Typage explicite pour garantir que budgetId est un string
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationDetails | null>(null);

  const showNotification = useCallback(
    (message: string, type: NotificationType, position: NotificationPosition) => {
      setNotification({ message, type, position });
      setTimeout(() => setNotification(null), 3000); // Auto-dismiss after 3s
    },
    []
  );

  const handleCloseNotification = () => {
    setNotification(null);
  };

  const fetchBudgeTran = async (budgetId: string) => {
    try {
      setLoading(true);
      /* const res = await fetch(`/api/budget/${budgetId}`); */
      const res = await fetch(`/api/test-db2/${budgetId}`);
      console.log(res)
      const data = await res.json();
  
      if (!data.success) {
        throw new Error(data.error || "Erreur inconnue");
      }
  
      setBudget(data.budget);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Erreur lors du chargement du budget",
        "error",
        "top-center"
      );
    } finally {
      setLoading(false);
    }
  };
  
 /*  const fetchBudgeTran = async (budgetId: string) => {
    try {
      setLoading(true);
      const budgetData = await getTransactionsByBudgetId(budgetId, "tlemcencrma20@gmail.com");
      setBudget(budgetData);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Erreur lors du chargement du budget",
        "error",
        "top-center"
      );
    } finally {
      setLoading(false);
    }
  }; */

  /* const fetchBudgetData = async (budgetId: string) => {
    try {
      setLoading(true);
      const budgetData = await getTransactionsByBudgetId(budgetId);
      setBudget(budgetData);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Erreur lors du chargement du budget",
        "error",
        "top-center"
      );
    } finally {
      setLoading(false);
    }
  }; */

  const handleDeleteTransaction = async () => {
    if (!transactionToDelete) return;

    try {
      await deleteTransaction(transactionToDelete);
      await fetchBudgeTran(budgetId);
      setTransactionToDelete(null);
      showNotification("Transaction supprimée avec succès", "success", "bottom-center");
      (document.getElementById("delete_transaction_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Erreur lors de la suppression",
        "error",
        "top-center"
      );
    }
  };

  useEffect(() => {
    if (!budgetId) {
      showNotification("Erreur : ID du budget non trouvé", "error", "top-center");
      return;
    }
    fetchBudgeTran(budgetId); 
    showNotification(`Info : ID du budget : ${budgetId}`, "info", "top-center")
   
      return;
  }, [budgetId]);

  if (!budgetId) {
    return (
      <Wrapper>
        <div className="flex flex-col justify-center items-center h-64 text-center">
          <span className="text-red-500 text-xl">Erreur : ID du budget non trouvé.</span>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {notification && (
        <Notification
          message={notification.message}
          onclose={handleCloseNotification}
          type={notification.type}
          position={notification.position}
        />
      )}

      {/* Modal de suppression */}
      <dialog id="delete_transaction_modal" className="modal" aria-labelledby="delete-modal-title">
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              aria-label="Fermer la modale"
            >
              ✕
            </button>
          </form>
          <h3 id="delete-modal-title" className="font-bold text-lg">Confirmation de suppression</h3>
          <p className="py-4">Êtes-vous sûr de vouloir supprimer cette transaction ?</p>
          <div className="flex justify-end gap-4">
            <button
              className="btn btn-ghost"
              onClick={() => {
                setTransactionToDelete(null);
                (document.getElementById("delete_transaction_modal") as HTMLDialogElement)?.close();
              }}
              aria-label="Annuler la suppression"
            >
              Annuler
            </button>
            <button
              className="btn btn-error"
              onClick={handleDeleteTransaction}
              aria-label="Confirmer la suppression"
            >
              Supprimer
            </button>
          </div>
        </div>
      </dialog>

      {/* Contenu principal */}
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Détails du budget : {budget?.name || "Chargement..."}</h1>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <span className="loading loading-spinner loading-lg text-accent"></span>
            <span className="ml-4 font-bold text-accent">Chargement...</span>
          </div>
        ) : budget?.transaction && budget.transaction.length > 0 ? (
          <div className="md:mt-0 mt-4 md:w-2/3 mx-2">
            <div className="overflow-x-auto space-y-4 flex flex-col">
              <table className="table table-zebra">
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
                  {budget.transaction.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="text-lg md:text-3xl">{transaction.emoji || "💸"}</td>
                      <td>
                        <div className="badge badge-accent badge-xs md:badge-sm">
                          - {transaction.amount} Da
                        </div>
                      </td>
                      <td>{transaction.description}</td>
                      <td>{transaction.createdAt.toLocaleDateString("fr-FR")}</td>
                      <td>
                        {transaction.createdAt.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setTransactionToDelete(transaction.id);
                            (document.getElementById("delete_transaction_modal") as HTMLDialogElement)?.showModal();
                          }}
                          className="btn btn-sm btn-error"
                          aria-label={`Supprimer la transaction ${transaction.description}`}
                        >
                          <Trash className="w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="md:w-2/3 mt-10 md:ml-4 flex items-center justify-center">
            <Send strokeWidth={1.5} className="w-8 h-8 text-accent" />
            <span className="text-gray-500 ml-2">Aucune transaction.</span>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default BudgetDetailPage;