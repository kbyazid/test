// app/page.tsx
// Suppression de "use client"; - Cette page est maintenant un Server Component
export const dynamic = "force-dynamic"; // Désactive le cache statique
export const revalidate = 0; // Pas de cache
import { requireAuth } from "@/lib/auth";
import { BudgetList } from "./components/BudgetList";
import Wrapper from "./components/Wrapper";
import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
/* import TodoList from "./components/TodoList"; */



// Composant de Page (maintenant un Server Component)
export default async function  Home() {
  // Vérification d'authentification et d'autorisation
  await requireAuth();
  const user = await currentUser();
  console.log(user);
  
  return (
    <Wrapper>
      <div className="flex items-center justify-center flex-col py-10 w-full">
        <div className="flex flex-col w-full">
          {/* Titre et sous-titre - Rendu instantanément */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-center">Prenez le contrôle de vos finances</h1>
            <p className="py-6 text-gray-500 text-xl md:text-2xl font-bold text-center">Suivez vos budgets, visualisez vos dépenses et optimisez vos revenus.</p>
          </div>

          {/* Utilisation de Suspense pour charger les budgets de manière asynchrone */}
          <Suspense fallback={<div className="flex justify-center items-center py-10">
            <span className="loading loading-spinner loading-lg text-accent"></span>
            <span className="ml-4 font-bold text-accent">Chargement des budgets...</span>
            </div>}>
            <BudgetList /> {/* Le composant qui va chercher les données */}
          </Suspense>

          {/* Todo Section - Affichée seulement si utilisateur connecté */}
{/*           {user && (
            <div>
              <div className="border-3 border-base-300 rounded-lg p-6 bg-base shadow-md mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <img src={user.imageUrl} alt="Avatar" className="w-10 h-10 rounded-full" />
                  <div>
                    <p>{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </div>
                <TodoList />
              </div>
            </div>
          )} */}
        </div>
      </div>
    </Wrapper>
  );
}

