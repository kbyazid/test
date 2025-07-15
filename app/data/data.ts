// lib/data.ts
// Import de Prisma pour la fonction getBudgetsByUser
import prisma from "@/lib/prisma"; 
import { Budget } from "@/type"; // Importez le type Budget si nécessaire

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