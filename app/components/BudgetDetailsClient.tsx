"use client";

import { useState, useEffect, useMemo } from 'react';
import Wrapper from "@/app/components/Wrapper";
import { ArrowLeft, Send, Search, Calculator as CalculatorIcon } from "lucide-react";
import { Budget, Transaction } from "@/type";
import BudgetItemPrct from "@/app/components/BudgetItemPrct";
import { formatCurrency } from '@/lib/utils';
import ClientLink from "@/app/components/ClientLink";
import Calculator from "./Calculator";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
/* import Link from 'next/link'; */

// Définissez les mois ici pour la sélection
const months = [
  { value: '01', label: 'Janvier' },
  { value: '02', label: 'Février' },
  { value: '03', label: 'Mars' },
  { value: '04', label: 'Avril' },
  { value: '05', label: 'Mai' },
  { value: '06', label: 'Juin' },
  { value: '07', label: 'Juillet' },
  { value: '08', label: 'Août' },
  { value: '09', label: 'Septembre' },
  { value: '10', label: 'Octobre' },
  { value: '11', label: 'Novembre' },
  { value: '12', label: 'Décembre' },
];

interface BudgetDetailsClientProps {
  budget: Budget;
  initialTransactions: Transaction[];
}

export default function BudgetDetailsClient({ budget, initialTransactions }: BudgetDetailsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPeriod, setCurrentPeriod] = useState("all");
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  // Filtrage côté client avec setCurrentPeriod → changement d'état local
  const [filteredTransactions, setFilteredTransactions] = useState(initialTransactions);

    // Fonction de filtrage
    const filterTransactions = (period: string, query: string) => {
        let filtered = initialTransactions;
        // Filtrer par mois
        if (period !== 'all') {
            filtered = filtered.filter(transaction => {
                const transactionMonth = new Date(transaction.createdAt).getMonth() + 1;
                return transactionMonth === parseInt(period);
            });
        }
        // Filtrer par recherche
        if (query) {
            filtered = filtered.filter(transaction =>
                transaction.description.toLowerCase().includes(query.toLowerCase()) ||
                (budget.name && budget.name.toLowerCase().includes(query.toLowerCase()))
            );
        }
        // Trier par date la plus récente
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setFilteredTransactions(filtered);
    };

    // Mettre à jour les transactions filtrées lorsque la recherche ou la période changent
    useEffect(() => {
        filterTransactions(currentPeriod, searchQuery);
    }, [searchQuery, currentPeriod, initialTransactions, filterTransactions]);

    // Logique pour consolider les dépenses (fonctionne sur les transactions filtrées)
    const consolidatedExpensesSummary = useMemo(() => {
        const consolidatedExpenses: { [key: string]: number } = {};
        let totalExpenses = 0;
        
        filteredTransactions.forEach((transaction: Transaction) => {
            if (transaction.type !== "income") {
                const key = transaction.description.trim().split(' ')[0].substring(0, 5).toLowerCase();
                consolidatedExpenses[key] = (consolidatedExpenses[key] || 0) + transaction.amount;
                totalExpenses += transaction.amount;
            }
        });
        
        return Object.keys(consolidatedExpenses).map(key => ({
            description: key.charAt(0).toUpperCase() + key.slice(1),
            totalAmount: consolidatedExpenses[key],
            percentage: totalExpenses > 0 ? Math.round((consolidatedExpenses[key] / totalExpenses) * 100) : 0
        }));
    }, [filteredTransactions]);

    // Ajoutez ce useMemo avec les autres hooks en haut du composant
    const sum = useMemo(() => {
        return filteredTransactions.reduce((acc, t) => {
            return t.type === 'income' ? acc + t.amount : acc - t.amount;
        }, 0);
    }, [filteredTransactions]);

    // Calcul des dépenses par mois pour le graphique
    const monthlyExpenses = useMemo(() => {
        const expensesByMonth: { [key: string]: number } = {};
        const currentYear = new Date().getFullYear();
        
        // Initialiser tous les mois de l'année courante à 0
        for (let i = 0; i < 12; i++) {
            const monthKey = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
            expensesByMonth[monthKey] = 0;
        }
        
        initialTransactions.forEach((transaction: Transaction) => {
            if (transaction.type !== "income") {
                const date = new Date(transaction.createdAt);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                
                if (expensesByMonth[monthKey] !== undefined) {
                    expensesByMonth[monthKey] += transaction.amount;
                }
            }
        });
        
        return Object.entries(expensesByMonth)
            .map(([key, amount]) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const [year, month] = key.split('-');
                const monthIndex = parseInt(month) - 1;
                return {
                    month: months[monthIndex]?.label || 'Inconnu',
                    amount: amount,
                    key: key
                };
            })
            .sort((a, b) => a.key.localeCompare(b.key))
            .filter(item => item.amount > 0); // Afficher seulement les mois avec des dépenses
    }, [initialTransactions]);

    // Calcul des dépenses filtrées par mois pour le nouveau graphique
    const filteredMonthlyExpenses = useMemo(() => {
        const expensesByMonth: { [key: string]: number } = {};
        const currentYear = new Date().getFullYear();
        
        // Initialiser tous les mois de l'année courante à 0
        for (let i = 0; i < 12; i++) {
            const monthKey = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
            expensesByMonth[monthKey] = 0;
        }
        
        filteredTransactions.forEach((transaction: Transaction) => {
            if (transaction.type !== "income") {
                const date = new Date(transaction.createdAt);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                
                if (expensesByMonth[monthKey] !== undefined) {
                    expensesByMonth[monthKey] += transaction.amount;
                }
            }
        });
        
        return Object.entries(expensesByMonth)
            .map(([key, amount]) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const [year, month] = key.split('-');
                const monthIndex = parseInt(month) - 1;
                return {
                    month: months[monthIndex]?.label || 'Inconnu',
                    amount: amount,
                    key: key
                };
            })
            .sort((a, b) => a.key.localeCompare(b.key))
            .filter(item => item.amount > 0); // Afficher seulement les mois avec des dépenses
    }, [filteredTransactions]);

    // Calcul des dépenses par nature et par mois (6 derniers mois)
    const expensesByNatureAndMonth = useMemo(() => {
        const currentDate = new Date();
        const sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);
        
        // Grouper par nature et mois
        const data: { [nature: string]: { [month: string]: number } } = {};
        
        initialTransactions.forEach((transaction: Transaction) => {
            if (transaction.type !== "income") {
                const transactionDate = new Date(transaction.createdAt);
                
                // Filtrer les 6 derniers mois
                if (transactionDate >= sixMonthsAgo) {
                    const nature = transaction.description.trim().split(' ')[0].substring(0, 5).toLowerCase();
                    const monthLabel = months[transactionDate.getMonth()]?.label || 'Inconnu';
                    
                    if (!data[nature]) {
                        data[nature] = {};
                    }
                    
                    if (!data[nature][monthLabel]) {
                        data[nature][monthLabel] = 0;
                    }
                    
                    data[nature][monthLabel] += transaction.amount;
                }
            }
        });
        
        // Créer la liste des 6 derniers mois
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            last6Months.push(months[date.getMonth()]?.label || 'Inconnu');
        }
        
        // Transformer en format pour le graphique
        return last6Months.map(month => {
            const monthData: { [key: string]: number | string } = { month };
            Object.keys(data).forEach(nature => {
                monthData[nature] = data[nature][month] || 0;
            });
            return monthData;
        }).filter(item => {
            // Garder seulement les mois qui ont au moins une dépense
            return Object.keys(item).some(key => key !== 'month' && typeof item[key] === 'number' && item[key] > 0);
        });
    }, [initialTransactions]);

    // Extraire les natures uniques pour les couleurs
    const uniqueNatures = useMemo(() => {
        const natures = new Set<string>();
        expensesByNatureAndMonth.forEach(monthData => {
            Object.keys(monthData).forEach(key => {
                if (key !== 'month') {
                    natures.add(key);
                }
            });
        });
        return Array.from(natures);
    }, [expensesByNatureAndMonth]);

    // Couleurs pour les différentes natures
    const natureColors = ['#EF4444', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'];

    // Calcul des dépenses par semaine pour le mois sélectionné
    const weeklyExpenses = useMemo(() => {
        if (currentPeriod === 'all') return [];
        
        const selectedMonth = parseInt(currentPeriod);
        const currentYear = new Date().getFullYear();
        const expensesByWeek: { [key: string]: number } = {};
        
        filteredTransactions.forEach((transaction: Transaction) => {
            if (transaction.type !== "income") {
                const date = new Date(transaction.createdAt);
                const transactionMonth = date.getMonth() + 1;
                
                if (transactionMonth === selectedMonth) {
                    // Calculer le numéro de semaine dans le mois
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const firstDayOfMonth = new Date(currentYear, selectedMonth - 1, 1);
                    const dayOfMonth = date.getDate();
                    const weekNumber = Math.ceil(dayOfMonth / 7);
                    const weekKey = `Semaine ${weekNumber}`;
                    
                    if (!expensesByWeek[weekKey]) {
                        expensesByWeek[weekKey] = 0;
                    }
                    expensesByWeek[weekKey] += transaction.amount;
                }
            }
        });
        
        return Object.entries(expensesByWeek)
            .map(([week, amount]) => ({
                week,
                amount
            }))
            .sort((a, b) => {
                const weekA = parseInt(a.week.split(' ')[1]);
                const weekB = parseInt(b.week.split(' ')[1]);
                return weekA - weekB;
            });
    }, [filteredTransactions, currentPeriod]);


  // Le label du dashboard card
/*   const filterLabel = useMemo(() => {
    if (currentPeriod === 'all') {
      return 'Toutes les transactions';
    }
    const selectedMonth = months.find(m => m.value === currentPeriod)?.label;
    return `Transactions de ${selectedMonth}`;
  }, [currentPeriod]); */

   return (
    <Wrapper>
      <div className="mb-6">
    
        <div className="flex gap-2 mb-4">
          <ClientLink href="/">
            <div className="btn btn-ghost">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour
            </div>
          </ClientLink>
          <ClientLink href={`/manage/${budget.id}`}>
            <div 
               className="btn btn-outline btn-accent flex items-center gap-2 bg-base-600 hover:bg-base-700 px-6 py-3 rounded-lg transition-all duration-200 font-medium whitespace-nowrap shadow-sm hover:shadow-md transform hover:-translate-y-0.5" 
              >
              Saisie
            </div>
          </ClientLink>
        </div>
        {budget && (
          <div className='flex md:flex-row flex-col'>
            <div className='md:w-1/3'>
              <BudgetItemPrct budget={budget} enableHover={0} depenseColor='text-red-500 font-bold' />

              {/* Section pour le résumé des dépenses consolidées */}
              {consolidatedExpensesSummary.length > 0 && (
                <div className="md:mt-8 mt-4 mx-2">
                  <div className="mt-8 border-2 border-base-300 p-5 rounded-xl">
                    <h2 className="text-xl text-accent font-bold mb-2 text-center">Synthèse des dépenses par nature</h2>
                    <ul className="space-y-2">
                      {consolidatedExpensesSummary.map((item, index) => {
                        const colorIndex = uniqueNatures.findIndex(nature => nature === item.description.toLowerCase());
                        const color = colorIndex !== -1 ? natureColors[colorIndex % natureColors.length] : '#6B7280';
                        return (
                          <li key={index} className="p-2 bg-base-200 rounded-lg shadow flex justify-between items-center">
                            <div className="flex items-center">
                              <div 
                                className="w-4 h-4 rounded-full mr-3" 
                                style={{ backgroundColor: color }}
                              ></div>
                              <span className="font-medium text-base-800">{item.description} ({item.percentage}%)</span>
                            </div>
                            <span className="text-sky-600 font-bold">{formatCurrency(item.totalAmount)}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </div>          
            <div className="md:w-2/3 ">
            {/* Graphique des dépenses par mois */}
            {monthlyExpenses.length > 0 && (
              <div className="card w-full bg-base-150 card-md shadow-md rounded-xl border-2 border-gray-300 mb-4 mx-2">
                <div className="card-body">
                  <h2 className="card-title text-xl font-bold text-center">Dépenses par mois</h2>
                  <ResponsiveContainer height={200} width="100%">
                    <BarChart data={monthlyExpenses}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        interval={0}
                      />
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), 'Dépenses']}
                        labelStyle={{ color: '#333' }}
                      />
                      <Bar
                        dataKey="amount"
                        fill="#EF4444"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            
            {/* Graphique des dépenses par nature et par mois */}
            {expensesByNatureAndMonth.length > 0 && uniqueNatures.length > 0 && (
              <div className="card w-full bg-base-150 card-md shadow-md rounded-xl border-2 border-gray-300 mb-4 mx-2">
                <div className="card-body">
                  <h2 className="card-title text-xl font-bold text-center">Dépenses par Nature (6 derniers mois)</h2>
                  <ResponsiveContainer height={250} width="100%">
                    <LineChart data={expensesByNatureAndMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        interval={0}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number, name: string) => [formatCurrency(value), name]}
                        labelStyle={{ color: '#333' }}
                      />
                      {uniqueNatures.map((nature, index) => (
                        <Line
                          key={nature}
                          type="monotone"
                          dataKey={nature}
                          stroke={natureColors[index % natureColors.length]}
                          strokeWidth={2}
                          dot={{ fill: natureColors[index % natureColors.length], r: 4 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            
            {/* Graphique des dépenses filtrées par mois */}
            {filteredMonthlyExpenses.length > 0 && (currentPeriod !== 'all' || searchQuery) && (
              <div className="card w-full bg-base-150 card-md shadow-md rounded-xl border-2 border-gray-300 mb-4 mx-2">
                <div className="card-body">
                  <h2 className="card-title text-xl font-bold text-center">Dépenses filtrées par mois</h2>
                  <ResponsiveContainer height={200} width="100%">
                    <BarChart data={filteredMonthlyExpenses}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        interval={0}
                      />
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), 'Dépenses filtrées']}
                        labelStyle={{ color: '#333' }}
                      />
                      <Bar
                        dataKey="amount"
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            
            {/* Graphique des dépenses par semaine (seulement si un mois est sélectionné) */}
            {weeklyExpenses.length > 0 && currentPeriod !== 'all' && (
              <div className="card w-full bg-base-150 card-md shadow-md rounded-xl border-2 border-gray-300 mb-4 mx-2">
                <div className="card-body">
                  <h2 className="card-title text-xl font-bold text-center">
                    Dépenses par semaine - {months.find(m => m.value === currentPeriod)?.label}
                  </h2>
                  <ResponsiveContainer height={180} width="100%">
                    <BarChart data={weeklyExpenses}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="week" 
                        tick={{ fontSize: 12 }}
                        interval={0}
                      />
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), 'Dépenses']}
                        labelStyle={{ color: '#333' }}
                      />
                      <Bar
                        dataKey="amount"
                        fill="#F59E0B"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            
            {/* Version search */}
              <div className="card w-full bg-base-150 card-md shadow-md rounded-xl border-2 border-gray-300 mb-4 mx-2">
                <div className="card-body">
                  <h2 className="card-title text-xl font-bold">Recherche & Filtre</h2>
                  <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
                    <div className="input relative w-full md:flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="search"
                        value={searchQuery}
                        placeholder="Rechercher par description..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='pl-6'
                      />
                    </div>
                    <div className='w-full md:w-auto'>
                      <select
                        className='select w-full select-bordered text-accent-300'
                        value={currentPeriod}
                        onChange={(e) => setCurrentPeriod(e.target.value)}
                      >
                        <option value="all">Toutes les transactions</option>
                        {months.map(month => (
                          <option key={month.value} value={month.value}>{month.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="justify-center card-actions">
 {/*                    <div>
                      <DashboardCard
                        label={filterLabel}
                        value=""
                        icon={<Calculator className="text-blue-500 w-8 h-8" />}
                      />
                    </div> */}
                    <div className="justify-center card-actions">
                        <div 
                          onClick={() => {
                            console.log('Calculator icon clicked'); // Debug
                            setCalculatorOpen(true);
                          }}
                          style={{ cursor: 'pointer', pointerEvents: 'auto', zIndex: 10 }}
                          className="inline-block p-2 rounded hover:bg-gray-100"
                        >
                          <CalculatorIcon className="text-blue-500 w-8 h-8 hover:text-blue-700 transition-colors" />
                        </div>
                        <div className="bg-base-200 p-4 rounded-lg w-full">
                            <div className="grid md:grid-cols-2 font-bold text-accent gap-4">
                                <div className="text-center">
                                    <span className="text-blue-600 font-semibold block">
                                        Transactions filtrées
                                    </span>
                                    <span className="text-lg">
                                        {filteredTransactions.length}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <span className="text-blue-600 font-semibold block">
                                        Solde total
                                    </span>
                                    <span className={sum >= 0 ? "text-green-600 text-lg" : "text-red-600 text-lg"}>
                                        {formatCurrency(sum)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                  </div>
                </div>
              </div>
            {/* Section des transactions */}
            {filteredTransactions.length > 0 ? (
              <div className="md:mt-0 mt-4  mx-2">
                
                <h2 className="bg-base-200 rounded-lg shadow text-xl text-base-900 font-bold mb-4 text-center">Transactions</h2>
                <div className="overflow-x-auto space-y-4 flex flex-col">
                  <ul className="space-y-4">
                    {filteredTransactions.map((transaction: Transaction) => (
                      <li
                        key={transaction.id}
                        className="p-4 bg-base-200 rounded-lg shadow flex justify-between items-center"
                      >
                        <div>
                          <span className="text-lg">{transaction.emoji || "💸"}</span>{" "}
                          <span className="font-medium">{transaction.description}</span>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.createdAt).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <span
                          className={transaction.type === "income" ? "text-green-500" : "text-sky-600"}
                        >
                          {formatCurrency(transaction.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className='md:w-2/3 mt-10 md:ml-4 flex items-center justify-center'>
                <Send strokeWidth={1.5} className='w-8 h-8 text-accent' />
                <span className='text-gray-500 tracking-tight ml-2'>Aucune transaction trouvee.</span>
              </div>
            )}
            </div>
          </div>
        )}
      </div>
      <Calculator 
        isOpen={calculatorOpen} 
        onClose={() => setCalculatorOpen(false)} 
      />
    </Wrapper>
  );
}

// Composant pour la carte d'indicateur (créé pour éviter l'erreur de "JSX element type 'DashboardCard' does not have any construct or call signatures")
/* const DashboardCard = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center p-4">
    <div className="bg-base-300 rounded-full p-2">{icon}</div>
    <div className="mt-2 text-center">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
); */
