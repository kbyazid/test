// scripts/add-users.ts
import prisma from "@/lib/prisma";  // le client { PrismaClient }  est ds ce fichier
//import { PrismaClient } from '@prisma/client'; // Assurez-vous d'importer PrismaClient
import { faker } from '@faker-js/faker'; // Importez faker
import Wrapper from "../components/Wrapper";

// Initialisez le client Prisma   se fait ds lib/prisma
// const prisma = new PrismaClient();

const page=()=>{

  async function main(){
    console.log("Démarrage de l'ajout d'utilisateurs fictifs...");
    const numberOfUsers = 10; // Vous pouvez ajuster le nombre d'utilisateurs à ajouter
  
    // Assurez une graine (seed) pour la reproductibilité (optionnel)
    /* faker.seed(789);  */
  
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
      } catch (error) {
        console.error(`Erreur inattendue lors de l'ajout de l'utilisateur ${name} (${email}):`, error);
        // Vérifier et caster le type de l'erreur si nécessaire
/*         if (error instanceof Error) {
          if ('code' in error && error.code === 'P2002' && 'meta' in error && error.meta?.target?.includes('email')) {
            // Gérer les doublons d'email de manière élégante si @unique est en place
            console.warn(`Email en double détecté pour ${email}, en ignorant cet utilisateur.`);
          } else {
            console.error(`Erreur lors de l'ajout de l'utilisateur ${name} (${email}):`, error);
          }
        } else {
          console.error(`Erreur inattendue lors de l'ajout de l'utilisateur ${name} (${email}):`, error);
        } */
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

  return ( 
    <Wrapper >
        
            <div className="flex items-center justify-center flex-col py-10 w-full">
                <div className="flex flex-col">
                    {/* Titre  */}
                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold text-center">
                        Démarrage de l&apos;ajout d&apos;utilisateurs fictifs...
                        </h1>
                    </div>

                </div>
            </div>
       
    </Wrapper>   
  
)
}

export default page