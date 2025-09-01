import React from 'react';
import { cn } from '@/lib/utils';

interface FinancialCardProps {
  type: 'income' | 'expense';
  title: string;
  amount: string;
  currency?: string;
  className?: string;
}

export const FinancialCard: React.FC<FinancialCardProps> = ({
  type,
  title,
  amount,
  currency = 'DZD',
  className
}) => {
  const isIncome = type === 'income';
  
  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105',
      isIncome 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white',
      className
    )}>
      {/* Background decoration */}
      <div className="absolute top-4 right-4 opacity-20">
{/*         <div className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full',
          'bg-white/20 backdrop-blur-sm'
        )}>
          <span className="text-2xl font-bold text-white">
            {isIncome ? '+' : '-'}
          </span>
        </div> */}
      </div>
      
      {/* Main icon */}
      <div className={cn(
        'mb-4 flex h-10 w-10 items-center justify-center rounded-xl',
        'bg-white/20 backdrop-blur-sm'
      )}>
        <span className="text-2xl font-bold text-white">
          {isIncome ? '+' : '-'}
        </span>
        
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-lg font-medium text-white/90 mb-2">
          {title}
        </h3>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-white">
            {amount}
          </span>
          <span className="text-sm font-medium text-white/80">
            {currency}
          </span>
        </div>
      </div>
    </div>
  );
};