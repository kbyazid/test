// app/managehome/[budgetId]/error.tsx
"use client"; // Important: error.tsx must be a Client Component

import { useEffect } from 'react';

export default function BudgetError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Budget Page Error:", error);
  }, [error]);

  let displayMessage = "Une erreur est survenue lors du chargement de ce budget.";
  if (error.message.includes("Budget non trouvé")) {
    displayMessage = "Ce budget n'existe pas ou n'est plus disponible.";
  } else if (error.message.includes("Can't reach database server") || error.message.includes("Timed out connecting to the database")) {
    displayMessage = "Impossible de se connecter à la base de données. Les détails du budget ne peuvent pas être affichés.";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 text-center p-4">
      <h2 className="text-3xl font-bold text-red-600 mb-4">Problème de Budget !</h2>
      <p className="text-xl text-gray-700 mb-6">{displayMessage}</p>
      <p className="text-sm text-gray-500 mb-8">
        Veuillez vérifier vos informations ou réessayer.
      </p>
      <button
        className="btn btn-primary"
        onClick={() => reset()}
      >
        Réessayer
      </button>
      <div className="mt-8">
        <a href="/budget" className="link link-hover text-blue-500">Retour à la liste des budgets</a>
      </div>
    </div>
  );
}