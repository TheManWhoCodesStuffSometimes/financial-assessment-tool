/* components/dashboard/AccountBalancesInput.jsx */

import { useState, useEffect } from 'react';
import { Wallet, Building, CreditCard, AlertCircle, RefreshCw } from 'lucide-react';
import { useFinanceContext } from '../../context/FinanceContext';

export default function AccountBalancesInput() {
  const { accountBalances, updateAccountBalances } = useFinanceContext();
  const [localBalances, setLocalBalances] = useState({
    personalBankBalance: 0,
    businessBankBalance: 0,
    personalCashOnHand: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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
    
    const hasAnyChanges = Object.keys(newBalances).some(
      key => newBalances[key] !== (accountBalances[key] || 0)
    );
    setHasChanges(hasAnyChanges);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const fieldsToUpdate = ['personalBankBalance', 'businessBankBalance', 'personalCashOnHand'];
      
      for (const field of fieldsToUpdate) {
        const oldValue = accountBalances[field] || 0;
        const newValue = localBalances[field] || 0;
        
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
      color: 'text-green-600',
      description: 'Your personal bank account balance'
    },
    {
      key: 'businessBankBalance', 
      label: 'Business Bank Balance',
      icon: Building,
      color: 'text-blue-600',
      description: 'Your business bank account balance'
    },
    {
      key: 'personalCashOnHand',
      label: 'Cash on Hand',
      icon: CreditCard,
      color: 'text-purple-600',
      description: 'Physical cash you have available'
    }
  ];

  const totalAssets = Object.values(localBalances).reduce((sum, val) => sum + (val || 0), 0);
  const totalPersonal = (localBalances.personalBankBalance || 0) + (localBalances.personalCashOnHand || 0);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Wallet className="w-5 h-5 mr-2" />
          Current Account Balances
        </h3>
        <p className="text-green-100 text-sm mt-1">Enter your current balances for accurate forecasting</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {balanceFields.map(({ key, label, icon: Icon, color, description }) => (
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
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        ))}
        
        {/* Balance Summary with Calendar Note */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Balance Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Liquid Assets:</span>
              <span className="text-lg font-bold text-gray-900">${totalAssets.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Personal Total (Bank + Cash):</span>
              <span className="text-lg font-bold text-green-600">${totalPersonal.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-3 p-3 bg-blue-100 rounded-lg">
            <p className="text-xs text-blue-800 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              <strong>Calendar Note:</strong> Cash on hand will be combined with personal bank balance for calendar projections
            </p>
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
}
