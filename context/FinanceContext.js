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
  const [personalFinances, setPersonalFinances] = useState({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savings: 0
  });

  const [businessFinances, setBusinessFinances] = useState({
    monthlyRevenue: 0,
    monthlyExpenses: 0,
    recurringRevenue: 0
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
        timestamp: new Date().toISOString(),
        // Include current state for context if needed
        currentState: {
          personalFinances,
          businessFinances,
          transactionCount: transactions.length
        }
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
        setTransactions(data.data.transactions || []);
        setPersonalFinances(data.data.personalFinances || {
          monthlyIncome: 0,
          monthlyExpenses: 0,
          savings: 0
        });
        setBusinessFinances(data.data.businessFinances || {
          monthlyRevenue: 0,
          monthlyExpenses: 0,
          recurringRevenue: 0
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

  // Transaction management with webhook integration
  const addTransaction = useCallback(async (transactionData) => {
    const newTransaction = {
      ...transactionData,
      id: Date.now(),
      amount: parseFloat(transactionData.amount),
      createdAt: new Date()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Send webhook update
    await sendWebhookUpdate('ADD_TRANSACTION', {
      transaction: newTransaction
    });
  }, [personalFinances, businessFinances, transactions]);

  const deleteTransaction = useCallback(async (transactionId) => {
    const transactionToDelete = transactions.find(t => t.id === transactionId);
    
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
    
    // Send webhook update
    await sendWebhookUpdate('DELETE_TRANSACTION', {
      transactionId,
      deletedTransaction: transactionToDelete
    });
  }, [transactions, personalFinances, businessFinances]);

  // Personal finance management with webhook integration
  const updatePersonalFinances = useCallback(async (field, value) => {
    const oldValue = personalFinances[field];
    const newValue = parseFloat(value) || 0;
    
    setPersonalFinances(prev => ({ ...prev, [field]: newValue }));
    
    // Send webhook update
    await sendWebhookUpdate('UPDATE_PERSONAL_FINANCES', {
      field,
      oldValue,
      newValue,
      updatedFinances: { ...personalFinances, [field]: newValue }
    });
  }, [personalFinances, businessFinances, transactions]);

  // Business finance management with webhook integration
  const updateBusinessFinances = useCallback(async (field, value) => {
    const oldValue = businessFinances[field];
    const newValue = parseFloat(value) || 0;
    
    setBusinessFinances(prev => ({ ...prev, [field]: newValue }));
    
    // Send webhook update
    await sendWebhookUpdate('UPDATE_BUSINESS_FINANCES', {
      field,
      oldValue,
      newValue,
      updatedFinances: { ...businessFinances, [field]: newValue }
    });
  }, [businessFinances, personalFinances, transactions]);

  // Load data on mount
  useEffect(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

  // Calculate dynamic stats based on actual transactions
  const calculateStats = useCallback(() => {
    const revenue = transactions
      .filter(t => t.type === 'revenue')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyRecurring = transactions
      .filter(t => t.isRecurring)
      .reduce((sum, t) => sum + (t.type === 'revenue' ? t.amount : -t.amount), 0);
    
    return {
      currentCash: revenue - expenses + 15420, // Adding base amount
      monthlyBurn: expenses,
      monthsToGoal: 8, // This could be calculated based on goals
      projectedRevenue: revenue
    };
  }, [transactions]);

  const value = {
    // State
    personalFinances,
    businessFinances,
    transactions,
    isLoading,
    error,
    lastUpdated,
    stats: calculateStats(),
    
    // Actions
    addTransaction,
    deleteTransaction,
    updatePersonalFinances,
    updateBusinessFinances,
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
