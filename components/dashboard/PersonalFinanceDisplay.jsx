/* components/dashboard/PersonalFinanceDisplay.jsx */

import { Wallet } from 'lucide-react';
import { useFinanceContext } from '../../context/FinanceContext';

export default function PersonalFinanceDisplay() {
  const { stats, transactions } = useFinanceContext();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Wallet className="w-5 h-5 mr-2" />
          Personal Finance Overview
        </h3>
        <p className="text-green-100 text-sm mt-1">Calculated from your personal transactions</p>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <span className="text-sm font-medium text-green-700">Total Income</span>
          <span className="text-lg font-bold text-green-900">
            {formatCurrency(stats.personalStats.totalIncome)}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
          <span className="text-sm font-medium text-red-700">Total Expenses</span>
          <span className="text-lg font-bold text-red-900">
            {formatCurrency(stats.personalStats.totalExpenses)}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-blue-700">Net Income</span>
          <span className={`text-lg font-bold ${
            stats.personalStats.netIncome >= 0 ? 'text-green-900' : 'text-red-900'
          }`}>
            {formatCurrency(stats.personalStats.netIncome)}
          </span>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          Based on {transactions.filter(t => t.category === 'personal' || t.category === 'healthcare' || t.category === 'food' || t.category === 'transport').length} personal transactions
        </div>
      </div>
    </div>
  );
}
