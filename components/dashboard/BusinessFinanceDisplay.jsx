/* components/dashboard/BusinessFinanceDisplay.jsx */

import { Building } from 'lucide-react';
import { useFinanceContext } from '../../context/FinanceContext';

export default function BusinessFinanceDisplay() {
  const { stats, transactions } = useFinanceContext();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Building className="w-5 h-5 mr-2" />
          Business Finance Overview
        </h3>
        <p className="text-blue-100 text-sm mt-1">Calculated from your business transactions</p>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <span className="text-sm font-medium text-green-700">Total Revenue</span>
          <span className="text-lg font-bold text-green-900">
            {formatCurrency(stats.businessStats.totalRevenue)}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
          <span className="text-sm font-medium text-red-700">Total Expenses</span>
          <span className="text-lg font-bold text-red-900">
            {formatCurrency(stats.businessStats.totalExpenses)}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-blue-700">Net Income</span>
          <span className={`text-lg font-bold ${
            stats.businessStats.netIncome >= 0 ? 'text-green-900' : 'text-red-900'
          }`}>
            {formatCurrency(stats.businessStats.netIncome)}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
          <span className="text-sm font-medium text-purple-700">Monthly Recurring</span>
          <span className={`text-lg font-bold ${
            stats.businessStats.monthlyRecurring >= 0 ? 'text-green-900' : 'text-red-900'
          }`}>
            {formatCurrency(stats.businessStats.monthlyRecurring)}
          </span>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          Based on {transactions.filter(t => t.category === 'business' || t.category === 'investment' || t.category === 'marketing' || t.category === 'equipment' || t.category === 'utilities' || t.category === 'rent').length} business transactions
        </div>
      </div>
    </div>
  );
}
