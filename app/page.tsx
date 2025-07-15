// app/page.tsx
// Suppression de "use client"; - Cette page est maintenant un Server Component

import BudgetItemPrct from "./components/BudgetItemPrct"; // Supposons que c'est un Client Component ou un Server Component qui n'utilise pas Link directement
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getBudgetsByUser } from "../app/data/data"; // Type Budget

import Wrapper from "./components/Wrapper"; // Supposons que c'est un Client/Server Component
import { Suspense } from "react"; // Importez Suspense

// Composant Client pour envelopper Next.js Link
// (Créez ce fichier dans components/ClientLink.tsx)
import ClientLink from "./components/ClientLink";

// Nouveau Server Component pour afficher la liste des budgets
// Cela pourrait être dans un fichier séparé comme components/BudgetList.tsx
async function BudgetList() {
  const userBudgets = await getBudgetsByUser("tlemcencrma20@gmail.com"); // Appel asynchrone des données

  return (
    <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {userBudgets.map((budget) => (
        // Utilisez le composant ClientLink pour envelopper Link
        <ClientLink href={`/managehome/${budget.id}`} key={budget.id}>
          <BudgetItemPrct budget={budget} enableHover={1} />
        </ClientLink>
      ))}
    </ul>
  );
}

// Composant de Page (maintenant un Server Component)
export default function Home() {
  return (
    <Wrapper>
      <div className="flex items-center justify-center flex-col py-10 w-full">
        <div className="flex flex-col">
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
        </div>
      </div>
    </Wrapper>
  );
}