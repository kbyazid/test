// app/error.tsx
"use client"; // Important: error.tsx must be a Client Component

import { useEffect } from 'react';

// The error.tsx component receives 'error' and 'reset' props
export default function Error({
  error,          // The error object
  reset,          // A function to attempt to re-render the segment
}: {
  error: Error & { digest?: string }; // 'digest' is a unique identifier for the error in Vercel deployments
  reset: () => void;
}) {
  // useEffect is useful for logging the error to an external service
  useEffect(() => {
    // You can log the error to an error reporting service like Sentry, DataDog, etc.
    console.error("Global App Error:", error);
  }, [error]); // Re-run effect if the error object changes

  // Determine a user-friendly message based on the error
  let displayMessage = "Une erreur inattendue est survenue.";
  // You can add more specific checks if you expect certain error messages
  if (error.message.includes("Can't reach database server") || error.message.includes("Timed out connecting to the database")) {
    displayMessage = "Impossible de se connecter à la base de données. Veuillez réessayer plus tard.";
  } else if (error.message.includes("Budget non trouvé") || error.message.includes("Utilisateur non trouvé")) {
    displayMessage = "La ressource demandée n'a pas été trouvée.";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 text-center p-4">
      <h2 className="text-3xl font-bold text-red-600 mb-4">Oups !</h2>
      <p className="text-xl text-gray-700 mb-6">{displayMessage}</p>
      <p className="text-sm text-gray-500 mb-8">
        Si le problème persiste, veuillez contacter le support.
        <br/>
        {/* For debugging, you might include error.message or error.digest */}
        {process.env.NODE_ENV === 'development' && (
          <span className="block mt-2 text-xs text-gray-400">
            Détails de l&aposerreur (Dev uniquement) : {error.message} {error.digest ? `(Digest: ${error.digest})` : ''}
          </span>
        )}
      </p>
      <button
        className="btn btn-primary" // Assuming you have DaisyUI or similar classes
        onClick={
          // Attempt to re-render the segment by calling the reset function
          () => reset()
        }
      >
        Réessayer
      </button>
      <div className="mt-8">
        {/* Optional: Add a link to the homepage or another relevant page */}
        <link href="/" className="link link-hover text-blue-500">Retour à l&aposaccueil</link>
      </div>
    </div>
  );
}
