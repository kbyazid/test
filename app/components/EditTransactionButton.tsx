"use client";

import { useState, useCallback } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
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
          setIsOpen(true);
        }}
        className="btn btn-sm btn-ghost text-blue-500 hover:bg-blue-100"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div 
          className="modal modal-open fixed inset-0 z-50 overflow-y-auto" 
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="modal-box relative max-w-lg max-h-[90vh] p-6">
            <button 
              onClick={closeModal}
              className="btn btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            
            <h3 className="font-bold text-lg mb-4">Modifier la transaction</h3>
            
            <div className="space-y-4">
              <div>
                <label className="floating-label">
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Description de la transaction"
                />
                <span className="text-accent font-bold ">Description</span>
                </label>
              </div>
              
              <div>
                <label className="floating-label">
                  
                
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="0.00"
                />
                <span className="text-accent font-bold">Montant</span>
                </label>
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
        </div>
      )}
    </>
  );
}