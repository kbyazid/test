// Suppression de "use client"; - Cette page est maintenant un Server Component
// export const dynamic = "force-dynamic"; // Désactive le cache statique
// export const revalidate = 0; // Pas de cache
import Wrapper from "@/app/components/Wrapper"; // Supposons que c'est un Client/Server Component
import BudgetItem from "../components/BudgetItem";
import budgets from "@/data";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";


// Composant de Page (maintenant un Server Component)
export default function Demo() {
    /* console.log(budgets) */
  return (
    <Wrapper>
      <Link href="/" className="btn btn-ghost mb-4 text-red-700 text-xl md:text-2xl font-bold">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
      </Link>  
      <div className="flex items-center justify-center flex-col py-10 w-full">
        
        <div className="flex flex-col">
          {/* Titre et sous-titre - Rendu instantanément */}
          <div>
           
            <h1 className="text-3xl md:text-4xl font-bold text-center">Prenez le contrôle de vos finances  <span className="text-red-600">- Data Factice -</span> </h1>
            <p className="py-6 text-gray-500 text-xl md:text-2xl font-bold text-center">Suivez vos budgets, visualisez vos dépenses et optimisez vos revenus.</p>
          </div>

          <ul className="grid md:grid-cols-2 lg:grid-cols-3 px-5 md:px-[20%] lg:px-[10%] mt-10 mb-10 gap-4 md:gap-6  md:min-w-[1200px]">
            {budgets.map((budget) => (
               <Link href={`/managedemo/${budget.id}`} key={budget.id}>
                <BudgetItem budget={budget} enableHover={1}></BudgetItem>
              </Link>
            ))}
          </ul>
         

        </div>
      </div>
    </Wrapper>
  );
}