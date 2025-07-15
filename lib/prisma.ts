// lib/prisma.ts
import { PrismaClient } from  '../app/generated/prisma'; 

// Déclarer une variable globale pour PrismaClient pour éviter de créer de nouvelles instances
// à chaque hot-reload en développement.
declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;

