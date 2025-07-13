"use client";

import { useState, useCallback } from "react";
import { deleteTransaction } from "@/action";
import { Trash } from "lucide-react";
import Notification, { NotificationType, NotificationPosition } from "@/app/components/Notification";

interface DeleteTransactionButtonProps {
  transactionId: string;
  onDeleteSuccess: () => void; // Callback pour rafraîchir la page après suppression
}

export default function DeleteTransactionButton({ transactionId, onDeleteSuccess }: DeleteTransactionButtonProps) {
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
    const modal = document.getElementById(`delete_transaction_${transactionId}`) as HTMLDialogElement | null;
    modal?.close();
  };

  const handleDelete = useCallback(async () => {
    try {
      await deleteTransaction(transactionId);
      showNotification("Dépense supprimée avec succès.", "success", "bottom-center");
      onDeleteSuccess(); // Rafraîchir la page
      closeModal();
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Erreur lors de la suppression de la transaction.",
        "error",
        "top-center"
      );
    }
  }, [transactionId, onDeleteSuccess]);

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
        title="Supprimer la dépense"
        onClick={() => (document.getElementById(`delete_transaction_${transactionId}`) as HTMLDialogElement)?.showModal()}
        className="btn btn-sm btn-ghost text-red-500 hover:bg-red-100"
      >
        <Trash className="w-4 h-4" />
      </button>
      <dialog id={`delete_transaction_${transactionId}`} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Confirmation de suppression</h3>
          <p className="py-4">Êtes-vous sûr de vouloir supprimer cette dépense ?</p>
          <div className="flex justify-end gap-4">
            <button className="btn btn-ghost" onClick={closeModal}>
              Annuler
            </button>
            <button className="btn btn-error" onClick={handleDelete}>
              Supprimer
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}