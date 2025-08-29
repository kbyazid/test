"use client";

import { useState, useMemo } from 'react';
import { Transaction } from '@/type';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filtrer les transactions selon les dates
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.createdAt);
    
    if (startDate) {
      const start = new Date(startDate);
      if (transactionDate < start) return false;
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Inclure toute la journée de fin
      if (transactionDate > end) return false;
    }
    
    return true;
  });

  // Calculer les données du graphique par jour
  const chartData = useMemo(() => {
    if (!startDate && !endDate) return [];
    
    const dailyData: { [key: string]: { date: string, recettes: number, depenses: number } } = {};
    
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.createdAt).toISOString().split('T')[0];
      
      if (!dailyData[date]) {
        dailyData[date] = { date, recettes: 0, depenses: 0 };
      }
      
      if (transaction.type === 'income') {
        dailyData[date].recettes += transaction.amount;
      } else {
        dailyData[date].depenses += transaction.amount;
      }
    });
    
    return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredTransactions, startDate, endDate]);

  const showChart = (startDate || endDate) && chartData.length > 0;

  return (
    <>
      {/* Filtre par dates */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Date de début</label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="jj/mm/aaaa"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Date de fin</label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="jj/mm/aaaa"
          />
        </div>
      </div>

      {/* Graphiques des recettes et dépenses par jour */}
      {showChart && (
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Graphique des recettes */}
          <div className="card bg-base-100 shadow-md rounded-xl border">
            <div className="card-body">
              <h2 className="card-title text-lg font-bold text-center text-green-600">Recettes par jour</h2>
              <ResponsiveContainer height={250} width="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `${value}€`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Recettes']}
                    labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
                  />
                  <Line
                    type="monotone"
                    dataKey="recettes"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Graphique des dépenses */}
          <div className="card bg-base-100 shadow-md rounded-xl border">
            <div className="card-body">
              <h2 className="card-title text-lg font-bold text-center text-red-600">Dépenses par jour</h2>
              <ResponsiveContainer height={250} width="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `${value}€`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Dépenses']}
                    labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
                  />
                  <Line
                    type="monotone"
                    dataKey="depenses"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Table des transactions */}
      <div className="md:mt-0 mt-4 mx-auto max-w-full">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th></th>
                <th className="hidden md:table-cell">Date</th>
                <th className="md:hidden text-left px-2 py-3">Détails</th>
                <th className="hidden md:table-cell">Description</th>
                <th className="hidden md:table-cell">Budget / Type</th>
                <th className="text-right">Montant</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    Aucune transaction trouvée pour cette période.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

const TransactionRow = ({
  transaction
}: {
  transaction: Transaction,
}) => {
  const isIncome = transaction.type === "income";
  const amountClass = isIncome ? "text-green-600" : "text-sky-400";
  const amountSign = isIncome ? '+' : '-';
  const formattedAmount = formatCurrency(Math.abs(transaction.amount));

  return (
    <tr className="hover">
      <td className='text-lg md:text-3xl p-2 md:p-4'>{transaction.emoji || '💸'}</td>

      <td className='hidden md:table-cell p-2 md:p-4'>
        <div className='flex flex-col'>
          <span className='text-sm font-medium'>
            {formatDate(transaction.createdAt, { withTime: false })}
          </span>
          <span className='text-xs text-gray-500'>
            {formatDate(transaction.createdAt, { withTime: true })}
          </span>
        </div>
      </td>

      <td className="md:hidden px-2 py-3">
        <div className='flex flex-col items-start'>
          <span className='text-xs text-gray-500 mb-1'>
            {formatDate(transaction.createdAt, { withTime: true })}
          </span>
          <span className='font-bold text-sm mb-1'>{transaction.description}</span>
          {transaction.budgetName && (
            <span className="badge badge-outline badge-info text-xs mb-1">
              {transaction.budgetName}
            </span>
          )}
          <span className={`badge badge-outline ${
            isIncome ? 'badge-success' : 'badge-error'
          } text-xs mb-1`}>
            {isIncome ? 'Recette' : 'Dépense'}
          </span>
        </div>
      </td>

      <td className='hidden md:table-cell p-2 md:p-4'>
        {transaction.description}
      </td>

      <td className='hidden md:table-cell p-2 md:p-4'>
        {transaction.budgetName && (
          <span className="badge badge-soft badge-info inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mb-1">
            {transaction.budgetName}
          </span>
        )}
        <span className={`badge badge-soft ${
          isIncome ? 'badge-success' : 'badge-error'
        } inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium`}>
          {isIncome ? 'Recette' : 'Dépense'}
        </span>
      </td>

      <td className={`text-right p-2 md:p-4 font-semibold ${amountClass}`}>
        {amountSign}{formattedAmount}
      </td>
    </tr>
  );
};