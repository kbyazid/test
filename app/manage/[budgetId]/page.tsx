import { PrismaClient } from "@/app/generated/prisma";
import Wrapper from "@/app/components/Wrapper";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {  Transaction } from "@/type";

interface BudgetDetailsPageProps {
  params: Promise<{ budgetId: string }>; // Mise à jour pour indiquer que params est une Promise
}

const prisma = new PrismaClient();

async function getBudgetAndTransactions(budgetId: string) {
  try {
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
      include: { transaction: true },
    });

    if (!budget) {
      return null;
    }

    const transactions = await prisma.transaction.findMany({
      where: { budgetId },
      orderBy: { createdAt: "desc" },
    });

    return { budget, transactions };
  } catch (error) {
    console.error("Erreur lors de la récupération du budget et des transactions :", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export default async function BudgetDetailsPage({ params }: BudgetDetailsPageProps) {
  const { budgetId } = await params; // Attendre params pour résoudre le paramètre de la route dynamique

  const data = await getBudgetAndTransactions(budgetId);

  if (!data || !data.budget) {
    return (
      <Wrapper>
        <div className="text-center py-10">
          <p className="text-red-500">Budget non trouvé.</p>
          <Link href="/budget" className="btn btn-accent mt-4">
            Retour aux budgets
          </Link>
        </div>
      </Wrapper>
    );
  }

  const { budget, transactions } = data;

  return (
    <Wrapper>
      <div className="mb-6">
        <Link href="/budget" className="btn btn-ghost mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Link>

        <h1 className="text-2xl font-bold tracking-tight">
          {budget.emoji} {budget.name}
        </h1>
        <p className="text-muted-foreground">
          Montant total : {budget.amount.toFixed(2)} €
        </p>
        <p className="text-muted-foreground">
          Dépenses :{" "}
          {(budget.transaction?.reduce((sum, t) => sum + t.amount, 0) || 0).toFixed(2)} €
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-4">Transactions</h2>
      {transactions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Aucune transaction pour ce budget.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {transactions.map((transaction: Transaction) => (
            <li
              key={transaction.id}
              className="p-4 bg-base-200 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <span className="text-lg">{transaction.emoji || "💸"}</span>{" "}
                <span className="font-medium">{transaction.description}</span>
                <p className="text-sm text-muted-foreground">
                  {new Date(transaction.createdAt).toLocaleDateString()} -{" "}
                  {transaction.type === "income" ? "Revenu" : "Dépense"}
                </p>
              </div>
              <span
                className={
                  transaction.type === "income" ? "text-green-500" : "text-red-500"
                }
              >
                {transaction.type === "income" ? "+" : "-"}
                {transaction.amount.toFixed(2)} €
              </span>
            </li>
          ))}
        </ul>
      )}
    </Wrapper>
  );
}