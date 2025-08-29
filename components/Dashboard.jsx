import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Target, Zap } from 'lucide-react';

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

const TransactionForm = ({ onSubmit }) => {
  const [transaction, setTransaction] = useState({
    type: 'revenue',
    amount: '',
    description: '',
    category: 'business'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(transaction);
    setTransaction({ type: 'revenue', amount: '', description: '', category: 'business' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          Quick Transaction
        </h3>
        <p className="text-blue-100 text-sm mt-1">Log your financial events instantly</p>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Type</label>
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
            </select>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Amount</label>
          <input
            type="number"
            value={transaction.amount}
            onChange={(e) => setTransaction(prev => ({ ...prev, amount: e.target.value }))}
            placeholder="Enter amount..."
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
        
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Add Transaction ✨
        </button>
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

export default function Dashboard() {
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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = {
    currentCash: 15420,
    monthlyBurn: 3200,
    monthsToGoal: 8,
    projectedRevenue: 4800
  };

  const handlePersonalChange = (field, value) => {
    setPersonalFinances(prev => ({ ...prev, [field]: value }));
  };

  const handleBusinessChange = (field, value) => {
    setBusinessFinances(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTransaction = (transactionData) => {
    console.log('New transaction:', transactionData);
    // Here you would typically send to your backend/n8n
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header with animation */}
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

        {/* Input Forms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <FinanceInput
            title="Personal Finances"
            data={personalFinances}
            onChange={handlePersonalChange}
            icon={DollarSign}
            gradient="bg-gradient-to-r from-green-600 to-teal-600"
          />
          
          <FinanceInput
            title="Business Finances"
            data={businessFinances}
            onChange={handleBusinessChange}
            icon={TrendingUp}
            gradient="bg-gradient-to-r from-blue-600 to-indigo-600"
          />
          
          <TransactionForm onSubmit={handleAddTransaction} />
        </div>

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
