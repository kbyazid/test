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
/* ======================================================================= */

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
    },
  });
}

/* ======================================================================= */
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
/* export async function getTransactionsByBudgetId(budgetId: string) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        budgetId: budgetId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const budget = await prisma.budget.findUnique({
      where: { id: budgetId }
    });

    return budget

  } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      throw error;
  }
} */

  export async function getTransactionsByBudgetId(budgetId: string, email = "tlemcencrma20@gmail.com") {
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


    const budget = user?.budget.find((b) => b.id === budgetId);

    if (!budget) {
      throw new Error("Budget non trouvé pour cet ID : " + budgetId);
    }
    
    if (!budget.transaction || !Array.isArray(budget.transaction)) {
      throw new Error("Transactions manquantes ou invalides.");
    }
    
    if (!budget.name || typeof budget.name !== "string") {
      throw new Error("Le nom du budget est invalide.");
    }
    
    // Tout est ok, on peut trier les transactions
    const sortedTransactions = budget.transaction.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return {
      ...budget,
      transaction: sortedTransactions,
    };
    

    /* const budget = user?.budget.find((b) => b.id === budgetId);
    return budget */
  
    } catch (error) {
      console.error('Erreur lors de la récupération du budget:', error);
      throw error;
    }
  }