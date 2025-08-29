import { useState } from 'react';
import Link from 'next/link';
import FinanceCalendar from '../components/FinanceCalendar';
import ViewToggle from '../components/ViewToggle';

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState('month'); // 'week', 'month', 'quarter'
  const [eventFilters, setEventFilters] = useState({
    high: true,
    medium: true,
    low: true,
    confirmed: true
  });

  const toggleFilter = (filterType) => {
    setEventFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">IronForge Automations</h1>
              <span className="ml-2 text-sm text-gray-500">Financial Calendar</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/calendar" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                Calendar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Financial Calendar</h2>
            <p className="text-sm text-gray-600 mt-1">Track your financial events and opportunities</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            
            <div className="flex space-x-2">
              <button
                onClick={() => toggleFilter('confirmed')}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  eventFilters.confirmed 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => toggleFilter('high')}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  eventFilters.high 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                High Likelihood
              </button>
              <button
                onClick={() => toggleFilter('medium')}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  eventFilters.medium 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                Medium Likelihood
              </button>
              <button
                onClick={() => toggleFilter('low')}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  eventFilters.low 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                Low Likelihood
              </button>
            </div>
          </div>
        </div>

        <FinanceCalendar viewMode={viewMode} eventFilters={eventFilters} />
      </main>
    </div>
  );
}
