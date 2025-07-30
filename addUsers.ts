// scripts/add-users.ts
import prisma from "@/lib/prisma";  // le client { PrismaClient }  est ds ce fichier
//import { PrismaClient } from '@prisma/client'; // Assurez-vous d'importer PrismaClient
import { faker } from '@faker-js/faker'; // Importez faker

// Initialisez le client Prisma   se fait ds lib/prisma
// const prisma = new PrismaClient();

async function main() {
  console.log("Démarrage de l'ajout d'utilisateurs fictifs...");
  const numberOfUsers = 100; // Vous pouvez ajuster le nombre d'utilisateurs à ajouter

  // Assurez une graine (seed) pour la reproductibilité (optionnel)
  // faker.seed(123); 

  for (let i = 0; i < numberOfUsers; i++) {
    const firstName = faker.person.firstName(); // Utilisez faker.person.firstName() pour le prénom
    const lastName = faker.person.lastName();   // Utilisez faker.person.lastName() pour le nom de famille
    const name = `${firstName} ${lastName}`;    //
    const email = faker.internet.email({ firstName, lastName }); //
    /* name: name, */   
    try {
      await prisma.user.create({ //
        data: {
            email: email, //
        },
      });
      if ((i + 1) % 100 === 0) {
        console.log(`Ajouté ${i + 1} utilisateurs...`);
      }
    } catch (error: any) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        // Gérer les doublons d'email de manière élégante si @unique est en place
        console.warn(`Email en double détecté pour ${email}, en ignorant cet utilisateur.`);
      } else {
        console.error(`Erreur lors de l'ajout de l'utilisateur ${name} (${email}):`, error);
      }
    }
  }
  console.log(`Fin de l'ajout. ${numberOfUsers} utilisateurs tentés d'être ajoutés.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });