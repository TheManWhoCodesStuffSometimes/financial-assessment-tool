import { useState, useEffect } from 'react';
import { useFinanceContext } from '../context/FinanceContext';

export default function EventModal({ isOpen, onClose, selectedDate }) {
  const { addTransaction } = useFinanceContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'revenue',
    category: 'business', // Default category
    likelihood: 'medium',
    description: '',
    isRecurring: false,
    frequency: 'monthly',
    endDate: ''
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        amount: '',
        type: 'revenue',
        category: 'business',
        likelihood: 'medium',
        description: '',
        isRecurring: false,
        frequency: 'monthly',
        endDate: ''
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create transaction data from the form
      const transactionData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.title,
        category: formData.category,
        likelihood: formData.likelihood,
        isRecurring: formData.isRecurring,
        frequency: formData.frequency,
        scheduledDate: selectedDate.toISOString().split('T')[0],
        endDate: formData.endDate
      };
      
      // Use the same addTransaction function as the dashboard
      await addTransaction(transactionData);
      onClose();
    } catch (error) {
      console.error('Error adding transaction from calendar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  const getLikelihoodDescription = (likelihood) => {
    const descriptions = {
      confirmed: 'This event is guaranteed to happen (100%)',
      high: '80-90% chance this will occur',
      medium: '40-70% chance this will occur',
      low: '10-30% chance this will occur'
    };
    return descriptions[likelihood];
  };

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
    { value: 'confirmed', label: '✅ Confirmed (100%)', color: 'text-green-700' },
    { value: 'high', label: '🟦 High (80-90%)', color: 'text-blue-700' },
    { value: 'medium', label: '🟨 Medium (40-70%)', color: 'text-yellow-700' },
    { value: 'low', label: '🟥 Low (10-30%)', color: 'text-red-700' }
  ];

  const frequencies = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi-weekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-2xl px-6 pt-6 pb-6 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <div className="mb-6">
                <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-2">
                  Add Financial Transaction
                </h3>
                <p className="text-sm text-gray-600">
                  Create a transaction for {selectedDate && selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Transaction Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Transaction Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                    placeholder="e.g., New Client Payment - ABC Corp"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Type and Category Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Transaction Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleChange('type', e.target.value)}
                      className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                      disabled={isSubmitting}
                    >
                      <option value="revenue">💰 Revenue/Income</option>
                      <option value="expense">💸 Expense</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                      disabled={isSubmitting}
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Amount and Likelihood Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Amount ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) => handleChange('amount', e.target.value)}
                      placeholder="1500.00"
                      className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 focus:bg-white text-lg font-semibold"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Likelihood *
                    </label>
                    <select
                      value={formData.likelihood}
                      onChange={(e) => handleChange('likelihood', e.target.value)}
                      className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                      disabled={isSubmitting}
                    >
                      {likelihoods.map(likelihood => (
                        <option key={likelihood.value} value={likelihood.value}>
                          {likelihood.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      {getLikelihoodDescription(formData.likelihood)}
                    </p>
                  </div>
                </div>

                {/* Recurring Toggle */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <input
                      type="checkbox"
                      id="isRecurring"
                      checked={formData.isRecurring}
                      onChange={(e) => handleChange('isRecurring', e.target.checked)}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="isRecurring" className="text-sm font-semibold text-gray-700 flex items-center cursor-pointer">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Make this a recurring transaction
                      <span className="ml-2 text-xs text-gray-500">(repeats automatically)</span>
                    </label>
                  </div>

                  {formData.isRecurring && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div>
                        <label className="block text-sm font-semibold text-blue-700 mb-2">
                          Repeat Frequency
                        </label>
                        <select
                          value={formData.frequency}
                          onChange={(e) => handleChange('frequency', e.target.value)}
                          className="block w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-0 transition-colors bg-white"
                          disabled={isSubmitting}
                        >
                          {frequencies.map(freq => (
                            <option key={freq.value} value={freq.value}>{freq.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-blue-700 mb-2">
                          End Date (Optional)
                        </label>
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => handleChange('endDate', e.target.value)}
                          className="block w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-0 transition-colors bg-white"
                          min={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                          disabled={isSubmitting}
                        />
                        <p className="text-xs text-blue-600 mt-1">Leave blank for indefinite recurrence</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 focus:bg-white resize-none"
                    placeholder="Additional notes about this financial transaction..."
                    disabled={isSubmitting}
                  />
                </div>

                {/* Enhanced Preview */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Transaction Preview
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-2">
                        {formData.title || 'Untitled Transaction'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          formData.type === 'revenue' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {formData.type === 'revenue' ? '💰' : '💸'} {formData.type}
                        </span>
                        
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {categories.find(c => c.value === formData.category)?.icon || '📄'} {formData.category}
                        </span>

                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          formData.likelihood === 'confirmed' ? 'bg-green-100 text-green-800' :
                          formData.likelihood === 'high' ? 'bg-blue-100 text-blue-800' :
                          formData.likelihood === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {likelihoods.find(l => l.value === formData.likelihood)?.label.split(' ')[0] || '⚪'} {formData.likelihood}
                        </span>

                        {formData.isRecurring && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Recurring {formData.frequency}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`text-xl font-bold ${formData.type === 'revenue' ? 'text-green-600' : 'text-red-600'}`}>
                        {formData.type === 'expense' ? '-' : '+'}${formData.amount || '0.00'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {selectedDate ? selectedDate.toLocaleDateString() : 'No date selected'}
                      </div>
                      {formData.isRecurring && formData.endDate && (
                        <div className="text-xs text-gray-400">
                          Until {new Date(formData.endDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row-reverse sm:space-x-reverse sm:space-x-3 space-y-3 sm:space-y-0 pt-4">
                  <button
                    type="submit"
                    disabled={!formData.amount || !formData.title || isSubmitting}
                    className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl border border-transparent shadow-lg px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-base font-bold text-white hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding Transaction...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        {formData.isRecurring ? 'Create Recurring Transaction' : 'Add Transaction'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex justify-center rounded-xl border-2 border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
