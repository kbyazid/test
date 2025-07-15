import Wrapper from "@/app/components/Wrapper";
/* import Link from "next/link"; */
import { ArrowLeft, Send } from "lucide-react";
import { Transaction } from "@/type";
import BudgetItemPrct from "@/app/components/BudgetItemPrct";
import { formatCurrency } from '@/lib/utils'
import { getBudgetAndTransactions } from "@/app/data/data";
import ClientLink from "@/app/components/ClientLink"; // Importez le ClientLink

interface BudgetDetailsPageProps {
    params: Promise<{ budgetId: string }>; // Mise à jour pour indiquer que params est une Promise
}

export default async function BudgetDetailsPage({ params }: BudgetDetailsPageProps) {
    const { budgetId } = await params; // Attendre params pour résoudre le paramètre de la route dynamique

    const data = await getBudgetAndTransactions(budgetId);

    if (!data || !data.budget) {
        return (
            <Wrapper>
                <div className="text-center py-10">
                    <p className="text-red-500">Budget non trouvé.</p>
                    <ClientLink href="/budget" className="btn btn-accent mt-4">
                        Retour aux budgets
                    </ClientLink>
                </div>
            </Wrapper>
        );
    }

    const { budget, transactions } = data;

    return (
        <Wrapper>
            <div className="mb-6">
                <ClientLink href="/" className="btn btn-ghost mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                </ClientLink>

                {budget && (
                    <div className='flex md:flex-row flex-col'>
                        <div className='md:w-1/3'>
                            <BudgetItemPrct budget={budget} enableHover={0} depenseColor='text-red-500 font-bold' />
                        </div>
                        {budget?.transaction && budget.transaction.length > 0 ? (
                            <div className="md:mt-0 mt-4 md:w-2/3 mx-2">
                                <h2 className="text-xl font-semibold mb-4">Transactions</h2>
                                <div className="overflow-x-auto space-y-4 flex flex-col">
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
                                                    {formatCurrency(transaction.amount)}
                                                    {/* {transaction.amount.toFixed(2)} Da */}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className='md:w-2/3 mt-10 md:ml-4 flex items-center justify-center'>
                                <Send strokeWidth={1.5} className='w-8 h-8 text-accent' />
                                <span className='text-gray-500 tracking-tight ml-2'>Aucune transaction pour ce budget.</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Wrapper>
    );
}
