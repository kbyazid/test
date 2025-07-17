import TransactionList from '../components/TransactionList';
import Wrapper from '../components/Wrapper'
import { Suspense } from "react"; // Importez Suspense

const TransactionPage = async () => {
    return (
        <Wrapper >
            {/* Header */}
{/*             <div className="space-y-6 mb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Recettes / Dépenses</h1>
                    <p className="text-muted-foreground">Suivez et gérez vos transactions.</p>
                </div>
            </div> */}


            {/* Transactions List */}
            {/* Utilisation de Suspense pour charger les transactions de manière asynchrone */}
            <Suspense fallback={
                <div className="flex justify-center items-center py-10">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <span className="ml-4 font-bold text-primary">Chargement des transactions...</span>
                </div>
            }>
                <TransactionList /> {/* Le composant qui va chercher les données */}
            </Suspense>

        </Wrapper>
    )
}

export default TransactionPage