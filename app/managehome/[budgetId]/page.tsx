import Wrapper from "@/app/components/Wrapper";
import { getBudgetAndTransactions } from "@/app/data/data";
import BudgetDetailsClient from "@/app/components/BudgetDetailsClient";
import ClientLink from "@/app/components/ClientLink"; // Importez le ClientLink

interface BudgetDetailsPageProps {
    params: Promise<{ budgetId: string }>; // Mise à jour pour indiquer que params est une Promise
}

export default async function BudgetDetailsPage({ params }: BudgetDetailsPageProps) {
    const { budgetId } = await params; // Attendre params pour résoudre le paramètre de la route dynamique
    const result = await getBudgetAndTransactions(budgetId);

    // Gérer les erreurs de récupération de données
  if (result.error) {
    return (
      <Wrapper>
        <div className="text-center py-10">
          <p className="text-red-500 text-lg font-semibold">{result.error}</p>
          {result.error.includes("base de données") && (
              <p className="mt-2 text-sm text-gray-600">Veuillez vérifier l&aposétat du serveur de base de données.</p>
          )}
          {/* Si le budget n'est pas trouvé ou s'il y a une erreur DB, on propose de revenir à l'accueil */}
          <div className="btn btn-accent mt-4">
            <ClientLink href="/" >
            Retour à l&apos;accueil
          </ClientLink>
          </div>
          
        </div>
      </Wrapper>
    );
  }
    
    const { budget, transactions } = result.data!;

    return (
        <BudgetDetailsClient budget={budget} initialTransactions={transactions} />
    );
}
