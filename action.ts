"use server"  // Important pour les Server Actions de Next.js
import { Budget, Transaction } from "./type";
import prisma from "@/lib/prisma";

export async function getAllMessages() {
    return await prisma.test_connection.findMany({
      select: {
        id: true,
        message: true,
      },
    });
  }
//////////////////////////////////////////////////////////////////////////
  export async function getAllBudgets() {
    try {
      const allBudget = await prisma.budget.findMany({
        include: {
          transaction: {
            orderBy: {
              createdAt: "desc", // Transactions triées du plus récent au plus ancien
            },
          },
        },
        orderBy: {
          createdAt: "asc", // Budgets triés du plus ancien au plus récent
        },
      });
      
        /* console.log(userBudget) */
        return allBudget

    } catch (error) {
        console.error('Erreur lors de la récupération des budgets:', error);
        throw error;
    }
}
export async function getBudgetsByUser(email="tlemcencrma20@gmail.com") {
  try {
      const user = await prisma.user.findUnique({
          where: {
              email
          },
          include: {
              budget: {
                  include: {
                      transaction: true
                  }
              }
          }

      })

      if (!user) {
          throw new Error("Utilisateur non trouvé")
      }
      /* console.log(user.budgets) */
      return user.budget
  } catch (error) {
      console.error('Erreur lors de la récupération des budgets:', error);
      throw error;
  }
}

//////////////////////////////////////////////////////////////////////////
export async function getTransactionsByBudgetId(budgetId: string) {
  try {
    console.log("ID budget reçu :", budgetId)
      const budget = await prisma.budget.findUnique({
          where: {
              id: budgetId
          },
          include: {
              transaction: {
                  orderBy: {
                    createdAt: "desc", // Tri décroissant
                  },
                },
          },
          
          
      })
      console.log("budget reçu :", budget)
      if (!budget) {
          throw new Error('Budget non trouvé.');
      }

      return budget;
  } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      throw error;
  }
}