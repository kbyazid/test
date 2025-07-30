import React from 'react'
import prisma from "@/lib/prisma";
import Wrapper from '../components/Wrapper';
import UserList from "../components/UserList";
import Link from "next/link";

export default async function Page({
    searchParams,
  }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }) {
    const pages = (await searchParams).page
    /* const pageParam = pages; */
  // Assurez-vous que 'page' est un nombre valide, par défaut 1
  /* const page = Number(pageParam) || 1; */
  /* console.log('Page actuelle:', pages); */
  const ITEMS_PER_PAGE = 3; // Nombre d'utilisateurs par page
  const pageParam = pages;
// Assurez-vous que 'page' est un nombre valide, par défaut 1
const page = Number(pageParam) || 1;
console.log('Page actuelle:', page);

// Assurez-vous que 'currentPage' est au moins 1 
/* const currentPage = Math.max(1, page); */

// 1. Obtenir le nombre total d'utilisateurs pour la pagination
const totalUsers = await prisma.user.count();

// 2. Calculer le nombre total de pages
const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);
// Assurez-vous que 'currentPage' est au moins 1 et inferieur ou egal a totalPages
const currentPage =  page<= totalPages  ? Math.max(1, page) : 1

// 3. Récupérer les utilisateurs pour la page actuelle
const users = await prisma.user.findMany({
  take: ITEMS_PER_PAGE,
  skip: (currentPage - 1) * ITEMS_PER_PAGE,
  orderBy: {
    createdAt: 'desc', // Ou un autre champ pour un ordre cohérent
  },
});

// Déterminer si les boutons Précédent et Suivant doivent être désactivés
const hasPreviousPage = currentPage > 1;
const hasNextPage = currentPage < totalPages;
  return (
<Wrapper>
      <div className="flex items-center justify-center flex-col py-10 w-full">
        <div className="flex flex-col w-full max-w-4xl"> {/* Ajustez max-w-4xl si nécessaire */}
          {/* Titre */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-center">Gestion des Utilisateurs</h1>
            <p className="text-center text-muted-foreground mt-2">
              Nombre total d&apos;utilisateurs : {totalUsers}
            </p>
          </div>

          <UserList users={users} />

          {/* Section de Pagination */}
          <div className="flex justify-between items-center mt-8 w-full">
            {/* Bouton Précédent */}
            <Link
              href={`/users?page=${currentPage - 1}`}
              className={`btn btn-primary ${!hasPreviousPage ? 'btn-disabled opacity-50' : ''}`}
              aria-disabled={!hasPreviousPage}
              tabIndex={!hasPreviousPage ? -1 : undefined}
            >
              Précédent
            </Link>

            {/* Informations de pagination */}
            <span className="text-lg font-semibold">
              Page {currentPage} sur {totalPages}
            </span>

            {/* Bouton Suivant */}
            <Link
              href={`/users?page=${currentPage + 1}`}
              className={`btn btn-primary ${!hasNextPage ? 'btn-disabled opacity-50' : ''}`}
              aria-disabled={!hasNextPage}
              tabIndex={!hasNextPage ? -1 : undefined}
            >
              Suivant
            </Link>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

