import { useState, useMemo, useEffect } from 'react';
import { Calendar, DollarSign, TrendingUp, TrendingDown, AlertCircle, Target, Repeat, Clock, ChevronRight, Activity, Wallet, Building } from 'lucide-react';
import EventModal from './EventModal';
import { useFinanceContext } from '../context/FinanceContext';

export default function FinanceCalendar({ viewMode, eventFilters }) {
  const { transactions, accountBalances } = useFinanceContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);

  // Convert transactions to calendar events - NO MORE SEPARATE EVENTS
  const calendarEvents = useMemo(() => {
    const convertedEvents = transactions.map(transaction => ({
      id: transaction.id,
      title: transaction.description,
      amount: transaction.type === 'expense' ? -Math.abs(transaction.amount) : Math.abs(transaction.amount),
      type: transaction.type,
      likelihood: transaction.likelihood || 'confirmed', // Default to confirmed for existing transactions
      date: new Date(transaction.scheduledDate),
      description: transaction.description,
      category: transaction.category,
      isRecurring: transaction.isRecurring,
      frequency: transaction.frequency,
      endDate: transaction.endDate ? new Date(transaction.endDate) : null,
      isFromTransaction: true
    }));

    // Expand recurring transactions
    const expandedEvents = [];
    convertedEvents.forEach(event => {
      if (event.isRecurring) {
        const startDate = new Date(event.date);
        const endDate = event.endDate || new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate());
        let currentEventDate = new Date(startDate);
        let instanceCount = 0;

        while (currentEventDate <= endDate && instanceCount < 52) { // Max 52 occurrences for safety
          expandedEvents.push({
            ...event,
            id: `${event.id}-${instanceCount}`,
            date: new Date(currentEventDate),
            title: `${event.title} (Recurring)`
          });

          // Move to next occurrence based on frequency
          switch (event.frequency) {
            case 'weekly':
              currentEventDate.setDate(currentEventDate.getDate() + 7);
              break;
            case 'bi-weekly':
              currentEventDate.setDate(currentEventDate.getDate() + 14);
              break;
            case 'monthly':
              currentEventDate.setMonth(currentEventDate.getMonth() + 1);
              break;
            case 'quarterly':
              currentEventDate.setMonth(currentEventDate.getMonth() + 3);
              break;
            case 'yearly':
              currentEventDate.setFullYear(currentEventDate.getFullYear() + 1);
              break;
          }
          instanceCount++;
        }
      } else {
        expandedEvents.push(event);
      }
    });

    return expandedEvents;
  }, [transactions]);

  const filteredEvents = useMemo(() => {
    return calendarEvents.filter(event => eventFilters[event.likelihood]);
  }, [calendarEvents, eventFilters]);

  // Calculate balance for any given date - UPDATED TO SHOW FULL AMOUNTS
  const calculateBalanceForDate = (targetDate, accountType) => {
    const startBalance = accountType === 'personal' 
      ? accountBalances.personalBankBalance 
      : accountBalances.businessBankBalance;

    // Get all events up to and including the target date
    const relevantEvents = filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      const target = new Date(targetDate);
      target.setHours(0, 0, 0, 0);
      return eventDate <= target;
    });

    // Filter by account type based on category
    const accountEvents = relevantEvents.filter(event => {
      if (accountType === 'personal') {
        return ['personal', 'healthcare', 'food', 'transport'].includes(event.category);
      } else {
        return ['business', 'investment', 'marketing', 'equipment', 'utilities', 'rent'].includes(event.category);
      }
    });

    // Calculate the running total
    const eventTotal = accountEvents.reduce((sum, event) => sum + event.amount, 0);
    return startBalance + eventTotal;
  };

  // Get week/month/quarter summary
  const getPeriodSummary = (startDate, endDate) => {
    const periodEvents = filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= startDate && eventDate <= endDate;
    });

    const revenue = periodEvents
      .filter(e => e.amount > 0)
      .reduce((sum, e) => sum + e.amount, 0);
    
    const expenses = periodEvents
      .filter(e => e.amount < 0)
      .reduce((sum, e) => sum + Math.abs(e.amount), 0);

    return { revenue, expenses, net: revenue - expenses, eventCount: periodEvents.length };
  };

  const getLikelihoodColor = (likelihood) => {
    const colors = {
      confirmed: 'bg-green-500',
      high: 'bg-blue-500',
      medium: 'bg-yellow-500',
      low: 'bg-red-500'
    };
    return colors[likelihood] || 'bg-gray-500';
  };

  const getBalanceColor = (balance) => {
    if (balance < 0) return 'text-red-600 font-bold';
    if (balance < 1000) return 'text-orange-600 font-semibold';
    if (balance < 5000) return 'text-yellow-600';
    return 'text-green-600';
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (viewMode === 'quarter') {
      newDate.setMonth(newDate.getMonth() + (direction * 3));
    }
    setCurrentDate(newDate);
  };

  const getDateRange = () => {
    if (viewMode === 'week') {
      const start = new Date(currentDate);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return { start, end };
    } else if (viewMode === 'month') {
      const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      return { start, end };
    } else if (viewMode === 'quarter') {
      const quarterStart = Math.floor(currentDate.getMonth() / 3) * 3;
      const start = new Date(currentDate.getFullYear(), quarterStart, 1);
      const end = new Date(currentDate.getFullYear(), quarterStart + 3, 0);
      return { start, end };
    }
  };

  const { start: rangeStart, end: rangeEnd } = getDateRange();
  const periodSummary = getPeriodSummary(rangeStart, rangeEnd);

  const generateCalendarDays = () => {
    if (viewMode === 'week') {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(rangeStart);
        day.setDate(day.getDate() + i);
        days.push(day);
      }
      return days;
    } else if (viewMode === 'month') {
      const days = [];
      const firstDay = new Date(rangeStart);
      const lastDay = new Date(rangeEnd);
      
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - startDate.getDay());
      
      const endDate = new Date(lastDay);
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
      
      const current = new Date(startDate);
      while (current <= endDate) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      return days;
    } else if (viewMode === 'quarter') {
      const months = [];
      for (let i = 0; i < 3; i++) {
        const month = new Date(rangeStart);
        month.setMonth(month.getMonth() + i);
        months.push(month);
      }
      return months;
    }
  };

  const getEventsForDate = (date) => {
    return filteredEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const formatDateHeader = () => {
    if (viewMode === 'week') {
      return `${rangeStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${rangeEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else if (viewMode === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (viewMode === 'quarter') {
      const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
      return `Q${quarter} ${currentDate.getFullYear()}`;
    }
  };

  // UPDATED: Full currency formatting instead of compact
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  // UPDATED: Full currency formatting for balance display
  const formatFullCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Keep compact for very large summary numbers
  const formatCompactCurrency = (amount) => {
    const absAmount = Math.abs(amount);
    if (absAmount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (absAmount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    } else {
      return `$${amount}`;
    }
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="px-6 py-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {formatDateHeader()}
            </h3>
            <div className="flex space-x-1">
              <button
                onClick={() => navigateDate(-1)}
                className="p-2 text-white/80 hover:text-white rounded-md hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-2 text-sm font-medium bg-white/20 hover:bg-white/30 rounded-md transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => navigateDate(1)}
                className="p-2 text-white/80 hover:text-white rounded-md hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Period Summary */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700/50 to-purple-700/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-100 font-medium">Period Revenue</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(periodSummary.revenue)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-100 font-medium">Period Expenses</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(periodSummary.expenses)}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-400" />
              </div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-100 font-medium">Net Change</p>
                  <p className={`text-xl font-bold ${periodSummary.net >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {periodSummary.net >= 0 ? '+' : ''}{formatCurrency(periodSummary.net)}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-yellow-400" />
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-100 font-medium">Transactions</p>
                  <p className="text-xl font-bold text-white">{periodSummary.eventCount}</p>
                </div>
                <Target className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className={`grid ${viewMode === 'quarter' ? 'grid-cols-3' : 'grid-cols-7'}`}>
        {viewMode !== 'quarter' && (
          <>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="px-3 py-3 text-xs font-bold text-gray-700 bg-gray-50 text-center border-r border-b uppercase tracking-wider">
                {day}
              </div>
            ))}
          </>
        )}

        {viewMode === 'quarter' ? (
          // Quarter view - show months
          calendarDays.map((month, index) => {
            const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
            const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
            const monthSummary = getPeriodSummary(monthStart, monthEnd);
            
            const monthEndPersonalBalance = calculateBalanceForDate(monthEnd, 'personal');
            const monthEndBusinessBalance = calculateBalanceForDate(monthEnd, 'business');
            
            return (
              <div 
                key={index}
                className="p-4 border-r border-b min-h-64 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleDateClick(month)}
              >
                <div className="font-bold text-lg text-gray-900 mb-3">
                  {month.toLocaleDateString('en-US', { month: 'long' })}
                </div>
                
                {/* Month-end Balances - UPDATED TO SHOW FULL AMOUNTS */}
                <div className="space-y-2 mb-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-xs">
                    <span className="text-gray-600">Personal:</span>
                    <span className={`ml-2 font-semibold ${getBalanceColor(monthEndPersonalBalance)}`}>
                      {formatFullCurrency(monthEndPersonalBalance)}
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-600">Business:</span>
                    <span className={`ml-2 font-semibold ${getBalanceColor(monthEndBusinessBalance)}`}>
                      {formatFullCurrency(monthEndBusinessBalance)}
                    </span>
                  </div>
                </div>

                {/* Month Summary */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="text-green-600 font-semibold">{formatCompactCurrency(monthSummary.revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expenses:</span>
                    <span className="text-red-600 font-semibold">{formatCompactCurrency(monthSummary.expenses)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t">
                    <span className="text-gray-700 font-medium">Net:</span>
                    <span className={`font-bold ${monthSummary.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {monthSummary.net >= 0 ? '+' : ''}{formatCompactCurrency(monthSummary.net)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  {monthSummary.eventCount} transactions
                </div>
              </div>
            );
          })
        ) : (
          // Week/Month view - show days
          calendarDays.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isCurrentMonth = viewMode === 'week' || date.getMonth() === currentDate.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            
            const personalBalance = calculateBalanceForDate(date, 'personal');
            const businessBalance = calculateBalanceForDate(date, 'business');
            
            const dayRevenue = dayEvents.filter(e => e.amount > 0).reduce((sum, e) => sum + e.amount, 0);
            const dayExpenses = dayEvents.filter(e => e.amount < 0).reduce((sum, e) => sum + Math.abs(e.amount), 0);
            
            return (
              <div 
                key={index}
                className={`relative p-2 border-r border-b min-h-32 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                } ${isToday ? 'bg-blue-50 ring-2 ring-blue-500' : ''} ${
                  hoveredDate === date.toDateString() ? 'bg-yellow-50' : ''
                }`}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => setHoveredDate(date.toDateString())}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {/* Date Header */}
                <div className={`font-bold mb-2 flex items-center justify-between ${isToday ? 'text-blue-600' : ''}`}>
                  <span className="text-sm">{date.getDate()}</span>
                  {isToday && <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Today</span>}
                </div>
                
                {/* Balance Predictions - UPDATED TO SHOW FULL AMOUNTS */}
                <div className="space-y-1 mb-2 p-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                  <div className="flex items-center text-xs">
                    <Wallet className="w-3 h-3 mr-1 text-gray-500" />
                    <span className="text-gray-600">P:</span>
                    <span className={`ml-1 font-semibold ${getBalanceColor(personalBalance)}`}>
                      {formatFullCurrency(personalBalance)}
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Building className="w-3 h-3 mr-1 text-gray-500" />
                    <span className="text-gray-600">B:</span>
                    <span className={`ml-1 font-semibold ${getBalanceColor(businessBalance)}`}>
                      {formatFullCurrency(businessBalance)}
                    </span>
                  </div>
                </div>

                {/* Day Summary */}
                {(dayRevenue > 0 || dayExpenses > 0) && (
                  <div className="text-xs mb-2 p-1 bg-white rounded border border-gray-200">
                    {dayRevenue > 0 && (
                      <div className="text-green-600 font-medium">+{formatCompactCurrency(dayRevenue)}</div>
                    )}
                    {dayExpenses > 0 && (
                      <div className="text-red-600 font-medium">-{formatCompactCurrency(dayExpenses)}</div>
                    )}
                  </div>
                )}

                {/* Events */}
                <div className="space-y-1">
                  {dayEvents.slice(0, viewMode === 'week' ? 3 : 2).map(event => (
                    <div 
                      key={event.id}
                      className={`text-xs p-1 rounded ${getLikelihoodColor(event.likelihood)} text-white truncate flex items-center`}
                      title={`${event.title} - ${formatCurrency(event.amount)}`}
                    >
                      {event.isRecurring && <Repeat className="w-2 h-2 mr-1" />}
                      <span className="truncate">{event.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > (viewMode === 'week' ? 3 : 2) && (
                    <div className="text-xs text-gray-500 font-medium flex items-center">
                      <ChevronRight className="w-3 h-3" />
                      +{dayEvents.length - (viewMode === 'week' ? 3 : 2)} more
                    </div>
                  )}
                </div>

                {/* Low Balance Warning */}
                {(personalBalance < 500 || businessBalance < 500) && (
                  <div className="absolute top-1 right-1">
                    <AlertCircle className="w-4 h-4 text-orange-500" title="Low balance warning" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Updated Event Modal - Now creates transactions */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
      />
    </div>
  );
}
