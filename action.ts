"use server"  // Important pour les Server Actions de Next.js

import prisma from "@/lib/prisma";

export async function getAllMessages() {
    return await prisma.test_connection.findMany({
      select: {
        id: true,
        message: true,
      },
    });
  }

  export async function getBudgets() {
    try {
        const userBudget = await prisma.budget.findMany({

        })

        return userBudget

    } catch (error) {
        console.error('Erreur lors de la récupération des budgets:', error);
        throw error;
    }
}