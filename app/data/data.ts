// lib/data.ts
import prisma from "@/lib/prisma";
import { Budget, Period, Totals, Transaction } from "@/type";
import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientValidationError // Assurez-vous d'importer toutes les erreurs Prisma que vous pourriez vouloir gérer
} from '@prisma/client/runtime/library';

export type FetchResult<T> = { data: T; error: null } | { data: null; error: string };

interface BudgetWithTransactions extends Budget {
  transaction: Transaction[];
}
/* ======================================================================= */
/* page Home */
export async function getBudgetsByUser(email: string = "tlemcencrma20@gmail.com"): Promise<FetchResult<Budget[]>> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        budget: {
          include: { transaction: true },
        },
      },
    });

    if (!user) {
      return { data: [], error: null };
    }
    return { data: user.budget as Budget[], error: null };
  } catch (error: unknown) { // CORRIGÉ : 'any' remplacé par 'unknown'
    console.error('Erreur lors de la récupération des budgets:', error);

    // Vérification explicite du type de l'erreur avant d'accéder aux propriétés
    if (error instanceof PrismaClientInitializationError) {
      return { data: null, error: "Impossible de se connecter à la base de données. Veuillez réessayer plus tard." };
    }
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P1001' || error.code === 'P1002') {
        return { data: null, error: "Impossible de se connecter à la base de données. Veuillez réessayer plus tard." };
      }
      // Ajoutez d'autres codes d'erreur Prisma que vous souhaitez gérer spécifiquement
    }
    if (error instanceof PrismaClientValidationError) {
        return { data: null, error: "Erreur de validation des données lors de la récupération des budgets." };
    }
    // Si c'est une erreur standard avec un message
    if (error instanceof Error) {
        if (error.message.includes("Can't reach database server") ||
            error.message.includes("Timed out connecting to the database")
        ) {
            return { data: null, error: "Impossible de se connecter à la base de données. Veuillez réessayer plus tard." };
        }
    }


    // Cas par défaut pour toute autre erreur inattendue
    return { data: null, error: "Une erreur inattendue est survenue lors de la récupération des budgets." };
  }
}

export async function getBudgetAndTransactions(budgetId: string): Promise<FetchResult<{ budget: BudgetWithTransactions; transactions: Transaction[] }>> {
  try {
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
      include: { transaction: true },
    });

    if (!budget) {
      return { data: null, error: "Budget non trouvé." };
    }

    const transactions = budget.transaction;

    return { data: { budget: budget as BudgetWithTransactions, transactions }, error: null };
  } catch (error: unknown) { // CORRIGÉ : 'any' remplacé par 'unknown'
    console.error("Erreur lors de la récupération du budget et des transactions :", error);

    // Vérification explicite du type de l'erreur avant d'accéder aux propriétés
    if (error instanceof PrismaClientInitializationError) {
        return { data: null, error: "Impossible de se connecter à la base de données pour ce budget. Veuillez réessayer plus tard." };
    }
    if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P1001' || error.code === 'P1002') {
            return { data: null, error: "Impossible de se connecter à la base de données pour ce budget. Veuillez réessayer plus tard." };
        }
        // Ajoutez d'autres codes d'erreur Prisma que vous souhaitez gérer spécifiquement
    }
    if (error instanceof PrismaClientValidationError) {
        return { data: null, error: "Erreur de validation des données lors de la récupération du budget." };
    }
    // Si c'est une erreur standard avec un message
    if (error instanceof Error) {
        if (error.message.includes("Can't reach database server") ||
            error.message.includes("Timed out connecting to the database")
        ) {
            return { data: null, error: "Impossible de se connecter à la base de données pour ce budget. Veuillez réessayer plus tard." };
        }
    }

    // Cas par défaut pour toute autre erreur inattendue
    return { data: null, error: "Une erreur inattendue est survenue lors de la récupération du budget et de ses transactions." };
  }
}

/* ======================================================================= */
/* page transaction */
// Suivant la periode envoi un tableau enrichie
async function getTransactionsByPeriod(email:string , period: Period) {
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
                  where: dateLimit
                  ? {
                      createdAt: {
                        gte: dateLimit,
                      },
                    }
                  : undefined,
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
        if (!trUser) {
          throw new Error("Utilisateur non trouvé.");
        }
        const transactionsWithBudgetName = trUser?.transaction.map(transact => ({
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

// Calcul des trois totaux
async function getTotalTransactionAmountByEmail( email: string) {
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

// Nouvelle action combinée pour les fetches initiales
export async function getTransactionsAndTotals(email: string, period:Period="all"): Promise<{ transactions: Transaction[], totals: Totals | undefined | null }> {
    const [transactions, totals] = await Promise.all([
      getTransactionsByPeriod(email, period),
      getTotalTransactionAmountByEmail(email),
    ]);
    return { transactions, totals };
  }

  
    
  