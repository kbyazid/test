"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { updateTransaction } from "@/action";
import { Edit2 } from "lucide-react";
import Notification, { NotificationType, NotificationPosition } from "@/app/components/Notification";

interface EditTransactionButtonProps {
  transactionId: string;
  currentDescription: string;
  currentAmount: number;
  onEditSuccess: () => void;
}

export default function EditTransactionButton({ 
  transactionId, 
  currentDescription, 
  currentAmount, 
  onEditSuccess 
}: EditTransactionButtonProps) {
  const [editDescription, setEditDescription] = useState(currentDescription);
  const [editAmount, setEditAmount] = useState(currentAmount.toString());
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    position: NotificationPosition;
  } | null>(null);

  const showNotification = (message: string, type: NotificationType, position: NotificationPosition) => {
    setNotification({ message, type, position });
    setTimeout(() => setNotification(null), 3000);
  };

  const closeModal = () => {
    const modal = document.getElementById(`edit_transaction_${transactionId}`) as HTMLDialogElement | null;
    modal?.close();
    setEditDescription(currentDescription);
    setEditAmount(currentAmount.toString());
  };

  const handleSave = useCallback(async () => {
    if (!editDescription.trim() || !editAmount.trim()) {
      showNotification("Description et montant requis", "warning", "top-center");
      return;
    }

    const amount = parseFloat(editAmount);
    if (isNaN(amount) || amount <= 0) {
      showNotification("Montant invalide", "warning", "top-center");
      return;
    }

    setIsLoading(true);
    try {
      await updateTransaction(transactionId, editDescription.trim(), amount);
      closeModal();
      onEditSuccess();
      showNotification("Transaction modifiée", "success", "bottom-center");
    } catch (error) {
      console.error("Erreur lors de la modification de la transaction:", error);
      showNotification("Erreur lors de la modification", "error", "top-center");
    } finally {
      setIsLoading(false);
    }
  }, [transactionId, editDescription, editAmount, onEditSuccess, currentDescription, currentAmount]);

    useEffect(() => {
      const modal = modalRef.current;
      if (modal?.open) {
        const focusableElements = modal.querySelectorAll("button, input, select, textarea");
        const firstElement = focusableElements[0] as HTMLElement;
        firstElement?.focus();
  
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === "Escape") closeModal();
        };
        modal.addEventListener("keydown", handleKeyDown);
        return () => modal.removeEventListener("keydown", handleKeyDown);
      }
    }, []);
    
  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          onclose={() => setNotification(null)}
          type={notification.type}
          position={notification.position}
        />
      )}
      <button
        title="Modifier la transaction"
        onClick={() => {
          setEditDescription(currentDescription);
          setEditAmount(currentAmount.toString());
          (document.getElementById(`edit_transaction_${transactionId}`) as HTMLDialogElement)?.showModal();
        }}
        className="btn btn-sm btn-ghost text-blue-500 hover:bg-blue-100"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      {/* Modal d'édition */}
      <dialog id={`edit_transaction_${transactionId}`} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button 
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" 
              onClick={closeModal}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4">Modifier la transaction</h3>
          
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Description de la transaction"
              />
            </div>
            
            <div>
              <label className="label">
                <span className="label-text">Montant</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="input input-bordered w-full"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-4 mt-6">
            <button 
              className="btn btn-ghost" 
              onClick={closeModal}
              disabled={isLoading}
            >
              Annuler
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Modification...
                </>
              ) : (
                "Modifier"
              )}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}