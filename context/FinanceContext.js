import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FinanceContext = createContext();

export const useFinanceContext = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinanceContext must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  const [accountBalances, setAccountBalances] = useState({
    personalBankBalance: 0,
    businessBankBalance: 0,
    personalCashOnHand: 0
  });

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Webhook function to send changes
  const sendWebhookUpdate = async (changeType, changeData) => {
    try {
      const payload = {
        changeType,
        changeData,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('https://thayneautomations.app.n8n.cloud/webhook/change-ironforge-finances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }

      console.log(`Webhook sent successfully for ${changeType}`);
      return await response.json();
    } catch (err) {
      console.error('Webhook error:', err);
      // Don't throw here - we don't want to break the UI if webhook fails
      return { success: false, error: err.message };
    }
  };

  // Fetch financial data from n8n webhook
  const fetchFinancialData = useCallback(async () => {
    // Don't fetch if data is already loaded
    if (isDataLoaded) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://thayneautomations.app.n8n.cloud/webhook/retrieve-ironforge-finances', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // The webhook returns an array with one object, so we get the first item
      const data = Array.isArray(result) ? result[0] : result;
      
      if (data.success && data.data) {
        // Process transactions and ensure they have likelihood field
        const processedTransactions = (data.data.transactions || []).map(transaction => ({
          ...transaction,
          // Ensure likelihood field exists - default to 'confirmed' for existing transactions
          likelihood: transaction.likelihood || 'confirmed'
        }));
        
        setTransactions(processedTransactions);
        setAccountBalances(data.data.accountBalances || {
          personalBankBalance: 0,
          businessBankBalance: 0,
          personalCashOnHand: 0
        });
        setLastUpdated(new Date());
        setIsDataLoaded(true);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (err) {
      setError(`Failed to load financial data: ${err.message}`);
      console.error('Error fetching financial data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isDataLoaded]);

  // Force refresh function
  const handleRefresh = useCallback(async () => {
    setIsDataLoaded(false);
    await fetchFinancialData();
  }, [fetchFinancialData]);

  // Transaction management with webhook integration - UPDATED TO HANDLE LIKELIHOOD
  const addTransaction = useCallback(async (transactionData) => {
    const newTransaction = {
      ...transactionData,
      id: Date.now(),
      amount: parseFloat(transactionData.amount),
      // Ensure likelihood field is included
      likelihood: transactionData.likelihood || 'confirmed',
      createdAt: new Date()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Send webhook update with likelihood data
    await sendWebhookUpdate('ADD_TRANSACTION', {
      transaction: newTransaction
    });
  }, []);

  const deleteTransaction = useCallback(async (transactionId) => {
    const transactionToDelete = transactions.find(t => t.id === transactionId);
    
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
    
    // Send webhook update
    await sendWebhookUpdate('DELETE_TRANSACTION', {
      transactionId,
      deletedTransaction: transactionToDelete
    });
  }, [transactions]);

  // Account balance management with webhook integration
  const updateAccountBalances = useCallback(async (field, value) => {
    // Capture the old value BEFORE updating state
    const oldValue = accountBalances[field] || 0;
    const newValue = parseFloat(value) || 0;
    
    // Create the updated balances object
    const updatedBalances = { 
      ...accountBalances, 
      [field]: newValue 
    };
    
    // Update the state
    setAccountBalances(updatedBalances);
    
    // Send webhook update with correct data
    await sendWebhookUpdate('UPDATE_ACCOUNT_BALANCES', {
      field,
      oldValue,
      newValue,
      updatedBalances: updatedBalances
    });
  }, [accountBalances]);

  // Load data on mount
  useEffect(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

  // Calculate stats from transactions - UPDATED TO HANDLE LIKELIHOOD
  const calculateStats = useCallback(() => {
    const personalRevenue = transactions
      .filter(t => t.type === 'revenue' && (t.category === 'personal' || t.category === 'healthcare' || t.category === 'food' || t.category === 'transport'))
      .reduce((sum, t) => sum + t.amount, 0);
      
    const personalExpenses = transactions
      .filter(t => t.type === 'expense' && (t.category === 'personal' || t.category === 'healthcare' || t.category === 'food' || t.category === 'transport'))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const businessRevenue = transactions
      .filter(t => t.type === 'revenue' && (t.category === 'business' || t.category === 'investment' || t.category === 'marketing'))
      .reduce((sum, t) => sum + t.amount, 0);
      
    const businessExpenses = transactions
      .filter(t => t.type === 'expense' && (t.category === 'business' || t.category === 'investment' || t.category === 'marketing' || t.category === 'equipment' || t.category === 'utilities' || t.category === 'rent'))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalRevenue = transactions
      .filter(t => t.type === 'revenue')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyRecurring = transactions
      .filter(t => t.isRecurring)
      .reduce((sum, t) => sum + (t.type === 'revenue' ? t.amount : -t.amount), 0);

    // ENHANCED: Calculate weighted projections based on likelihood
    const calculateWeightedAmount = (transaction) => {
      const multipliers = {
        confirmed: 1.0,
        high: 0.85,
        medium: 0.55,
        low: 0.2
      };
      const multiplier = multipliers[transaction.likelihood] || 1.0;
      return transaction.amount * multiplier;
    };

    const weightedTotalRevenue = transactions
      .filter(t => t.type === 'revenue')
      .reduce((sum, t) => sum + calculateWeightedAmount(t), 0);

    const weightedMonthlyRecurring = transactions
      .filter(t => t.isRecurring)
      .reduce((sum, t) => {
        const weightedAmount = calculateWeightedAmount(t);
        return sum + (t.type === 'revenue' ? weightedAmount : -weightedAmount);
      }, 0);
    
    return {
      // Overall stats
      currentCash: totalRevenue - totalExpenses + accountBalances.personalBankBalance + accountBalances.businessBankBalance + accountBalances.personalCashOnHand,
      monthlyBurn: totalExpenses,
      monthsToGoal: 8, // This could be calculated based on goals
      projectedRevenue: Math.round(weightedTotalRevenue), // Use weighted projection
      
      // Personal stats (calculated from transactions)
      personalStats: {
        totalIncome: personalRevenue,
        totalExpenses: personalExpenses,
        netIncome: personalRevenue - personalExpenses
      },
      
      // Business stats (calculated from transactions)  
      businessStats: {
        totalRevenue: businessRevenue,
        totalExpenses: businessExpenses,
        netIncome: businessRevenue - businessExpenses,
        monthlyRecurring: transactions
          .filter(t => t.isRecurring && (t.category === 'business' || t.category === 'investment' || t.category === 'marketing'))
          .reduce((sum, t) => sum + (t.type === 'revenue' ? t.amount : -t.amount), 0)
      },

      // NEW: Likelihood-based projections
      projectionStats: {
        confirmedRevenue: transactions
          .filter(t => t.type === 'revenue' && t.likelihood === 'confirmed')
          .reduce((sum, t) => sum + t.amount, 0),
        weightedProjectedRevenue: Math.round(weightedTotalRevenue),
        weightedMonthlyRecurring: Math.round(weightedMonthlyRecurring),
        transactionsByLikelihood: {
          confirmed: transactions.filter(t => t.likelihood === 'confirmed').length,
          high: transactions.filter(t => t.likelihood === 'high').length,
          medium: transactions.filter(t => t.likelihood === 'medium').length,
          low: transactions.filter(t => t.likelihood === 'low').length
        }
      }
    };
  }, [transactions, accountBalances]);

  const value = {
    // State
    accountBalances,
    transactions,
    isLoading,
    error,
    lastUpdated,
    stats: calculateStats(),
    
    // Actions
    addTransaction,
    deleteTransaction,
    updateAccountBalances,
    handleRefresh,
    
    // Utilities
    sendWebhookUpdate
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
