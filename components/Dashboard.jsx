/* components/Dashboard.jsx */

import { TrendingDown, DollarSign, Calendar, Target, RefreshCw } from 'lucide-react';
import { useFinanceContext } from '../context/FinanceContext';

// Import all the split components
import StatsCard from './dashboard/StatsCard';
import PersonalFinanceDisplay from './dashboard/PersonalFinanceDisplay';
import BusinessFinanceDisplay from './dashboard/BusinessFinanceDisplay';
import TransactionForm from './dashboard/TransactionForm';
import TransactionList from './dashboard/TransactionList';
import AccountBalancesInput from './dashboard/AccountBalancesInput';

export default function Dashboard() {
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
            <TransactionForm />
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
