"use client";
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState, useCallback, useRef } from "react";
/* import Wrapper from "../components/Wrapper"; */
import EmojiPicker from "emoji-picker-react";
import { addBudget, getBudgetsByUser, deleteBudget } from "@/action";
import Notification, { NotificationType, NotificationPosition } from "../components/Notification";
import { Budget } from "@/type";
import Link from "next/link";
import BudgetItemPrct from "../components/BudgetItemPrct";
import { Landmark, Trash } from "lucide-react";
import DOMPurify from "dompurify";

interface NotificationDetails {
  message: string;
  type: NotificationType;
  position: NotificationPosition;
}

const Page = () => {
  const { user } = useUser()
  const [budgetName, setBudgetName] = useState<string>("");
  const [budgetAmount, setBudgetAmount] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationDetails | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

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

  const handleEmojiSelect = (emojiObject: { emoji: string }) => {
    setSelectedEmoji(emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const openModal = (modalId: string) => {
    const modal = document.getElementById(modalId) as HTMLDialogElement | null;
    modal?.showModal();
  };

  const closeModal = (modalId: string) => {
    const modal = document.getElementById(modalId) as HTMLDialogElement | null;
    modal?.close();
  };

  const handleAddBudget = async () => {
     if (!user?.primaryEmailAddress?.emailAddress) {
      showNotification("Utilisateur non connecté", "error", "top-center");
      return;
    } 

    try {
      setIsAdding(true);
      const MIN_LOADING_TIME = 500;
      const start = Date.now();

      const trimmedBudgetName = DOMPurify.sanitize(budgetName.trim());
      /* const trimmedBudgetName = budgetName.trim(); */
      if (!trimmedBudgetName || trimmedBudgetName.length > 100) {
        showNotification(
          "Le libellé du budget doit être non vide et contenir moins de 100 caractères.",
          "error",
          "top-center"
        );
        return;
      }

      const amount = parseFloat(budgetAmount);
      if (isNaN(amount) || amount <= 0 || amount > 1000000) {
        showNotification(
          "Le montant doit être un nombre positif inférieur à 1 000 000.",
          "warning",
          "top-center"
        );
        return;
      }

      /* await addBudget(
        'tlemcencrma20@gmail.com',
        trimmedBudgetName,
        amount,
        selectedEmoji || undefined
      ); */

      await addBudget(
        user?.primaryEmailAddress?.emailAddress,
        trimmedBudgetName,
        amount,
        selectedEmoji
      );

      await fetchBudgets();

      closeModal("my_modal_3");

      const elapsed = Date.now() - start;
      const remainingTime = MIN_LOADING_TIME - elapsed;
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      showNotification("Nouveau budget créé avec succès !", "success", "bottom-center");
      setBudgetName("");
      setBudgetAmount("");
      setSelectedEmoji("");
      setShowEmojiPicker(false);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Une erreur est survenue",
        "error",
        "top-center"
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteBudget = async () => {
    if (!budgetToDelete) return;

    try {
      await deleteBudget(budgetToDelete);
      await fetchBudgets();
      closeModal("delete_budget_modal");
      showNotification("Budget supprimé avec succès.", "success", "bottom-center");
      setBudgetToDelete(null);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Erreur lors de la suppression du budget",
        "error",
        "top-center"
      );
    }
  };

  const fetchBudgets = async () => {
   if (!user?.primaryEmailAddress?.emailAddress) return; 

    try {
      setLoading(true);
      const MIN_LOADING_TIME = 1000;
      const start = Date.now();

      const userBudgets = await getBudgetsByUser(user.primaryEmailAddress.emailAddress);
      setBudgets(userBudgets || []);

      const elapsed = Date.now() - start;
      const remainingTime = MIN_LOADING_TIME - elapsed;
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Erreur lors de la récupération des budgets",
        "error",
        "top-center"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [user?.primaryEmailAddress?.emailAddress]);

  useEffect(() => {
    const modal = modalRef.current;
    if (modal?.open) {
      const focusableElements = modal.querySelectorAll("button, input, select, textarea");
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeModal("my_modal_3");
      };
      modal.addEventListener("keydown", handleKeyDown);
      return () => modal.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

  return (
    <>
    {/* <Wrapper> */}
      {notification && (
        <Notification
          message={notification.message}
          onclose={handleCloseNotification}
          type={notification.type}
          position={notification.position}
        />
      )}

      {/* Header */}
      <div className="space-y-6 mb-2 flex flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground">Définissez et suivez vos limites de dépenses.</p>
        </div>
        <button
          className="btn mb-4"
          onClick={() => openModal("my_modal_3")}
          aria-label="Créer un nouveau budget"
        >
          Nouveau Budget
          <Landmark className="w-4 ml-2" />
        </button>
      </div>

      {/* Modal de création de budget */}
      <dialog id="my_modal_3" className="modal" ref={modalRef} aria-labelledby="modal-title">
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              aria-label="Fermer la modale"
            >
              ✕
            </button>
          </form>
          <h3 id="modal-title" className="font-bold text-lg">Creation d un budget</h3>
          <p className="py-4">Permet de contrôler ses_

 dépenses facilement</p>
          <div className="w-full flex flex-col">
            <input
              type="text"
              value={budgetName}
              placeholder="Nom du budget"
              onChange={(e) => setBudgetName(e.target.value)}
              className="input input-bordered mb-3"
              required
              aria-label="Nom du budget"
            />

            <input
              type="number"
              value={budgetAmount}
              placeholder="Montant"
              onChange={(e) => setBudgetAmount(e.target.value)}
              className="input input-bordered mb-3"
              required
              aria-label="Montant du budget"
            />

            <button
              className="btn mb-3"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              aria-label="Sélectionner un emoji"
            >
              {selectedEmoji || "Sélectionnez un emoji 👉"}
            </button>

            {showEmojiPicker && (
              <div className="flex justify-center items-center my-4">
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            )}

            <button onClick={handleAddBudget} className="btn" disabled={isAdding} aria-label="Ajouter le budget">
              {isAdding ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Création...
                </>
              ) : (
                "Ajouter Budget"
              )}
            </button>
          </div>
        </div>
      </dialog>

      {/* Modal de suppression de budget */}
      <dialog id="delete_budget_modal" className="modal" aria-labelledby="delete-modal-title">
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
          <p className="py-4">Êtes-vous sûr de vouloir supprimer ce budget ?</p>
          <div className="flex justify-end gap-4">
            <button
              className="btn btn-ghost"
              onClick={() => {
                setBudgetToDelete(null);
                closeModal("delete_budget_modal");
              }}
              aria-label="Annuler la suppression"
            >
              Annuler
            </button>
            <button
              className="btn btn-error"
              onClick={handleDeleteBudget}
              aria-label="Confirmer la suppression"
            >
              Supprimer
            </button>
          </div>
        </div>
      </dialog>

      {/* Liste des budgets */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="loading loading-spinner loading-lg text-accent"></span>
          <span className="ml-4 font-bold text-accent">Chargement...</span>
        </div>
      ) : budgets.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 text-center">
          <Landmark strokeWidth={1.5} className="w-12 h-12 text-accent mb-4" />
          <span className="text-gray-500 text-xl">
            Aucun budget à afficher pour le moment.
          </span>
          <button
            onClick={() => openModal("my_modal_3")}
            className="btn btn-accent mt-6"
            aria-label="Ajouter votre premier budget"
          >
            Ajouter votre premier budget
          </button>
        </div>
      ) : (
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {budgets
            .slice()
            .sort((a, b) => {
              const aSpent = a.transaction?.reduce((sum, t) => sum + t.amount, 0) || 0;
              const bSpent = b.transaction?.reduce((sum, t) => sum + t.amount, 0) || 0;
              const aProgress = a.amount ? aSpent / a.amount : 0;
              const bProgress = b.amount ? bSpent / a.amount : 0;
              return bProgress - aProgress;
            })
            .map((budget) => (
              <div key={budget.id} className="flex flex-col">
                <Link href={`/manage/${budget.id}`}>
                  <BudgetItemPrct budget={budget} enableHover={1} />
                </Link>
                <button
                  className="btn btn-sm btn-ghost text-red-500 hover:bg-red-100 mt-2"
                  onClick={() => {
                    setBudgetToDelete(budget.id);
                    openModal("delete_budget_modal");
                  }}
                  aria-label={`Supprimer le budget ${budget.name}`}
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
        </ul>
      )}
    {/* </Wrapper> */}
    </>
  );
};

export default Page;


