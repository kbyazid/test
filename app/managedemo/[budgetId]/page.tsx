"use client";
import Wrapper from '@/app/components/Wrapper';
import React, { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react';
import { Budget } from "@/type";
import budgetsData from '@/data';
import ClientLink from '@/app/components/ClientLink';
import BudgetItemPrct from '@/app/components/BudgetItemPrct';

const Page = ({ params }: { params: Promise<{ budgetId: string }> }) => {
    
    const [budgetId, setBudgetId] = useState<string>('')
    const [budget, setBudget] = useState<Budget | null>(null);

  
    async function fetchBudgetDataLocal(budgetId: string) { // Cette fonction n'a plus besoin d'être async si la source est locale et synchrone
        try {
            console.log(budgetsData);
            if (budgetId) {
                // Cherchez le budget dans le tableau importé dont l'id correspond au budgetId
                const foundBudget = budgetsData.find(budget => budget.id === budgetId);
    
                if (foundBudget) {
                    // Si un budget est trouvé, mettez à jour l'état 'budget' avec cet objet
                    setBudget(foundBudget); // Assurez-vous que 'setBudget' est accessible ici (c'est l'updater d'un état useState)
                } else {
                    // Si aucun budget n'est trouvé, vous pouvez gérer l'erreur
                    /* console.error(`Budget avec l'ID ${budgetId} non trouvé.`); */
                    /* showNotification(`Budget avec l'ID ${budgetId} non trouvé.`, 'warning', 'top-center') */
                    return; 
                    setBudget(null); // Mettez l'état à null ou undefined si le budget n'existe pas
                    // Vous pourriez aussi ajouter une notification ici si vous le souhaitez
                    // addNotification({ message: `Budget ${budgetId} non trouvé.`, type: 'error', position: 'top-center' });
                }
            } else {
                // Gérer le cas où budgetId est vide (même si cela ne devrait pas arriver avec un paramètre de route dynamique)
                console.warn("Aucun budgetId fourni.");
                setBudget(null);
            }
    
        } catch (error) {
            // Ce bloc catch est moins susceptible de capturer des erreurs maintenant que c'est local
            // mais il est bon de le garder pour d'autres problèmes potentiels.
            console.error(
                "Erreur lors de la recherche du budget localement :",
                error
            );
            setBudget(null); // Assurez-vous que l'état est clair en cas d'erreur
        }
    }
    
       useEffect(() => {
        const getId = async () => {
        const resolvedParams = await params   
        setBudgetId(resolvedParams.budgetId )
        fetchBudgetDataLocal(resolvedParams.budgetId)  
        }
        getId()
      }, [params]) 



  return (
    /* ajout du wrapper */
    <Wrapper>

      <ClientLink href="/demo">
        <div className="btn btn-ghost mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour
        </div>
      </ClientLink>

     


      <div className='flex md:flex-row flex-col'>
        <div className='md:w-1/3'>
          <span className='font-medium text-red-800 text-sm ml-4'>Id : {budgetId} </span>
          {budget ? (
            <BudgetItemPrct budget={budget} enableHover={1} />
          ) : (
            <p>Budget introuvable.</p> // ou un Skeleton/redirect
          )}
        </div>
        <div className="overflow-x-auto md:mt-0 mt-4 md:w-2/3 ml-4">

          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr>
                <th ></th>
                <th >Montant</th>
                <th >Description</th>
                <th >Date</th>
                <th >Heure</th>
              </tr>
            </thead>
            <tbody>
              {budget?.transaction?.map((transaction) => (
                <tr key={transaction.id}>
                  <td className='text-lg md:text-3xl'>{transaction.emoji}</td>
                  <td>
                    <div className="badge badge-accent badge-xs md:badge-sm">
                      - {transaction.amount} €</div>
                  </td>
                  <td>{transaction.description}</td>
                  <td>
                    {transaction.createdAt.toLocaleDateString("fr-FR")}
                  </td>
                  <td>
                    {transaction.createdAt.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit"
                    })}
                  </td>
                </tr>
              ))}

            </tbody>
          </table>


        </div>





      </div>            
            
        
    </Wrapper>
  )
}

export default Page
