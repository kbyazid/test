"use client";
import Link from "next/link";
import BudgetItemPrct from "./components/BudgetItemPrct";
import { useEffect, useState } from "react";
import { Budget } from "@/type";

import { getBudgetsByUser } from "@/action";  /* getAllBudgets, */
import Wrapper from "./components/Wrapper";

export default function Home() {
const [budgets, setBudgets] = useState<Budget[]>([]);

  const fetchBudgets = async () => {
   /*  const userBudgets = await getAllBudgets(); */
   const userBudgets = await getBudgetsByUser("tlemcencrma20@gmail.com"); 
    setBudgets(userBudgets);
    console.log(userBudgets);
  };
  

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <Wrapper>
    
      <div className="flex items-center justify-center flex-col py-10 w-full">
        <div className="flex flex-col">
          {/* Titre et sous-titre */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-center">Prenez le contrôle de vos finances</h1>
            <p className="py-6 text-gray-500 text-xl md:text-2xl font-bold text-center">Suivez vos budgets, visualisez vos dépenses et optimisez vos revenus.</p>
          </div>
          {/* Afficher les budgets */}
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {budgets.map((budget) => (
            
            <Link href={`/manage/${budget.id}`} key={budget.id}>
              <BudgetItemPrct budget={budget} enableHover={1} />
            </Link>
          ))}
        </ul>
        </div>
      </div>
    </Wrapper>
  );
}

