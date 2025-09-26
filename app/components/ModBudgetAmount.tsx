"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { updateBudgetAmount } from "@/action";
import { formatCurrency } from "@/lib/utils";

interface ModBudgetAmountProps {
  budgetId: string;
  currentAmount: number;
  totalSpent: number;
  onUpdateSuccess: () => void;
}

export default function ModBudgetAmount({ 
  budgetId, 
  currentAmount, 
  totalSpent, 
  onUpdateSuccess 
}: ModBudgetAmountProps) {
  const [newAmount, setNewAmount] = useState(currentAmount.toString());
  const [isUpdating, setIsUpdating] = useState(false);

  const openModal = () => {
    const modal = document.getElementById("mod_budget_modal") as HTMLDialogElement;
    modal?.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("mod_budget_modal") as HTMLDialogElement;
    modal?.close();
  };

  const handleUpdateAmount = async () => {
    const amount = parseFloat(newAmount);
    
    if (isNaN(amount) || amount < totalSpent) {
      alert(`Le montant doit être supérieur ou égal aux dépenses actuelles (${totalSpent}€)`);
      return;
    }

    try {
      setIsUpdating(true);
      await updateBudgetAmount(budgetId, amount);
      closeModal();
      onUpdateSuccess();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour du budget");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-outline "
        onClick={openModal}
        aria-label="Modifier le montant du budget"
      >
        <Edit className="w-4 h-4" />
        Modifier montant
      </button>

      <dialog id="mod_budget_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Modifier le montant du budget</h3>
          <p className="py-4">
            Dépenses actuelles: <span className="font-bold">{formatCurrency(totalSpent)}</span>
            <br />
            Le nouveau montant doit être supérieur ou égal aux dépenses actuelles.
          </p>
          <div className="w-full flex flex-col">
            <input
              type="number"
              value={newAmount}
              placeholder="Nouveau montant"
              onChange={(e) => setNewAmount(e.target.value)}
              className="input input-bordered mb-3"
              min={totalSpent}
              required
            />
            <button
              onClick={handleUpdateAmount}
              className="btn"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Mise à jour...
                </>
              ) : (
                "Mettre à jour"
              )}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}