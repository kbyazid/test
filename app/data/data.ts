// lib/data.ts
import prisma from "@/lib/prisma";
import { Budget, Transaction } from "@/type";
import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientValidationError // Assurez-vous d'importer toutes les erreurs Prisma que vous pourriez vouloir gérer
} from '@prisma/client/runtime/library';

export type FetchResult<T> = { data: T; error: null } | { data: null; error: string };

interface BudgetWithTransactions extends Budget {
  transaction: Transaction[];
}

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