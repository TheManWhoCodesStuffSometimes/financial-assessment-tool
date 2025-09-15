/* components/dashboard/TransactionList.jsx */

import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Target, Repeat, Calendar, Filter, Trash2, RefreshCw } from 'lucide-react';
import { useFinanceContext } from '../../context/FinanceContext';

export default function TransactionList() {
  const { transactions, deleteTransaction } = useFinanceContext();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const filteredTransactions = transactions
    .filter(transaction => {
      if (filter === 'all') return true;
      if (filter === 'revenue') return transaction.type === 'revenue';
      if (filter === 'expense') return transaction.type === 'expense';
      if (filter === 'recurring') return transaction.isRecurring;
      if (filter === 'one-time') return !transaction.isRecurring;
      if (filter === 'confirmed') return transaction.likelihood === 'confirmed';
      if (filter === 'high') return transaction.likelihood === 'high';
      if (filter === 'medium') return transaction.likelihood === 'medium';
      if (filter === 'low') return transaction.likelihood === 'low';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.scheduledDate) - new Date(a.scheduledDate);
      }
      if (sortBy === 'amount') {
        return Math.abs(b.amount) - Math.abs(a.amount);
      }
      if (sortBy === 'description') {
        return a.description.localeCompare(b.description);
      }
      if (sortBy === 'likelihood') {
        const order = { confirmed: 4, high: 3, medium: 2, low: 1 };
        return (order[b.likelihood] || 0) - (order[a.likelihood] || 0);
      }
      return 0;
    });

  const getTotalByType = (type) => {
    return transactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getRecurringTotal = () => {
    return transactions
      .filter(t => t.isRecurring)
      .reduce((sum, t) => sum + (t.type === 'revenue' ? t.amount : -t.amount), 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      business: '🏢',
      personal: '👤',
      investment: '📈',
      utilities: '⚡',
      marketing: '📢',
      equipment: '🔧',
      rent: '🏠',
      food: '🍔',
      transport: '🚗',
      healthcare: '🏥'
    };
    return icons[category] || '📄';
  };

  const getLikelihoodIcon = (likelihood) => {
    const icons = {
      confirmed: '✅',
      high: '🟦',
      medium: '🟨',
      low: '🟥'
    };
    return icons[likelihood] || '⚪';
  };

  const handleDeleteTransaction = async (id) => {
    setDeletingId(id);
    try {
      await deleteTransaction(id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Transaction History
            </h3>
            <p className="text-green-100 text-sm mt-1">
              {transactions.length} transactions • Net: {formatCurrency(getTotalByType('revenue') - getTotalByType('expense'))}
              {getRecurringTotal() !== 0 && (
                <span className="ml-2">• Monthly Recurring: {formatCurrency(getRecurringTotal())}</span>
              )}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 bg-white/20 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 text-sm"
            >
              <option value="all" className="text-gray-900">All Types</option>
              <option value="revenue" className="text-gray-900">Revenue Only</option>
              <option value="expense" className="text-gray-900">Expenses Only</option>
              <option value="recurring" className="text-gray-900">Recurring</option>
              <option value="one-time" className="text-gray-900">One-time</option>
              <option value="confirmed" className="text-gray-900">✅ Confirmed</option>
              <option value="high" className="text-gray-900">🟦 High Likelihood</option>
              <option value="medium" className="text-gray-900">🟨 Medium Likelihood</option>
              <option value="low" className="text-gray-900">🟥 Low Likelihood</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 text-sm"
            >
              <option value="date" className="text-gray-900">Sort by Date</option>
              <option value="amount" className="text-gray-900">Sort by Amount</option>
              <option value="description" className="text-gray-900">Sort by Name</option>
              <option value="likelihood" className="text-gray-900">Sort by Likelihood</option>
            </select>

            <div className="text-xs text-white/80 flex items-center">
              Showing {filteredTransactions.length} of {transactions.length}
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Revenue</p>
                <p className="text-xl font-bold text-green-900">
                  {formatCurrency(getTotalByType('revenue'))}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Total Expenses</p>
                <p className="text-xl font-bold text-red-900">
                  {formatCurrency(getTotalByType('expense'))}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Net Income</p>
                <p className={`text-xl font-bold ${getTotalByType('revenue') - getTotalByType('expense') >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                  {formatCurrency(getTotalByType('revenue') - getTotalByType('expense'))}
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Recurring</p>
                <p className={`text-xl font-bold ${getRecurringTotal() >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                  {formatCurrency(getRecurringTotal())}
                </p>
                <p className="text-xs text-purple-600">per month</p>
              </div>
              <Repeat className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No transactions found</p>
              <p className="text-gray-400 text-sm">
                {transactions.length === 0 
                  ? "Add your first transaction to get started" 
                  : "Try adjusting your filters"}
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'revenue' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type === 'revenue' ? '💰' : '💸'} {transaction.type}
                      </span>
                      
                      {transaction.isRecurring && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Repeat className="w-3 h-3 mr-1" />
                          {transaction.frequency}
                        </span>
                      )}
                      
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {getCategoryIcon(transaction.category)} {transaction.category}
                      </span>

                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.likelihood === 'confirmed' ? 'bg-green-100 text-green-800' :
                        transaction.likelihood === 'high' ? 'bg-blue-100 text-blue-800' :
                        transaction.likelihood === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {getLikelihoodIcon(transaction.likelihood)} {transaction.likelihood}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-1">{transaction.description}</h4>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(transaction.scheduledDate).toLocaleDateString()}
                      {transaction.isRecurring && transaction.endDate && (
                        <span className="ml-2 text-gray-500">
                          ends {new Date(transaction.endDate).toLocaleDateString()}
                        </span>
                      )}
                      {transaction.isRecurring && !transaction.endDate && (
                        <span className="ml-2 text-blue-600 text-xs">ongoing</span>
                      )}
                    </p>
                  </div>
                  
                  <div className="text-right flex items-center space-x-3">
                    <div>
                      <div className={`text-xl font-bold ${transaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'expense' ? '-' : '+'}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </div>
                      {transaction.isRecurring && (
                        <div className="text-xs text-gray-500">
                          per {transaction.frequency.replace('bi-', '').replace('ly', '')}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      disabled={deletingId === transaction.id}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete transaction"
                    >
                      {deletingId === transaction.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
