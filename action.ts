"use server"  // Important pour les Server Actions de Next.js
import { Prisma } from "@prisma/client/extension";
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
export async function getAllTransactions() {
  return await prisma.transaction.findMany({
    select: {
      id: true,
      description: true,
      amount: true,
      budgetId: true,
      emoji: true,
      createdAt: true,
      type: true,
      userId: true,
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

/* ======================================================================= */
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
/* ======================================================================= */
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
/* ======================================================================= */
// 3 - getTransactionsByEmailAndPeriod3
// On récupère l'utilisateur et on inclut directement ses transactions, 
// avec les données de budget liées.
// Structure des données Plate enrichie - user → transactions (+ budget)
export async function getTransactionsByEmailAndPeriod3( email = "tlemcencrma20@gmail.com", period: string) {
  try {
      const now = new Date();
      let dateLimit
      dateLimit = new Date(now)
      dateLimit.setFullYear(now.getFullYear() - 1);

      /* switch (period) {
          case 'last30':
              dateLimit = new Date(now)
              dateLimit.setDate(now.getDate() - 30);
              break
          case 'last90':
              dateLimit = new Date(now)
              dateLimit.setDate(now.getDate() - 90);
              break
          case 'last7':
              dateLimit = new Date(now)
              dateLimit.setDate(now.getDate() - 7);
              break
          case 'last365':
              dateLimit = new Date(now)
              dateLimit.setFullYear(now.getFullYear() - 1);
              break
          default:
              throw new Error('Période invalide.');
      } */

      const trUser = await prisma.user.findUnique({
          where: { email },
          include: {
              transaction: {
                  where: {
                      createdAt: {
                          gte: dateLimit
                      }
                  },
                  orderBy: {
                      createdAt: 'desc'
                  },
                  include: {
                      budget: {
                          select: {
                              name: true,
                              id: true
                          }
                      }
                  }
              }
          }
      })

      const transactionsWithBudgetName = trUser?.transaction.flatMap(transact => ({
          ...transact,
          budgetName: transact.budget?.name ?? null,
          budgetId: transact.budget?.id ?? null
      }))
      

      return transactionsWithBudgetName 

  } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      throw error;
  }
}
/* ======================================================================= */
// Calcul des trois totaux
export async function getTotalTransactionAmountByEmail( email = "tlemcencrma20@gmail.com") {
  if (!email) return
  try {
      const user = await prisma.user.findUnique({
          where: { email },
          include: {
              transaction: {
                  orderBy: {
                      createdAt: 'desc'
                  },
                  include: {
                      budget: {
                          select: {
                              name: true,
                              id: true
                          }
                      }
                  }
              }
          }
      })
      if (!user) throw new Error("Utilisateur non trouvé");

      const totalIncomeRaw = user.transaction
          .filter(t => t.type === 'income')
          .reduce((acc, t) => acc + t.amount, 0);

      const totalExpensesRaw = user.transaction
          .filter(t => t.type === 'expense')
          .reduce((acc, t) => acc + t.amount, 0);

          // 🔒 Arrondir pour éviter les erreurs de flottants
const round = (val: number, decimals = 2) =>
  Math.round((val + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;

const totalIncome = round(totalIncomeRaw);
const totalExpenses = round(totalExpensesRaw);

// Optionnel : calcul du solde
const balance = round(totalIncome - totalExpenses);
     /*  const balance = totalIncome - totalExpenses; */

     
      return {
          totalIncome,
          totalExpenses,
          balance
      };

  } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      throw error;
  }
}
/* ======================================================================= */
export async function addIncomeTransaction(
  amount: number,
  description: string,
  email: string,
) {
  /* Bloc try catch  */
  try {
      const type =  'income'

  // recherche user ds notre table local user
      const user = await prisma.user.findUnique({
          where: { email }
      })

      if (!user) {
          throw new Error('Utilisateur non trouvé')
      } 

      const capitalized = description.charAt(0).toUpperCase()+ description.slice(1)
      description = capitalized

      const newTransaction = await prisma.transaction.create({
          data: {
              amount,
              description,
              emoji: null,
              type:type, 
              userId: user.id,
              budgetId:null,
          }
      })   
      

  } catch (error) {
      console.error('Erreur lors de l\'ajout de la transaction:', error);
      throw error;
  }
}

/* ======================================================================= */
export async function deleteTransaction(transactionId: string) {
 
  try {
      // Validation des données
      if (!transactionId) throw new Error("ID manquant");

      console.log(" id de la transact", transactionId)
      // Appel à Prisma
      const transaction = await prisma.transaction.findUnique({
          where: {
              id: transactionId
          }
      })

      if (!transaction) {
          throw new Error('Transaction non trouvée.');
      }

      await prisma.transaction.delete({
          where: {
              id: transactionId,
          },
      });
  } catch (error) {
      console.error('Erreur lors de la suppressio de la transaction:', error);
      throw error;
  }
}

export async function getTransactionsByPeriod(email:string , period: string) {
  try {
      const now = new Date();
      let dateLimit: Date | undefined;

      switch (period) {
          case 'last30':
              dateLimit = new Date(now)
              dateLimit.setDate(now.getDate() - 30);
              break
          case 'last90':
              dateLimit = new Date(now)
              dateLimit.setDate(now.getDate() - 90);
              break
          case 'last7':
              dateLimit = new Date(now)
              dateLimit.setDate(now.getDate() - 7);
              break
          case 'last365':
              dateLimit = new Date(now)
              dateLimit.setFullYear(now.getFullYear() - 1);
              break
          case "all":
              dateLimit = undefined; // Pas de limite de date pour "all"
              break;
          default:
              throw new Error('Période invalide.');
      }

      const trUser = await prisma.user.findUnique({
          where: { email },
          include: {
              transaction: {
                  where: {
                      createdAt: {
                          gte: dateLimit
                      }
                  },
                  orderBy: {
                      createdAt: 'desc'
                  },
                  include: {
                      budget: {
                          select: {
                              name: true,
                              id: true
                          }
                      }
                  }
              }
          }
      })

      const transactionsWithBudgetName = trUser?.transaction.flatMap(transact => ({
        ...transact,
        budgetName: transact.budget?.name ?? null,
        budgetId: transact.budget?.id ?? null
    }))
      

      return transactionsWithBudgetName 

  } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      throw error;
  }
}
