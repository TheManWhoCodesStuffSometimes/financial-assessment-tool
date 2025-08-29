import { useState } from 'react';
import StatsCard from './StatsCard';

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

  const [newTransaction, setNewTransaction] = useState({
    type: 'revenue',
    amount: '',
    description: '',
    category: 'business'
  });

  // Mock data for demonstration
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

  const handleAddTransaction = (e) => {
    e.preventDefault();
    // This will integrate with your n8n/Airtable setup
    console.log('New transaction:', newTransaction);
    setNewTransaction({ type: 'revenue', amount: '', description: '', category: 'business' });
  };

  return (
    <div className="space-y-8">
      {/* Statistics Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Current Cash Flow"
            value={`$${stats.currentCash.toLocaleString()}`}
            change="+12% from last month"
            positive={true}
          />
          <StatsCard
            title="Monthly Burn Rate"
            value={`$${stats.monthlyBurn.toLocaleString()}`}
            change="+5% from last month"
            positive={false}
          />
          <StatsCard
            title="Months to Livable Wage"
            value={stats.monthsToGoal}
            change="March 2026 Target"
            positive={true}
          />
          <StatsCard
            title="Projected Revenue"
            value={`$${stats.projectedRevenue.toLocaleString()}`}
            change="Next 30 days"
            positive={true}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Finances Input */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Finances</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Monthly Personal Income</label>
              <input
                type="number"
                value={personalFinances.monthlyIncome}
                onChange={(e) => handlePersonalChange('monthlyIncome', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Monthly Personal Expenses</label>
              <input
                type="number"
                value={personalFinances.monthlyExpenses}
                onChange={(e) => handlePersonalChange('monthlyExpenses', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="3500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Personal Savings</label>
              <input
                type="number"
                value={personalFinances.savings}
                onChange={(e) => handlePersonalChange('savings', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="25000"
              />
            </div>
          </div>
        </div>

        {/* Business Finances Input */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Finances</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Monthly Business Revenue</label>
              <input
                type="number"
                value={businessFinances.monthlyRevenue}
                onChange={(e) => handleBusinessChange('monthlyRevenue', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="8000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Monthly Business Expenses</label>
              <input
                type="number"
                value={businessFinances.monthlyExpenses}
                onChange={(e) => handleBusinessChange('monthlyExpenses', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="4500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Recurring Revenue</label>
              <input
                type="number"
                value={businessFinances.recurringRevenue}
                onChange={(e) => handleBusinessChange('recurringRevenue', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="2500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Transaction Entry */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Transaction Entry</h3>
        <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <select
              value={newTransaction.type}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, type: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="revenue">Revenue</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <select
              value={newTransaction.category}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="business">Business</option>
              <option value="personal">Personal</option>
            </select>
          </div>
          <div>
            <input
              type="number"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="Amount"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="text"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
