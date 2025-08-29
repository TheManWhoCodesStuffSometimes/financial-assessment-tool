import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Target, Zap, Plus, Filter, ChevronDown, Repeat, Clock } from 'lucide-react';

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

const EnhancedTransactionForm = ({ onSubmit }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const transactionData = {
      ...transaction,
      id: Date.now(),
      amount: parseFloat(transaction.amount),
      createdAt: new Date()
    };
    onSubmit(transactionData);
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
  };

  const frequencies = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
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
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Type and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              Type
            </label>
            <select
              value={transaction.type}
              onChange={(e) => setTransaction(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
            >
              <option value="revenue">💰 Revenue</option>
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
              <option value="business">🏢 Business</option>
              <option value="personal">👤 Personal</option>
              <option value="investment">📈 Investment</option>
              <option value="utilities">⚡ Utilities</option>
              <option value="marketing">📢 Marketing</option>
              <option value="equipment">🔧 Equipment</option>
            </select>
          </div>
        </div>

        {/* Amount and Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Amount</label>
            <input
              type="number"
              step="0.01"
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
              placeholder="What's this for?"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
              required
            />
          </div>
        </div>

        {/* Recurring Toggle */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isRecurring"
              checked={transaction.isRecurring}
              onChange={(e) => setTransaction(prev => ({ ...prev, isRecurring: e.target.checked }))}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="isRecurring" className="text-sm font-semibold text-gray-700 flex items-center">
              <Repeat className="w-4 h-4 mr-1" />
              This is a recurring transaction
            </label>
          </div>

          {transaction.isRecurring && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-blue-700">Frequency</label>
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
                <label className="text-sm font-semibold text-blue-700">End Date (Optional)</label>
                <input
                  type="date"
                  value={transaction.endDate}
                  onChange={(e) => setTransaction(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-0 transition-colors bg-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Scheduled Date */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {transaction.isRecurring ? 'Start Date' : 'Scheduled Date'}
          </label>
          <input
            type="date"
            value={transaction.scheduledDate}
            onChange={(e) => setTransaction(prev => ({ ...prev, scheduledDate: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
            required
          />
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
              <p className="text-sm text-gray-600 flex items-center mt-1">
                {transaction.isRecurring ? (
                  <>
                    <Repeat className="w-3 h-3 mr-1" />
                    Recurring {transaction.frequency}
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 mr-1" />
                    One-time
                  </>
                )}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${transaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === 'expense' ? '-' : '+'}${transaction.amount || '0.00'}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(transaction.scheduledDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Transaction
        </button>
      </form>
    </div>
  );
};

const TransactionList = ({ transactions, onDeleteTransaction }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);

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
      return 0;
    });

  const getTotalByType = (type) => {
    return transactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 text-sm"
            >
              <option value="date" className="text-gray-900">Sort by Date</option>
              <option value="amount" className="text-gray-900">Sort by Amount</option>
            </select>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No transactions found</p>
              <p className="text-gray-400 text-sm">Add your first transaction to get started</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
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
                        {transaction.category}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-1">{transaction.description}</h4>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(transaction.scheduledDate).toLocaleDateString()}
                      {transaction.isRecurring && transaction.endDate && (
                        <span className="ml-2">
                          → {new Date(transaction.endDate).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-xl font-bold ${transaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'expense' ? '-' : '+'}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </div>
                    <button
                      onClick={() => onDeleteTransaction(transaction.id)}
                      className="text-xs text-red-500 hover:text-red-700 mt-1"
                    >
                      Delete
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

const FinanceInput = ({ title, data, onChange, icon: Icon, gradient }) => (
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
    <div className={`${gradient} p-6`}>
      <h3 className="text-xl font-bold text-white flex items-center">
        <Icon className="w-5 h-5 mr-2" />
        {title}
      </h3>
    </div>
    
    <div className="p-6 space-y-4">
      {Object.entries(data).map(([key, value]) => {
        const labels = {
          monthlyIncome: 'Monthly Income',
          monthlyExpenses: 'Monthly Expenses', 
          savings: 'Current Savings',
          monthlyRevenue: 'Monthly Revenue',
          recurringRevenue: 'Recurring Revenue'
        };
        
        return (
          <div key={key} className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{labels[key]}</label>
            <input
              type="number"
              value={value}
              onChange={(e) => onChange(key, e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 focus:bg-white font-semibold"
              placeholder={`Enter ${labels[key].toLowerCase()}...`}
            />
          </div>
        );
      })}
    </div>
  </div>
);

export default function EnhancedDashboard() {
  const [personalFinances, setPersonalFinances] = useState({
    monthlyIncome: '',
    monthlyExpenses: '',
    savings: ''
  });

  const [businessFinances, setBusinessFinances] = useState({
    monthlyRevenue: '',
    monthlyExpenses: '',
    recurringRevenue: ''
  });

  const [transactions, setTransactions] = useState([
    // Sample data
    {
      id: 1,
      type: 'revenue',
      amount: 5000,
      description: 'Client Payment - ABC Corp',
      category: 'business',
      isRecurring: true,
      frequency: 'monthly',
      scheduledDate: '2025-09-01',
      endDate: '',
      createdAt: new Date()
    },
    {
      id: 2,
      type: 'expense',
      amount: 800,
      description: 'Office Rent',
      category: 'business',
      isRecurring: true,
      frequency: 'monthly',
      scheduledDate: '2025-09-01',
      endDate: '',
      createdAt: new Date()
    }
  ]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = {
    currentCash: transactions.reduce((sum, t) => sum + (t.type === 'revenue' ? t.amount : -t.amount), 15420),
    monthlyBurn: transactions.filter(t => t.type === 'expense' && t.isRecurring).reduce((sum, t) => sum + t.amount, 0),
    monthsToGoal: 8,
    projectedRevenue: transactions.filter(t => t.type === 'revenue').reduce((sum, t) => sum + t.amount, 0)
  };

  const handlePersonalChange = (field, value) => {
    setPersonalFinances(prev => ({ ...prev, [field]: value }));
  };

  const handleBusinessChange = (field, value) => {
    setBusinessFinances(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTransaction = (transactionData) => {
    setTransactions(prev => [transactionData, ...prev]);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Financial Command Center
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your journey to financial freedom with style and precision
          </p>
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

        {/* Transaction Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EnhancedTransactionForm onSubmit={handleAddTransaction} />
          </div>
          
          <FinanceInput
            title="Quick Stats"
            data={personalFinances}
            onChange={handlePersonalChange}
            icon={DollarSign}
            gradient="bg-gradient-to-r from-green-600 to-teal-600"
          />
        </div>

        {/* Transaction History */}
        <TransactionList 
          transactions={transactions} 
          onDeleteTransaction={handleDeleteTransaction}
        />

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
