import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold text-red-600">⛔  Accès refusé</h1>
      <p className="mt-4 text-gray-600">
        Vous n’avez pas les permissions nécessaires pour accéder à cette page.
      </p>
      <Link href="/" className="btn btn-accent mt-6">
        Retour à l’accueil
      </Link>
    </div>
  );
}
