/* export const dynamic = "force-dynamic"; // Désactive le cache statique
export const revalidate = 0; // Pas de cache
 */
import TransactionList from '../components/TransactionList';
import Wrapper from '../components/Wrapper'
import { Suspense } from "react"; // Importez Suspense

interface TransactionPageProps {
    searchParams: Promise<{ startDate?: string; endDate?: string }>;
}

const TransactionPage = async ({ searchParams }: TransactionPageProps) => {
    const params = await searchParams;
    
    return (
        <Wrapper >

            {/* Transactions List */}
            {/* Utilisation de Suspense pour charger les transactions de manière asynchrone */}
            <Suspense fallback={
                <div className="flex justify-center items-center py-10">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <span className="ml-4 font-bold text-primary">Chargement des transactions...</span>
                </div>
            }>
                <TransactionList 
                    startDate={params.startDate}
                    endDate={params.endDate}
                /> {/* Le composant qui va chercher les données */}
            </Suspense>

        </Wrapper>
    )
}

export default TransactionPage