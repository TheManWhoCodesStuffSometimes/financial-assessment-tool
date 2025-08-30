import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Target, Zap, Plus, Filter, ChevronDown, Repeat, Clock, Trash2, RefreshCw, Wallet, Building, CreditCard } from 'lucide-react';
import { useFinanceContext } from '../context/FinanceContext';

const StatsCard = ({ title, value, change, positive, icon: Icon, gradient }) => (
  <div className={`relative overflow-hidden rounded-2xl ${gradient} p-6 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${positive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{change}</span>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium opacity-90">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
    <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/5 rounded-full"></div>
  </div>
);

const PersonalFinanceDisplay = () => {
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
};

const BusinessFinanceDisplay = () => {
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
};

const EnhancedTransactionForm = () => {
  const { addTransaction } = useFinanceContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transaction, setTransaction] = useState({
    type: 'revenue',
    amount: '',
    description: '',
    category: 'business',
    isRecurring: false,
    frequency: 'monthly',
    scheduledDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addTransaction(transaction);
      setTransaction({ 
        type: 'revenue', 
        amount: '', 
        description: '', 
        category: 'business',
        isRecurring: false,
        frequency: 'monthly',
        scheduledDate: new Date().toISOString().split('T')[0],
        endDate: ''
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const frequencies = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi-weekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const categories = [
    { value: 'business', label: '🏢 Business', icon: '🏢' },
    { value: 'personal', label: '👤 Personal', icon: '👤' },
    { value: 'investment', label: '📈 Investment', icon: '📈' },
    { value: 'utilities', label: '⚡ Utilities', icon: '⚡' },
    { value: 'marketing', label: '📢 Marketing', icon: '📢' },
    { value: 'equipment', label: '🔧 Equipment', icon: '🔧' },
    { value: 'rent', label: '🏠 Rent/Mortgage', icon: '🏠' },
    { value: 'food', label: '🍔 Food & Dining', icon: '🍔' },
    { value: 'transport', label: '🚗 Transportation', icon: '🚗' },
    { value: 'healthcare', label: '🏥 Healthcare', icon: '🏥' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add Transaction
        </h3>
        <p className="text-blue-100 text-sm mt-1">Create one-time or recurring financial events</p>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Type and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              Transaction Type
            </label>
            <select
              value={transaction.type}
              onChange={(e) => setTransaction(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
            >
              <option value="revenue">💰 Revenue/Income</option>
              <option value="expense">💸 Expense</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Category</label>
            <select
              value={transaction.category}
              onChange={(e) => setTransaction(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount and Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={transaction.amount}
              onChange={(e) => setTransaction(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 focus:bg-white text-lg font-semibold"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <input
              type="text"
              value={transaction.description}
              onChange={(e) => setTransaction(prev => ({ ...prev, description: e.target.value }))}
              placeholder="What's this transaction for?"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
              required
            />
          </div>
        </div>

        {/* Recurring Toggle */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <input
              type="checkbox"
              id="isRecurring"
              checked={transaction.isRecurring}
              onChange={(e) => setTransaction(prev => ({ ...prev, isRecurring: e.target.checked }))}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="isRecurring" className="text-sm font-semibold text-gray-700 flex items-center cursor-pointer">
              <Repeat className="w-4 h-4 mr-2" />
              Make this a recurring transaction
              <span className="ml-2 text-xs text-gray-500">(repeats automatically)</span>
            </label>
          </div>

          {transaction.isRecurring && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-blue-700 flex items-center">
                  <Repeat className="w-4 h-4 mr-1" />
                  Repeat Frequency
                </label>
                <select
                  value={transaction.frequency}
                  onChange={(e) => setTransaction(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-0 transition-colors bg-white"
                >
                  {frequencies.map(freq => (
                    <option key={freq.value} value={freq.value}>{freq.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-blue-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={transaction.endDate}
                  onChange={(e) => setTransaction(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-0 transition-colors bg-white"
                  min={transaction.scheduledDate}
                />
                <p className="text-xs text-blue-600">Leave blank for indefinite recurrence</p>
              </div>
            </div>
          )}
        </div>

        {/* Scheduled Date */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {transaction.isRecurring ? 'First Occurrence Date' : 'Transaction Date'}
          </label>
          <input
            type="date"
            value={transaction.scheduledDate}
            onChange={(e) => setTransaction(prev => ({ ...prev, scheduledDate: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
            required
          />
          <p className="text-xs text-gray-500">
            {transaction.isRecurring ? 'When should this recurring transaction start?' : 'When did/will this transaction occur?'}
          </p>
        </div>

        {/* Preview */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-1" />
            Transaction Preview
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">
                {transaction.description || 'Untitled Transaction'}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                {transaction.isRecurring ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Repeat className="w-3 h-3 mr-1" />
                    Recurring {transaction.frequency}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <Clock className="w-3 h-3 mr-1" />
                    One-time
                  </span>
                )}
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {categories.find(c => c.value === transaction.category)?.icon || '📄'} {transaction.category}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${transaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === 'expense' ? '-' : '+'}${transaction.amount || '0.00'}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(transaction.scheduledDate || new Date()).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!transaction.amount || !transaction.description || isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              {transaction.isRecurring ? 'Create Recurring Transaction' : 'Add Transaction'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const TransactionList = () => {
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
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
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
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 text-sm"
            >
              <option value="date" className="text-gray-900">Sort by Date</option>
              <option value="amount" className="text-gray-900">Sort by Amount</option>
              <option value="description" className="text-gray-900">Sort by Name</option>
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
};

// FIXED AccountBalancesInput Component
const AccountBalancesInput = () => {
  const { accountBalances, updateAccountBalances } = useFinanceContext();
  const [localBalances, setLocalBalances] = useState({
    personalBankBalance: 0,
    businessBankBalance: 0,
    personalCashOnHand: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Update local state when context updates (from initial load)
  useEffect(() => {
    setLocalBalances({
      personalBankBalance: accountBalances.personalBankBalance || 0,
      businessBankBalance: accountBalances.businessBankBalance || 0,
      personalCashOnHand: accountBalances.personalCashOnHand || 0
    });
  }, [accountBalances]);

  const handleChange = (field, value) => {
    const newBalances = { ...localBalances, [field]: parseFloat(value) || 0 };
    setLocalBalances(newBalances);
    
    // Check if there are changes
    const hasAnyChanges = Object.keys(newBalances).some(
      key => newBalances[key] !== (accountBalances[key] || 0)
    );
    setHasChanges(hasAnyChanges);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send all balance updates with proper change tracking
      const fieldsToUpdate = ['personalBankBalance', 'businessBankBalance', 'personalCashOnHand'];
      
      for (const field of fieldsToUpdate) {
        const oldValue = accountBalances[field] || 0;
        const newValue = localBalances[field] || 0;
        
        // Only send update if value has actually changed
        if (oldValue !== newValue) {
          await updateAccountBalances(field, newValue);
        }
      }
      
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating account balances:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setLocalBalances({
      personalBankBalance: accountBalances.personalBankBalance || 0,
      businessBankBalance: accountBalances.businessBankBalance || 0,
      personalCashOnHand: accountBalances.personalCashOnHand || 0
    });
    setHasChanges(false);
  };

  const balanceFields = [
    {
      key: 'personalBankBalance',
      label: 'Personal Bank Balance',
      icon: Wallet,
      color: 'text-green-600'
    },
    {
      key: 'businessBankBalance', 
      label: 'Business Bank Balance',
      icon: Building,
      color: 'text-blue-600'
    },
    {
      key: 'personalCashOnHand',
      label: 'Personal Cash on Hand',
      icon: CreditCard,
      color: 'text-purple-600'
    }
  ];

  const totalAssets = Object.values(localBalances).reduce((sum, val) => sum + (val || 0), 0);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Wallet className="w-5 h-5 mr-2" />
          Account Balances
        </h3>
        <p className="text-green-100 text-sm mt-1">Current cash and bank account balances</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {balanceFields.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center">
              <Icon className={`w-4 h-4 mr-2 ${color}`} />
              {label}
            </label>
            <input
              type="number"
              step="0.01"
              value={localBalances[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 focus:bg-white font-semibold disabled:opacity-50"
              placeholder={`Enter ${label.toLowerCase()}...`}
            />
          </div>
        ))}
        
        {/* Total Balance Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Total Liquid Assets</h4>
          <div className="text-2xl font-bold text-gray-900">
            ${totalAssets.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Sum of all account balances
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={!hasChanges || isSubmitting}
            className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Updating Balances...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5 mr-2" />
                Update Account Balances
              </>
            )}
          </button>
          
          {hasChanges && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors border border-gray-300"
            >
              Reset
            </button>
          )}
        </div>

        {hasChanges && (
          <div className="text-xs text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-200">
            You have unsaved changes. Click "Update Account Balances" to save them.
          </div>
        )}
      </form>
    </div>
  );
};

export default function EnhancedDashboard() {
  const {
    accountBalances,
    transactions,
    isLoading,
    error,
    lastUpdated,
    stats,
    handleRefresh
  } = useFinanceContext();

  // Loading component
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Financial Data...</h2>
          <p className="text-gray-500">Connecting to your financial database</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-red-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-red-800">Error Loading Data</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Financial Command Center
            </h1>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              title="Refresh data"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your journey to financial freedom with style and precision
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Current Cash Flow"
            value={`$${stats.currentCash.toLocaleString()}`}
            change="+12%"
            positive={true}
            icon={DollarSign}
            gradient="bg-gradient-to-br from-green-500 to-emerald-600"
          />
          <StatsCard
            title="Monthly Burn Rate"
            value={`$${stats.monthlyBurn.toLocaleString()}`}
            change="+5%"
            positive={false}
            icon={TrendingDown}
            gradient="bg-gradient-to-br from-red-500 to-pink-600"
          />
          <StatsCard
            title="Months to Goal"
            value={stats.monthsToGoal}
            change="March 2026"
            positive={true}
            icon={Target}
            gradient="bg-gradient-to-br from-blue-500 to-cyan-600"
          />
          <StatsCard
            title="Projected Revenue"
            value={`$${stats.projectedRevenue.toLocaleString()}`}
            change="Next 30 days"
            positive={true}
            icon={Calendar}
            gradient="bg-gradient-to-br from-purple-500 to-indigo-600"
          />
        </div>

        {/* Transaction Form and Account Balances */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EnhancedTransactionForm />
          </div>
          
          <AccountBalancesInput />
        </div>

        {/* Personal and Business Finance Displays */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PersonalFinanceDisplay />
          <BusinessFinanceDisplay />
        </div>

        {/* Transaction History */}
        <TransactionList />

        {/* Bottom CTA */}
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer">
            <Calendar className="w-4 h-4" />
            <span>View Calendar</span>
          </div>
        </div>

      </div>
    </div>
  );
}
