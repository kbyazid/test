import Link from "next/link";

export default function InactivePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold text-red-600">Compte inactif</h1>
      <p className="mt-4 text-gray-600">
        Votre compte est actuellement inactif.  
        Veuillez contacter l’administrateur pour le réactiver.
      </p>
      <Link href="/" className="btn btn-accent mt-6">
        Retour à l’accueil
      </Link>
    </div>
  );
}