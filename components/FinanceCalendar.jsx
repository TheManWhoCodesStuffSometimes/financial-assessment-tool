import { useState, useMemo } from 'react';
import EventModal from './EventModal';

export default function FinanceCalendar({ viewMode, eventFilters }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([
    // Mock events for demonstration
    {
      id: 1,
      title: "Client Payment - ABC Corp",
      amount: 5000,
      type: "revenue",
      likelihood: "confirmed",
      date: new Date(2025, 7, 30), // August 30, 2025
      description: "Monthly retainer payment"
    },
    {
      id: 2,
      title: "New Client Prospect - XYZ Ltd",
      amount: 1500,
      type: "revenue",
      likelihood: "medium",
      date: new Date(2025, 8, 15), // September 15, 2025
      description: "Potential new automation project"
    },
    {
      id: 3,
      title: "Office Rent",
      amount: -800,
      type: "expense",
      likelihood: "confirmed",
      date: new Date(2025, 8, 1), // September 1, 2025
      description: "Monthly office space rental"
    },
    {
      id: 4,
      title: "Large Enterprise Deal",
      amount: 15000,
      type: "revenue",
      likelihood: "low",
      date: new Date(2025, 9, 10), // October 10, 2025
      description: "Multi-month automation overhaul"
    }
  ]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => eventFilters[event.likelihood]);
  }, [events, eventFilters]);

  const getLikelihoodColor = (likelihood) => {
    const colors = {
      confirmed: 'bg-green-500',
      high: 'bg-blue-500',
      medium: 'bg-yellow-500',
      low: 'bg-red-500'
    };
    return colors[likelihood] || 'bg-gray-500';
  };

  const getLikelihoodTextColor = (likelihood) => {
    const colors = {
      confirmed: 'text-green-700',
      high: 'text-blue-700',
      medium: 'text-yellow-700',
      low: 'text-red-700'
    };
    return colors[likelihood] || 'text-gray-700';
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
      
      // Start from the beginning of the week containing the first day
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - startDate.getDay());
      
      // End at the end of the week containing the last day
      const endDate = new Date(lastDay);
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
      
      const current = new Date(startDate);
      while (current <= endDate) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      return days;
    } else if (viewMode === 'quarter') {
      // For quarter view, show months as grid items
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

  const getTotalForDate = (date) => {
    const dateEvents = getEventsForDate(date);
    return dateEvents.reduce((sum, event) => sum + event.amount, 0);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleAddEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: events.length + 1,
      date: selectedDate
    };
    setEvents([...events, newEvent]);
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

  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">{formatDateHeader()}</h3>
        <div className="flex space-x-1">
          <button
            onClick={() => navigateDate(-1)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={() => navigateDate(1)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className={`grid ${viewMode === 'quarter' ? 'grid-cols-3' : viewMode === 'week' ? 'grid-cols-7' : 'grid-cols-7'}`}>
        {viewMode !== 'quarter' && (
          <>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 text-center border-r border-b">
                {day}
              </div>
            ))}
          </>
        )}

        {viewMode === 'quarter' ? (
          // Quarter view - show months
          calendarDays.map((month, index) => {
            const monthEvents = filteredEvents.filter(event => 
              event.date.getMonth() === month.getMonth() && 
              event.date.getFullYear() === month.getFullYear()
            );
            const monthTotal = monthEvents.reduce((sum, event) => sum + event.amount, 0);
            
            return (
              <div 
                key={index}
                className="p-4 border-r border-b min-h-32 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleDateClick(month)}
              >
                <div className="font-medium text-gray-900 mb-2">
                  {month.toLocaleDateString('en-US', { month: 'long' })}
                </div>
                <div className={`text-sm font-medium ${monthTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${monthTotal.toLocaleString()}
                </div>
                <div className="mt-2 space-y-1">
                  {monthEvents.slice(0, 3).map(event => (
                    <div 
                      key={event.id}
                      className={`text-xs p-1 rounded ${getLikelihoodColor(event.likelihood)} text-white`}
                    >
                      {event.title}
                    </div>
                  ))}
                  {monthEvents.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{monthEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          // Week/Month view - show days
          calendarDays.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const dayTotal = getTotalForDate(date);
            const isCurrentMonth = viewMode === 'week' || date.getMonth() === currentDate.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div 
                key={index}
                className={`p-2 border-r border-b min-h-24 hover:bg-gray-50 cursor-pointer ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''} ${isToday ? 'bg-blue-50' : ''}`}
                onClick={() => handleDateClick(date)}
              >
                <div className={`font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                  {date.getDate()}
                </div>
                {dayTotal !== 0 && (
                  <div className={`text-xs font-medium ${dayTotal >= 0 ? 'text-green-600' : 'text-red-600'} mb-1`}>
                    ${dayTotal.toLocaleString()}
                  </div>
                )}
                <div className="space-y-1">
                  {dayEvents.slice(0, viewMode === 'week' ? 4 : 2).map(event => (
                    <div 
                      key={event.id}
                      className={`text-xs p-1 rounded ${getLikelihoodColor(event.likelihood)} text-white truncate`}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > (viewMode === 'week' ? 4 : 2) && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - (viewMode === 'week' ? 4 : 2)}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onAddEvent={handleAddEvent}
      />
    </div>
  );
}
