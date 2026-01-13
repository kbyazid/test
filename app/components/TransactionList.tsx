// app/transactions/components/TransactionList.tsx
// PAS de "use client"; - Ce composant est un Server Component.
import { getTransactionsAndTotals } from "@/app/data/data"; // Importez depuis votre fichier de données
import { Transaction, Totals } from "@/type"; // Vos types sont dans '@/type'
import { formatCurrency } from '@/lib/utils'; // Vos utilitaires de formatage
import DashboardCard from '../components/DashboardCard'; // Assurez-vous du chemin
import TransactionCard from '../components/TransactionCard'; // Assurez-vous du chemin
// Importez le nouveau Client Component pour l'ajout de transaction
import AddIncomeTransactionSection from '../components/AddIncomeTransactionSection.tsx';
import TransactionTable from '../components/TransactionTable';
import {
    ArrowDownCircle,
    ArrowUpCircle,
    CircleDollarSignIcon,
    // Send, // Pas utilisé pour l'affichage pur
    // Search, // Pas utilisé pour l'affichage pur
    // Trash, // Pas utilisé pour l'affichage pur
    // View // Pas utilisé pour l'affichage pur
} from 'lucide-react';
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
/* import Wrapper from "./Wrapper";
import Link from "next/link"; */

// Composant principal TransactionList (Server Component)
export default async function TransactionList({ 
    startDate, 
    endDate 
}: { 
    startDate?: string; 
    endDate?: string; 
}) {
    // Récupération de l'utilisateur connecté
  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress
  if (!user?.primaryEmailAddress?.emailAddress) {
console.log(" user Email : ", userEmail)
  }

    /* const userEmail = "tlemcencrma20@gmail.com" */ // Email par défaut
    
    let transactions: Transaction[] = [];
    let totals: Totals | null| undefined = null;
    let errorLoadingData: string | null = null;

    try {
        // Récupération des données directement côté serveur
        // Pour cette version minimaliste, nous n'avons pas de searchParams ici pour la période.
        // Si vous voulez le filtre de période, il faudra passer `searchParams` de page.tsx à TransactionList.
        const data = await getTransactionsAndTotals(userEmail!, "all"); // Fetch toutes les transactions par défaut
        transactions = data.transactions;
        totals = data.totals;
        console.log("📦 Données reçues dans TransactionList:", data);
        console.log(`🔢 ${transactions?.length ?? 0} transactions récupérées`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        console.error("Erreur lors du chargement des transactions dans TransactionList:", error);
        if (
            error.message && (
                error.message.includes("Can't reach database server") ||
                error.message.includes("Timed out connecting to the database") ||
                error.message.includes("connection refused")
            )
        ) {
            errorLoadingData = "Impossible de se connecter à la base de données. Veuillez réessayer plus tard.";
        } else {
            errorLoadingData = error instanceof Error ? error.message : "Une erreur inattendue est survenue lors du chargement des données.";
        }
    }

    if (errorLoadingData) {
        return (
            
            <div className="text-center py-10 text-red-500">
                <p className="text-lg font-semibold">{errorLoadingData}</p>
                {errorLoadingData.includes("base de données") && (
                    <p className="mt-2 text-sm text-gray-600">Veuillez vérifier l&apos;état de votre serveur de base de données.</p>
                )}
            </div>
           
        );
    }
    // Fonction pour revalider le cache après suppression ou ajout
        async function handleTransactionChange() {
          "use server";
          revalidatePath(`/transaction`);
        }
    return (
        <>
         {/* Header */}
         <div className="space-y-6 mb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Recettes / Dépenses</h1>
                    <p className="text-muted-foreground">Suivez et gérez vos transactions.</p>
                </div>
                {/* Rendre le Client Component pour l'ajout de transaction */}
            <AddIncomeTransactionSection 
            userEmail={userEmail!} 
            onAddSuccess={handleTransactionChange}
            />
            {/* onAddSuccess={handleTransactionChange} */}
            </div>
            
            {/* Cards - Rendu ici car les données des totaux sont fetchées par TransactionList */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">
                <DashboardCard
                    label="Solde"
                    value={totals?.balance != null ? formatCurrency(totals.balance) : "N/A"}
                    icon={<CircleDollarSignIcon />}
                />
                <TransactionCard
                    label="Recettes"
                    value={totals?.totalIncome != null ? formatCurrency(totals.totalIncome) : "N/A"}
                    icon={<ArrowDownCircle className="text-blue-600 w-8 h-8" />}
                    cardColor="income"
                />
                <TransactionCard
                    label="Dépenses"
                    value={totals?.totalExpenses != null ? formatCurrency(totals.totalExpenses) : "N/A"}
                    icon={<ArrowUpCircle className="text-red-600 w-8 h-8" />}
                    cardColor="expense"
                />
            </div>
            
            {/* Transactions List Table */}
            <TransactionTable 
                transactions={transactions} 
                startDate={startDate}
                endDate={endDate}
            />
        </>
    );
}

