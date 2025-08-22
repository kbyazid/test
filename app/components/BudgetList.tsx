import BudgetItemPrct from "../components/BudgetItemPrct"; // Supposons que c'est un Client Component ou un Server Component qui n'utilise pas Link directement
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getBudgetsByUser } from "@/app/data/data"; // Type Budget
// Composant Client pour envelopper Next.js Link
// (Créez ce fichier dans components/ClientLink.tsx)
import ClientLink from "../components/ClientLink";
/* import { Budget } from "@/type"; */
import { currentUser } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";
// Nouveau Server Component pour afficher la liste des budgets
// Cela pourrait être dans un fichier séparé comme components/BudgetList.tsx
export async function BudgetList() {
  const user = await currentUser();
  if (!user?.primaryEmailAddress?.emailAddress) {
     redirect("/sign-in"); // <--- Mieux ! Redirigez l'utilisateur directement
  }

  const email = user.primaryEmailAddress.emailAddress;

  const result = await getBudgetsByUser(email); // Appel asynchrone des données
    // Gérer les erreurs de récupération de données
    if (result.error) {
        return (
          <div className="text-center py-10 text-red-500">
            <p className="text-lg font-semibold">{result.error}</p>
            {result.error.includes("base de données") && ( // Si c'est une erreur de DB, suggérer une action
                <p className="mt-2 text-sm text-gray-600">Veuillez vérifier ll&apos;état de votre serveur de base de données.</p>
            )}
            {/* Vous pouvez ajouter un bouton de rechargement ici si c'est un Client Component et que vous voulez ré-essayer */}
          </div>
        );
      }
      const userBudgets = result.data; // Maintenant, result.data est garanti d'être non-null si result.error est null

      // Afficher un message si aucun budget n'est trouvé
      if (userBudgets!.length === 0) {
        return (
          <div className='md:w-2/3 mt-10 md:ml-4 flex items-center justify-center'>
            <span className='text-gray-500 tracking-tight ml-2'>Aucun budget trouvé pour cet utilisateur.</span>
          </div>
        );
      }
    return (
      <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {userBudgets!.map((budget) => (
          // Utilisez le composant ClientLink pour envelopper Link
          <ClientLink href={`/managehome/${budget.id}`} key={budget.id}>
            <BudgetItemPrct budget={budget} enableHover={1} />
          </ClientLink>
        ))}
      </ul>
    );
  }