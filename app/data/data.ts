// lib/data.ts
// Import de Prisma pour la fonction getBudgetsByUser
import prisma from "@/lib/prisma"; 
import { Budget, Transaction } from "@/type"; // Importez le type Budget si nécessaire

interface BudgetWithTransactions extends Budget {
    transaction: Transaction[];
  }
  
/* ======================================================================= */
/* utilse ds test\app\components\BudgetList.tsx ds home page  */
// Fonction pour récupérer les budgets par utilisateur
export async function getBudgetsByUser(email: string = "tlemcencrma20@gmail.com"): Promise<Budget[]> {
  // await new Promise(resolve => setTimeout(resolve, 15000)); // Pour tester le Suspense

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        budget: {
          include: {
            transaction: true,
          },
        },
      },
    });

    if (!user) {
      // Vous pouvez choisir de ne pas lancer d'erreur et retourner un tableau vide si l'utilisateur n'est pas trouvé
      // Ou lancer une erreur pour la gérer plus haut
      throw new Error("Utilisateur non trouvé");
    }
    return user.budget as Budget[]; // Assurez-vous que le type correspond à Budget[]
  } catch (error) {
    console.error('Erreur lors de la récupération des budgets:', error);
    // Important: relancer l'erreur pour que le composant appelant puisse la gérer ou que Next.js affiche une page d'erreur
    throw error;
  }
}

/* ======================================================================= */
/* utilse ds   */
// Fonction pour récupérer le Budget et ces transactions 
/* export async function getBudgetAndTransactions(budgetId: string) {
    try {
      const budget = await prisma.budget.findUnique({
        where: { id: budgetId },
        include: { transaction: true },
      });
  
      if (!budget) {
        return null;
      }
  
      const transactions = await prisma.transaction.findMany({
        where: { budgetId },
        orderBy: { createdAt: "desc" },
      });
  
      return { budget, transactions };
    } catch (error) {
      console.error("Erreur lors de la récupération du budget et des transactions :", error);
      return null;
    }
  } */
/* finally {await prisma.$disconnect(); } */

export async function getBudgetAndTransactions(budgetId: string): Promise<{ budget: BudgetWithTransactions; transactions: Transaction[] } | null> {
    try {
      const budget = await prisma.budget.findUnique({
        where: { id: budgetId },
        include: { transaction: true }, // Inclure les transactions liées au budget
      });
  
      if (!budget) {
        return null;
      }
  
      // Récupérer les transactions séparément si nécessaire, ou utiliser celles incluses dans le budget
      // Si vous voulez toutes les transactions liées à ce budget, l'include ci-dessus est suffisant.
      // Si vous avez besoin de filtrer/ordonner les transactions différemment, cette deuxième requête peut être utile.
      // Pour cet exemple, nous allons utiliser les transactions incluses pour simplifier.
      const transactions = budget.transaction; // Utilise les transactions déjà incluses
  
      return { budget: budget as BudgetWithTransactions, transactions };
    } catch (error) {
      console.error("Erreur lors de la récupération du budget et des transactions :", error);
      return null;
    }
    // Pas de prisma.$disconnect() ici, laissé à la gestion du pool de Prisma
  }