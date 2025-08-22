import { PrismaClient } from "@/app/generated/prisma";
import { currentUser } from "@clerk/nextjs/server";
import Wrapper from "@/app/components/Wrapper";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Transaction } from "@/type";
import BudgetItemPrct from "@/app/components/BudgetItemPrct";
import DeleteTransactionButton from "@/app/components/DeleteTransactionButton";
import { revalidatePath } from "next/cache";
import AddTransactionButton from "@/app/components/AddTransactionButton";
import { formatCurrency, formatDate } from "@/lib/utils";

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
  
  // Récupération de l'utilisateur connecté
  const user = await currentUser();
  if (!user?.primaryEmailAddress?.emailAddress) {
    return (
      <Wrapper>
        <div className="text-center py-10">
          <p className="text-red-500">Vous devez être connecté pour voir cette page.</p>
          <Link href="/sign-in" className="btn btn-accent mt-4">
            Se connecter
          </Link>
        </div>
      </Wrapper>
    );
  }
  const email = user.primaryEmailAddress.emailAddress;

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
    // Fonction pour revalider le cache après suppression ou ajout
    async function handleTransactionChange() {
      "use server";
      revalidatePath(`/manage/${budgetId}`);
    }
  
  return (
    <Wrapper>
      <div className="mb-6">
        <Link href="/budget" className="btn btn-ghost mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Link>
        <div className="flex flex-col md:flex-row gap-4 mt-4  ">
          <div className="flex-1">
            <BudgetItemPrct budget={budget} enableHover={1} />
          </div>
          <AddTransactionButton
            budgetId={budgetId}
            onAddSuccess={handleTransactionChange}
            email={email} // Utilisation de l'email réel et non email="tlemcencrma20@gmail.com"
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Transactions</h2>
      {transactions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Aucune transaction pour ce budget.</p>
        </div>
      ) : (
        <table className="table table-zebra ">
                  <thead>
                    <tr>
                    {/* <th></th> */}
                      <th className="text-left">Montant</th>
                      <th>Description</th>
		                  <th className="md:hidden text-left px-2 py-3">Date/Heure</th>
                      <th className="hidden md:table-cell">Date</th>
                      <th className="hidden md:table-cell">Heure</th>
                      <th className="text-center hidden md:table-cell">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                   {transactions?.map((transaction: Transaction) => (
                      <tr key={transaction.id}>
                        {/* <td className='text-lg md:text-3xl'>{transaction.emoji}</td> */}
                        <td>
                          {/* badge-accent badge-xs md:badge-sm */}
                          <div className="text-accent">
                            {formatCurrency(transaction.amount)}{/* {transaction.amount} Da */}
                          </div>
                        </td>
                        <td>{transaction.description}</td>


                        <td className='hidden md:table-cell text-center p-2 md:p-4'>
                          {transaction.createdAt.toLocaleDateString("fr-FR")}
                        </td>
                        <td className='hidden md:table-cell text-center p-2 md:p-4'>
                          {transaction.createdAt.toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </td>

                        <td className="md:hidden px-2 py-3">
                          <div className='flex flex-col items-start'>                          
                            <span className='text-xs mb-1'>
                              {formatDate(transaction.createdAt, { withTime: true })}
                            </span>
                            <div className='flex items-center gap-2 mt-2'>
                              {transaction.type === "expense" && (
                                <DeleteTransactionButton
                                  transactionId={transaction.id}
                                  onDeleteSuccess={handleTransactionChange}
                                />
                              )}
                            </div>
                          </div>
                        </td>



                        <td className='hidden md:table-cell text-center p-2 md:p-4'>
                          <div className="flex items-center justify-center gap-2">
                           {transaction.type === "expense" && (
                          <DeleteTransactionButton
                            transactionId={transaction.id}
                            onDeleteSuccess={handleTransactionChange}
                          />
                        )}
                          </div>                       
                        </td>
                      </tr>
                      
                    ))}
                  </tbody>
                </table> 
      )}
    </Wrapper>
  );
}