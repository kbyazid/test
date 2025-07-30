"use client";
import { useEffect, useState } from "react";
import {
  getLastBudgets,
  getLastTransactions,
  getReachedBudgets,
  getTotalTransactionAmount,
  getTransactionCount,
  getUserBudgetData,
  getDailyExpensesSummary, // <--- Importez la nouvelle fonction
} from "@/action";
import { DailyExpense } from "@/action"; // <--- Importez l'interface DailyExpense
import Wrapper from "../components/Wrapper";
import {
  CircleDollarSignIcon,
  Landmark,
  ListIcon,
} from "lucide-react";
import { Budget, Transaction } from "@/type";
import DashboardCard from "../components/DashboardCard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import TransactionItem from "../components/TransactionItem";
import BudgetItem from "../components/BudgetItem";
import Link from "next/link";
import { formatCurrency } from '@/lib/utils'

interface AxisTickPayload {
  value: string | number;
  coordinate: number;
}

interface BudgetSummary {
  budgetName: string;
  totalBudgetAmount: number;
  totalTransactionsAmount: number;
}


const DashboardPage = () => {
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [reachedBudgetsRatio, setReachedBudgetsRatio] = useState<string | null>(
    null
  );

  const [budgetData, setBudgetData] = useState<BudgetSummary[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [dailyExpenses, setDailyExpenses] = useState<DailyExpense[]>([]); // <--- Nouvel état pour les dépenses journalières

  const renderCustomAxisTick = ({
    x,
    y,
    payload,
  }: {
    x: number;
    y: number;
    payload: AxisTickPayload;
  }) => {
    // Utiliser une valeur par défaut si payload.value est invalide
    const displayValue = payload.value && typeof payload.value === "string"
      ? payload.value.substring(0, 4)
      : ""; // Rendu vide au lieu de null

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
          {displayValue}
        </text>
      </g>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const email = "tlemcencrma20@gmail.com";
        const amount = await getTotalTransactionAmount(email);
        const count = await getTransactionCount(email);
        const reachedBudgets = await getReachedBudgets(email);
        const budgetsData = await getUserBudgetData(email);
        const lastTransactions = await getLastTransactions(email);
        const lastBudgets = await getLastBudgets(email);
        const dailySummary = await getDailyExpensesSummary(email); // <--- Appel de la nouvelle fonction

        setTotalAmount(amount);
        setTotalCount(count);
        setReachedBudgetsRatio(reachedBudgets);
        setBudgetData(budgetsData);
        setTransactions(lastTransactions);
        setBudgets(lastBudgets);
        setDailyExpenses(dailySummary); // <--- Mise à jour du nouvel état
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Wrapper>
      <div className="space-y-6 mb-2 flex flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Votre aperçu et vos perspectives financières.
          </p>
        </div>
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="flex justify-center items-center py-10">
              <span className="loading loading-spinner loading-lg text-accent"></span>
              <span className="ml-4 font-bold text-accent">Chargement...</span>
            </div>
          </div>
        ) : (
          <div>
            {/* section : Totaux */}
            <div className="grid md:grid-cols-3 gap-4">
              <DashboardCard
                label="Total des depenses"
                value={totalAmount !== null ? `${totalAmount} Da` : "N/A"}
                icon={<CircleDollarSignIcon />}
              />
              <DashboardCard
                label="Nombre de transactions"
                value={totalCount !== null ? `${totalCount}` : "N/A"}
                icon={<ListIcon />}
              />
              <DashboardCard
                label="Budgets atteints"
                value={reachedBudgetsRatio || "N/A"}
                icon={<Landmark />}
              />
            </div>
            {/* section : Graphe - Budgets - dreniere depenses - dep par journee*/}
            <div className="w-full md:flex mt-4">
              <div className="rounded-xl md:w-2/3">
                <div className="border-2 border-base-300 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold mb-3">
                    Statistiques ( en Da )
                  </h3>
                  <ResponsiveContainer height={250} width="100%">
                    <BarChart width={730} height={250} data={budgetData}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis
                        dataKey="budgetName"
                        tick={renderCustomAxisTick}
                        interval={0}
                      />
                      <Tooltip />
                      <Bar
                        name="Budget"
                        dataKey="totalBudgetAmount"
                        fill="#EF9FBC"
                        radius={[10, 10, 0, 0]}
                      />
                      <Bar
                        name="Dépensé"
                        dataKey="totalTransactionsAmount"
                        fill="#EEAF3A"
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 border-2 border-base-300 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold mb-3">
                    Derniers Transacttions
                  </h3>
                  <ul className="divide-y divide-base-300">
                    {transactions.map((transaction) => (
                      <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                      />
                    ))}
                  </ul>
                </div>
              </div>
              <div className="md:w-1/3 ml-4">
                <h3 className="text-lg font-semibold my-4 md:mb-4 md:mt-0">
                  Derniers Budgets
                </h3>
                <ul className="grid grid-cols-1 gap-4">
                  {budgets.map((budget) => (
                    <Link href={`/manage/${budget.id}`} key={budget.id}>
                      <BudgetItem budget={budget} enableHover={1} />
                    </Link>
                  ))}
                </ul>
                {/* Nouvelle section : Récap des dépenses par journée */}
                <div className="mt-8 border-2 border-base-300 p-5 rounded-xl">
                  {/* <div className="flex justify-center items-center py-2"> */}
                  <h3 className="text-lg font-bold mb-3 text-center">
                    Récapitulatif des Dépenses par Journée
                  </h3>
                 {/*  </div> */}
                  {dailyExpenses.length === 0 ? (
                    <p className="text-gray-500">Aucune dépense enregistrée par journée.</p>
                  ) : (
                    <ul className="divide-y divide-base-300">
                      {dailyExpenses.slice(0, 14).map((expense) => (
                        <li key={expense.date} className="flex justify-between items-center py-2">
                          <span className="font-medium text-accent">
                            {new Date(expense.date).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                          <span className="text-lg font-bold text-red-600">
                            -{formatCurrency(expense.totalAmount)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default DashboardPage;