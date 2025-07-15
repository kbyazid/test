import BudgetItemPrct from "../components/BudgetItemPrct"; // Supposons que c'est un Client Component ou un Server Component qui n'utilise pas Link directement
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getBudgetsByUser } from "@/app/data/data"; // Type Budget
// Composant Client pour envelopper Next.js Link
// (Créez ce fichier dans components/ClientLink.tsx)
import ClientLink from "../components/ClientLink";
import { Budget } from "@/type";

// Nouveau Server Component pour afficher la liste des budgets
// Cela pourrait être dans un fichier séparé comme components/BudgetList.tsx
export async function BudgetList() {
    const userBudgets: Budget[] = await getBudgetsByUser("tlemcencrma20@gmail.com"); // Appel asynchrone des données
  
    return (
      <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {userBudgets.map((budget) => (
          // Utilisez le composant ClientLink pour envelopper Link
          <ClientLink href={`/managehome/${budget.id}`} key={budget.id}>
            <BudgetItemPrct budget={budget} enableHover={1} />
          </ClientLink>
        ))}
      </ul>
    );
  }