"use client";
import Wrapper from "../components/Wrapper";
import {
  CircleDollarSignIcon,
  Landmark,
  ListIcon,
} from "lucide-react";
import DashboardCard from "../components/DashboardCard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import TransactionItem from "../components/TransactionItem";
import BudgetItem from "../components/BudgetItem";
import Link from "next/link";
import { formatCurrency } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { useDashboardData } from '@/hooks/useDashboardData';
import { useExpenseStats } from '@/hooks/useExpenseStats';
import { useMonthlyAverages } from '@/hooks/useMonthlyAverages';

interface AxisTickPayload {
  value: string | number;
  coordinate: number;
}

/* interface BudgetSummary {
  budgetName: string;
  totalBudgetAmount: number;
  totalTransactionsAmount: number;
} */


const DashboardPage = () => {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  
  const { data, isLoading, error } = useDashboardData(email);
  const expenseStats = useExpenseStats(data?.dailyExpenses || []);
  const monthlyAverages = useMonthlyAverages(data?.dailyExpenses || []);
  
  // Calcul de la moyenne des moyennes mensuelles (en omettant les zéros)
  const nonZeroAverages = monthlyAverages.filter(item => item.average > 0);
  const overallAverage = nonZeroAverages.length > 0 
    ? nonZeroAverages.reduce((sum, item) => sum + item.average, 0) / nonZeroAverages.length 
    : 0;

  // Couleur adaptative pour le thème
  /* const labelColor = typeof window !== 'undefined' 
    ? getComputedStyle(document.documentElement).getPropertyValue('--bc') || '#374151'
    : '#374151'; */

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

  if (error) {
    return (
      <Wrapper>
        <div className="alert alert-error">{error}</div>
      </Wrapper>
    );
  }

  if (isLoading) {
    return (
      <Wrapper>
        <div className="flex justify-center items-center h-32">
          <div className="flex justify-center items-center py-10">
            <span className="loading loading-spinner loading-lg text-accent"></span>
            <span className="ml-4 font-bold text-accent">Chargement...</span>
          </div>
        </div>
      </Wrapper>
    );
  }

  if (!data) return null;

  const currentYear = new Date().getFullYear();

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
        {error && <div className="alert alert-error mb-4">{error}</div>}
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
                value={formatCurrency(data.totalAmount)}
                icon={<CircleDollarSignIcon />}
              />
              <DashboardCard
                label="Nombre de transactions"
                value={data.totalCount.toString()}
                icon={<ListIcon />}
              />
              <DashboardCard
                label="Budgets atteints"
                value={data.reachedBudgetsRatio}
                icon={<Landmark />}
              />
            </div>
            {/* section : Graphe - Budgets - dreniere depenses - dep par journee*/}
            <div className="w-full md:flex mt-4">
              <div className="rounded-xl md:w-2/3">
                <div className="grid md:grid-cols gap-4">
                  <div className="border-2 border-base-300 p-5 rounded-xl">
                    <h3 className="text-lg font-semibold mb-3">
                      Dépenses par Budget
                    </h3>
                    <ResponsiveContainer height={250} width="100%">
                      <BarChart width={730} height={250} data={data.budgetData}>
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

                </div>
                <div className="mt-4 border-2 border-base-300 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold mb-3">
                    Évolution des Moyennes Mensuelles ({currentYear})
                  </h3>
                  <ResponsiveContainer height={200} width="100%">
                    <LineChart data={monthlyAverages}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => [formatCurrency(value), 'Moyenne']} />
                      <Line 
                        type="monotone" 
                        dataKey="average" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        dot={{ fill: '#10B981' }}
                      />
                      <ReferenceLine 
                        y={overallAverage} 
                        stroke="#EF4444" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        label={{ 
                          value: `Moyenne: ${formatCurrency(overallAverage)}`, 
                          /* position: 'topRight', */
                          style: { fill: '#F59E0B', fontWeight: 'bold' }
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 border-2 border-base-300 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold mb-3">
                    Dernieres Depenses
                  </h3>
                  <ul className="divide-y divide-base-300">
                    {data.transactions.map((transaction) => (
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
                  Derniers Budgets Crees
                </h3>
                <ul className="grid grid-cols-1 gap-4">
                  {data.budgets.map((budget) => (
                    <Link href={`/manage/${budget.id}`} key={budget.id}>
                      <BudgetItem budget={budget} enableHover={1} />
                    </Link>
                  ))}
                </ul>
                {/* Nouvelle section : Récap des dépenses par journée */}
                <div className="mt-8 border-2 border-base-300 p-5 rounded-xl">
                  {/* <div className="flex justify-center items-center py-2"> */}
                  <h3 className="text-lg font-bold mb-3 text-center">
                    Récapitulatif des Dépenses par Journée (30 Derniers jours)
                  </h3>
                 {/*  </div> */}
                  {data.dailyExpenses.length === 0 ? (
                    <p className="text-gray-500">Aucune dépense enregistrée par journée.</p>
                  ) : (
                    <ul className="divide-y divide-base-300">
                      
{/*                  {dailyExpenses.slice(0, 15).map((expense) => (
                        <li key={expense.date} className="flex justify-between items-center py-2">
                          <span className="font-bold text-accent">
                            {new Date(expense.date).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                          <span className="text-lg font-bold">
                            -{formatCurrency(expense.totalAmount)}
                          </span>
                        </li>       
                      ))} */}
                          {expenseStats.expensesSlice.map((expense) => (
                            <li key={expense.date} className="flex justify-between items-center py-2">
                              <span className="font-bold text-accent">
                                {new Date(expense.date).toLocaleDateString('fr-FR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                              <span className="text-lg font-bold">
                                -{formatCurrency(expense.totalAmount)}
                              </span>
                            </li>
                          ))}

                        {/* Ajout de la moyenne des dépenses par jour */}

{/*                     {dailyExpenses.length > 0 && (
                          <li className="flex justify-between items-center py-2 font-bold text-info">
                            <span>Moyenne dépensée:</span>
                            <span className="text-lg">
                              {formatCurrency(
                                dailyExpenses
                                  .slice(0, 15)
                                  .reduce((sum, expense) => sum + expense.totalAmount, 0) / 15
                              )}
                            </span>
                          </li>
                        )} */}

{/*                           <li className="flex justify-between items-center py-2 font-bold text-info">
                            <span>Moyenne dépensée:</span>
                            <span className="text-lg">{formatCurrency(average)}</span>
                          </li> */}


                      </ul>
                      
                    )}
                    <div className="border-2 border-base-300 p-5 rounded-xl">
                    <h3 className="text-lg font-semibold mb-3">
                      Moyenne des Dépenses 
                    </h3>
                    <div className="flex items-center justify-center ">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-accent mb-2">
                          {formatCurrency(expenseStats.average)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Moyenne mensuelle
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Basée sur {expenseStats.daysToShow} derniers jours
                        </div>
                      </div>
                    </div>
                  </div>
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