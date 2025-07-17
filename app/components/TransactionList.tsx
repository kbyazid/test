// app/transactions/components/TransactionList.tsx
// PAS de "use client"; - Ce composant est un Server Component.
import { getTransactionsAndTotals } from "@/app/data/data"; // Importez depuis votre fichier de données
import { Transaction, Totals } from "@/type"; // Vos types sont dans '@/type'
import { formatCurrency, formatDate } from '@/lib/utils'; // Vos utilitaires de formatage

import DashboardCard from '../components/DashboardCard'; // Assurez-vous du chemin
import TransactionCard from '../components/TransactionCard'; // Assurez-vous du chemin
// Importez le nouveau Client Component pour l'ajout de transaction
import AddIncomeTransactionSection from '../components/AddIncomeTransactionSection.tsx';
import {
    ArrowDownCircle,
    ArrowUpCircle,
    CircleDollarSignIcon,
    // Send, // Pas utilisé pour l'affichage pur
    // Search, // Pas utilisé pour l'affichage pur
    // Trash, // Pas utilisé pour l'affichage pur
    // View // Pas utilisé pour l'affichage pur
} from 'lucide-react';

// Composant principal TransactionList (Server Component)
export default async function TransactionList() {
   
    const userEmail = "tlemcencrma20@gmail.com" // Email par défaut

    let transactions: Transaction[] = [];
    let totals: Totals | null| undefined = null;
    let errorLoadingData: string | null = null;

    try {
        // Récupération des données directement côté serveur
        // Pour cette version minimaliste, nous n'avons pas de searchParams ici pour la période.
        // Si vous voulez le filtre de période, il faudra passer `searchParams` de page.tsx à TransactionList.
        const data = await getTransactionsAndTotals(userEmail, "all"); // Fetch toutes les transactions par défaut
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

    return (
        <>
         {/* Header */}
         <div className="space-y-6 mb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Recettes / Dépenses</h1>
                    <p className="text-muted-foreground">Suivez et gérez vos transactions.</p>
                </div>
                {/* Rendre le Client Component pour l'ajout de transaction */}
            <AddIncomeTransactionSection userEmail={userEmail} />
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
            <TransactionsTable transactions={transactions} />
        </>
    );
}

// Les sous-composants TransactionTable et TransactionRow deviennent des composants de TransactionList
// S'ils n'ont pas d'interactivité, ils n'ont pas besoin de "use client".
const TransactionsTable = ({
    transactions
}: {
    transactions: Transaction[],
}) => (
    <div className="md:mt-0 mt-4 mx-auto max-w-full">
        <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th></th>
                        <th className="hidden md:table-cell">Date</th>
                        <th className="md:hidden text-left px-2 py-3">Détails</th>
                        <th className="hidden md:table-cell">Description</th>
                        <th className="hidden md:table-cell">Budget / Type</th>
                        <th className="text-right">Montant</th>
                        {/* Supprimé les colonnes d'action car nous sommes en mode lecture pure */}
                    </tr>
                </thead>
                <tbody>
                    {transactions.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center py-8 text-gray-500">
                                Aucune transaction trouvée pour cette période.
                            </td>
                        </tr>
                    ) : (
                        transactions.map((transaction) => (
                            <TransactionRow
                                key={transaction.id}
                                transaction={transaction}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);


const TransactionRow = ({
    transaction
}: {
    transaction: Transaction,
}) => {
    const isIncome = transaction.type === "income"
    const amountClass = isIncome ? "text-green-600" : "text-red-600"
    const amountSign = isIncome ? '+' : '-'
    const formattedAmount = formatCurrency(Math.abs(transaction.amount))

    return (
        <tr className="hover">
            <td className='text-lg md:text-3xl p-2 md:p-4'>{transaction.emoji || '💸'}</td>

            <td className='hidden md:table-cell p-2 md:p-4'>
                <div className='flex flex-col'>
                    <span className='text-sm font-medium'>
                        {formatDate(transaction.createdAt, { withTime: false })}
                    </span>
                    <span className='text-xs text-gray-500'>
                        {formatDate(transaction.createdAt, { withTime: true })}
                    </span>
                </div>
            </td>

            <td className="md:hidden px-2 py-3">
                <div className='flex flex-col items-start'>
                    <span className='text-xs text-gray-500 mb-1'>
                        {formatDate(transaction.createdAt, { withTime: true })}
                    </span>
                    <span className='font-bold text-sm mb-1'>{transaction.description}</span>
                    {transaction.budgetName && (
                        <span className="badge badge-outline badge-info text-xs mb-1">
                            {transaction.budgetName}
                        </span>
                    )}
                    <span className={`badge badge-outline ${
                        isIncome ? 'badge-success' : 'badge-error'
                    } text-xs mb-1`}>
                        {isIncome ? 'Recette' : 'Dépense'}
                    </span>
                </div>
            </td>

            <td className='hidden md:table-cell p-2 md:p-4'>
                {transaction.description}
            </td>

            <td className='hidden md:table-cell p-2 md:p-4'>
                {transaction.budgetName && (
                    <span className="badge badge-soft badge-info inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mb-1">
                        {transaction.budgetName}
                    </span>
                )}
                <span className={`badge badge-soft ${
                    isIncome ? 'badge-success' : 'badge-error'
                } inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium`}>
                    {isIncome ? 'Recette' : 'Dépense'}
                </span>
            </td>

            <td className={`text-right p-2 md:p-4 font-semibold ${amountClass}`}>
                {amountSign}{formattedAmount}
            </td>
            {/* Supprimé les boutons d'action */}
        </tr>
    )
}