import React from 'react'
import prisma from "@/lib/prisma"; // Client Prisma pour interagir avec la base de données
import Wrapper from '../components/Wrapper'; // Composant conteneur pour uniformiser la mise en page
import UserList from "../components/UserList"; // Composant d'affichage de la liste des utilisateurs
import Link from "next/link"; // Composant de navigation interne Next.js
import { SearchInput } from '../components/SearchInput'; // Champ de recherche utilisateur
import { toggleUserStatus } from "@/action";
import { requireAuth } from "@/lib/auth";

/**
 * Définition du type User pour correspondre à l'attente du composant UserList.
 * C'est une solution rapide pour résoudre l'erreur de compilation.
 */
interface User {
  id: string;
  email: string;
  status: boolean;
  role: "ADMIN" | "USER";
  createdAt: Date;
}

/**
 * Page Users : affiche la liste des utilisateurs avec pagination et recherche
 */
export default async function users({
    searchParams,
  }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }) {
    // Vérification d'authentification et d'autorisation
    await requireAuth("ADMIN");
    
    // Récupère le paramètre "page" depuis l’URL (via searchParams)
    const pages = (await searchParams).page
    const ITEMS_PER_PAGE = 3; // Nombre d'utilisateurs par page
    const pageParam = pages;

    // Assurez-vous que 'page' est bien un nombre valide, sinon on met par défaut 1
    const page = Number(pageParam) || 1;

    // Assurez-vous que 'search' est un string valide. S'il est undefined ou non-string, il devient une chaîne vide.
    const searchParam = (await searchParams).search;
    const search = typeof searchParam === 'string' ? searchParam : '';

    // Construire la clause 'where' conditionnellement
    const userWhereClause: { email?: { contains: string } } = {};
    if (search !== "") {
        userWhereClause.email = { contains: search };
    }

    // 1. Obtenir le nombre total d'utilisateurs pour la pagination
    const totalUsers = await prisma.user.count({
        where: userWhereClause // Utilisation de la clause 'where' conditionnelle
    });

    // 2. Calculer le nombre total de pages
    const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

    // Assurez-vous que 'currentPage' est au moins 1 et inferieur ou egal a totalPages
    const currentPage =  page <= totalPages  ? Math.max(1, page) : 1;

    // 3. Récupérer les utilisateurs pour la page actuelle
    const rawUsers = await prisma.user.findMany({
      take: ITEMS_PER_PAGE,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      where: userWhereClause, // Utilisation de la clause 'where' conditionnelle
      orderBy: {
        createdAt: 'desc', // Ou un autre champ pour un ordre cohérent
      },
    });

      // Assurez-vous que le type 'role' est correct avant de passer les données à UserList
  const users: User[] = rawUsers.map(user => ({
    ...user,
    // Cast sécurisé: TypeScript est rassuré, mais il faudra s'assurer que les données sont valides en amont
    role: user.role as "ADMIN" | "USER", 
  }));

/* async function toggleUserStatus(userId: string) {
  "use server";
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Utilisateur non trouvé");

  await prisma.user.update({
    where: { id: userId },
    data: { status: !user.status },
  });

  revalidatePath("/users");
} */
    /* console.log(users) */
  return (
    <Wrapper>
      <div className="space-y-6 mb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col w-full max-w-4xl"> {/* Ajustez max-w-4xl si nécessaire */}
        {/* Titre */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
                <p className="text-muted-foreground">Nombre total d&apos;utilisateurs : {totalUsers}</p>
            </div>
        {/* Section Recherche et ajout */}
            <SearchInput search={search} />
  
        {/* La liste des utilisateurs rendue par UserList */}
            {/* <UserList users={users} /> */}
          <UserList
            users={users}
            renderActions={(user) => (
        <form action={async () => { "use server"; await toggleUserStatus(user.id); }}>
          <button
            type="submit"
            className={`btn btn-sm ${user.status ? "btn-success" : "btn-error"}`}
          >
            
            {user.status ? "Désactiver" : "Activer"}
          </button>
        </form>
      )}
            />


        {/* Section de Pagination */}
        <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            search={search}
          />
        </div>
      </div>
    </Wrapper>
  );
}

// Composant interne pour les contrôles de pagination
function PaginationControls({
  currentPage,
  totalPages,
  search,
}: {
  currentPage: number;
  totalPages: number;
  search?: string; // search peut être une chaîne vide, ce qui est géré par Link
}) {
  // Déterminer si les boutons doivent être désactivés
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="flex justify-between items-center mt-8 w-full">
      {/* Bouton Précédent */}
      <Link
        href={`/users?page=${currentPage - 1}${
          search ? `&search=${encodeURIComponent(search)}` : ""
        }`}
        className={`btn btn-primary ${
          !hasPreviousPage ? "btn-disabled opacity-50" : ""
        }`}
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
        href={`/users?page=${currentPage + 1}${
          search ? `&search=${encodeURIComponent(search)}` : ""
        }`}
        className={`btn btn-primary ${
          !hasNextPage ? "btn-disabled opacity-50" : ""
        }`}
        aria-disabled={!hasNextPage}
        tabIndex={!hasNextPage ? -1 : undefined}
      >
        Suivant
      </Link>
    </div>
  );
}