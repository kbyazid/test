// app/transactions/components/AddIncomeTransactionSection.tsx
"use client"; // C'est un Client Component

import React, { useState} from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDownCircle } from 'lucide-react';

import { addIncomeTransaction } from '@/action'; // Server Action
import { useModal } from '@/lib/modal'; // Votre hook useModal
import Notification , { NotificationType, NotificationPosition } from './Notification'; // Votre composant Notification
/* import { debounce } from '@/lib/utils'; */ // Votre utilitaire debounce
import DOMPurify from 'dompurify'; // Pour la sécurité XSS

// Définition des types pour Notification si non déjà globales
/* type NotificationType = 'success' | 'error' | 'warning';
type NotificationPosition = 'top-center' | 'bottom-center' | 'top-right'; */

interface AddIncomeTransactionSectionProps {
  userEmail: string;
}
const userEmail = "tlemcencrma20@gmail.com"
console.log(userEmail)
// Fonction de type guard pour les erreurs (peut être dans utils/error.ts ou ici)
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

const AddIncomeTransactionSection: React.FC<AddIncomeTransactionSectionProps> = () => {
  const router = useRouter();
  const { openModal, closeModal } = useModal();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: NotificationType; position: NotificationPosition } | null>(null);

  // Notification debounced
  const showNotification =(
    (message: string, type: NotificationType, position: NotificationPosition) => {
      setNotification({ message, type, position });
      setTimeout(() => setNotification(null), 3000);
    });

  const handleCloseNotification = () => setNotification(null);

  // Votre fonction handleAddTransaction
  const handleAddTransaction = async () => {
    try {
      setIsAdding(true);
      const amountNumber = parseFloat(amount);

      if (isNaN(amountNumber) || amountNumber <= 0) {
        showNotification('Le montant doit être un nombre positif.', 'warning', 'top-center');
        return;
      }
      if (amountNumber > 1_000_000) {
        showNotification('Le montant ne peut pas dépasser 1 000 000.', 'warning', 'top-center');
        return;
      }
      const trimmedDescription = description.trim();
      if (!trimmedDescription) {
        showNotification('La description est requise.', 'warning', 'top-center');
        return;
      }
      if (trimmedDescription.length > 100) {
        showNotification('La description doit contenir moins de 100 caractères.', 'warning', 'top-center');
        return;
      }
      const sanitizedDescription = DOMPurify.sanitize(trimmedDescription);
      if (!sanitizedDescription) {
        showNotification('Description invalide après nettoyage.', 'warning', 'top-center');
        return;
      }

      await addIncomeTransaction(amountNumber, sanitizedDescription, "tlemcencrma20@gmail.com");
      closeModal('add_income_modal'); // Assurez-vous que l'ID de votre modale est 'add_income_modal'
      setDescription('');
      setAmount('');
      showNotification('Recette ajoutée avec succès !', 'success', 'bottom-center');
      router.refresh(); // Crucial pour rafraîchir le Server Component parent

    } catch (error: unknown) {
      console.error('Échec de l\'ajout de la transaction:', error);
      let errorMessage = 'Une erreur est survenue lors de l\'ajout de la recette.';
      if (isError(error)) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      showNotification(errorMessage, 'error', 'top-center');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      {/* Composant Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          position={notification.position}
          onclose={handleCloseNotification}
        />
      )}

      {/* Bouton d'ajout de recette */}
      <button
        className="btn btn-primary"
        onClick={() => openModal('add_income_modal')}
        disabled={isAdding} // Désactive le bouton pendant l'ajout
      >
        <ArrowDownCircle className="h-5 w-5" />
        Ajouter une recette
      </button>

      {/* Modale d'ajout de recette (AddIncomeModal) */}
      {/* J'ai recréé la structure de la modale ici. Si vous avez un composant AddIncomeModal séparé,
          vous devrez l'importer et lui passer les props nécessaires. */}
      <dialog id="add_income_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Ajouter une nouvelle recette</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleAddTransaction(); }} className="py-4">
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Salaire, Remboursement..."
                className="input input-bordered w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={100}
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Montant (USD)</span>
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="input input-bordered w-full"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.01"
                max="1000000"
              />
            </div>

            <div className="modal-action">
              <button type="button" className="btn" onClick={() => closeModal('add_income_modal')}>Annuler</button>
              <button type="submit" className="btn btn-primary" disabled={isAdding}>
                {isAdding ? 'Ajout...' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default AddIncomeTransactionSection;