"use client";

import { useState, useCallback } from "react";
import { addExpenseTransactionToBudget } from "@/action";
import Notification, { NotificationType, NotificationPosition } from "@/app/components/Notification";

interface AddTransactionButtonProps {
  budgetId: string;
  onAddSuccess: () => void; // Callback pour rafraîchir la page après ajout
  email: string; // Adresse e-mail de l'utilisateur
}

export default function AddTransactionButton({ budgetId, onAddSuccess, email }: AddTransactionButtonProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    position: NotificationPosition;
  } | null>(null);

  const showNotification = (message: string, type: NotificationType, position: NotificationPosition) => {
    setNotification({ message, type, position });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddTransaction = useCallback(async () => {
    if (!amount || !description) {
      showNotification("Veuillez remplir tous les champs.", "warning", "bottom-right");
      return;
    }

    try {
      const amountNumber = parseFloat(amount);
      if (isNaN(amountNumber) || amountNumber <= 0) {
        throw new Error("Le montant doit être un nombre positif.");
      }
      await addExpenseTransactionToBudget(budgetId, amountNumber, description, email);
      showNotification("Transaction ajoutée avec succès", "info", "bottom-right");
      onAddSuccess(); // Rafraîchir la page
      setAmount("");
      setDescription("");
    } catch (error) {
      showNotification("Vous avez dépassé votre budget", "warning", "top-center");
    }
  }, [budgetId, email, description, amount, onAddSuccess]);

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
      <div className="space-y-4 flex flex-col  p-4 border rounded-lg">
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="input input-bordered w-full"
        />
        <input
          type="number"
          id="amount"
          placeholder="Montant"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="input input-bordered w-full"
        />
        <button onClick={handleAddTransaction} className="btn">
          Ajouter votre depense
        </button>
      </div>
    </>
  );
}