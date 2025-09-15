/* components/dashboard/TransactionForm.jsx */

import { useState } from 'react';
import { Plus, DollarSign, Target, Repeat, Calendar, Clock, Zap, RefreshCw } from 'lucide-react';
import { useFinanceContext } from '../../context/FinanceContext';

export default function TransactionForm() {
  const { addTransaction } = useFinanceContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transaction, setTransaction] = useState({
    type: 'revenue',
    amount: '',
    description: '',
    category: 'business',
    likelihood: 'confirmed',
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
        likelihood: 'confirmed',
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

  const likelihoods = [
    { value: 'confirmed', label: '✅ Confirmed (100%)', color: 'text-green-700', description: 'This event is guaranteed to happen' },
    { value: 'high', label: '🟦 High (80-90%)', color: 'text-blue-700', description: '80-90% chance this will occur' },
    { value: 'medium', label: '🟨 Medium (40-70%)', color: 'text-yellow-700', description: '40-70% chance this will occur' },
    { value: 'low', label: '🟥 Low (10-30%)', color: 'text-red-700', description: '10-30% chance this will occur' }
  ];

  const getLikelihoodInfo = (likelihood) => {
    return likelihoods.find(l => l.value === likelihood) || likelihoods[0];
  };

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
        {/* Type, Category, and Likelihood Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center">
              <Target className="w-4 h-4 mr-1" />
              Likelihood
            </label>
            <select
              value={transaction.likelihood}
              onChange={(e) => setTransaction(prev => ({ ...prev, likelihood: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
            >
              {likelihoods.map(likelihood => (
                <option key={likelihood.value} value={likelihood.value}>
                  {likelihood.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500">
              {getLikelihoodInfo(transaction.likelihood).description}
            </p>
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

        {/* Enhanced Preview */}
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

                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.likelihood === 'confirmed' ? 'bg-green-100 text-green-800' :
                  transaction.likelihood === 'high' ? 'bg-blue-100 text-blue-800' :
                  transaction.likelihood === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {getLikelihoodInfo(transaction.likelihood).label.split(' ')[0]} {transaction.likelihood}
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
}
