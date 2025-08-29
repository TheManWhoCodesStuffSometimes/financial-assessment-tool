/**
 * Date utility functions for the finance calendar
 */

export const formatCurrency = (amount) => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absAmount);
  
  return isNegative ? `-${formatted}` : formatted;
};

export const formatCompactCurrency = (amount) => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  if (absAmount >= 1000000) {
    return `${isNegative ? '-' : ''}${(absAmount / 1000000).toFixed(1)}M`;
  } else if (absAmount >= 1000) {
    return `${isNegative ? '-' : ''}${(absAmount / 1000).toFixed(1)}K`;
  } else {
    return `${isNegative ? '-' : ''}${absAmount}`;
  }
};

export const getWeekStart = (date) => {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  start.setHours(0, 0, 0, 0);
  return start;
};

export const getWeekEnd = (date) => {
  const end = new Date(date);
  end.setDate(end.getDate() - end.getDay() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

export const getMonthStart = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getMonthEnd = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export const getQuarterStart = (date) => {
  const quarterStart = Math.floor(date.getMonth() / 3) * 3;
  return new Date(date.getFullYear(), quarterStart, 1);
};

export const getQuarterEnd = (date) => {
  const quarterStart = Math.floor(date.getMonth() / 3) * 3;
  return new Date(date.getFullYear(), quarterStart + 3, 0);
};

export const isDateInRange = (date, startDate, endDate) => {
  return date >= startDate && date <= endDate;
};

export const isSameDay = (date1, date2) => {
  return date1.toDateString() === date2.toDateString();
};

export const isSameMonth = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() && 
         date1.getMonth() === date2.getMonth();
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getMonthName = (date) => {
  return date.toLocaleDateString('en-US', { month: 'long' });
};

export const getShortMonthName = (date) => {
  return date.toLocaleDateString('en-US', { month: 'short' });
};

export const formatDateRange = (startDate, endDate) => {
  if (isSameMonth(startDate, endDate)) {
    return `${getMonthName(startDate)} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`;
  } else if (startDate.getFullYear() === endDate.getFullYear()) {
    return `${getShortMonthName(startDate)} ${startDate.getDate()} - ${getShortMonthName(endDate)} ${endDate.getDate()}, ${startDate.getFullYear()}`;
  } else {
    return `${getShortMonthName(startDate)} ${startDate.getDate()}, ${startDate.getFullYear()} - ${getShortMonthName(endDate)} ${endDate.getDate()}, ${endDate.getFullYear()}`;
  }
};

export const getFinancialProjection = (events, startDate, endDate) => {
  const projectionData = {
    totalRevenue: 0,
    totalExpenses: 0,
    netChange: 0,
    confirmedRevenue: 0,
    potentialRevenue: 0,
    eventsByLikelihood: {
      confirmed: 0,
      high: 0,
      medium: 0,
      low: 0
    }
  };

  events
    .filter(event => isDateInRange(event.date, startDate, endDate))
    .forEach(event => {
      if (event.amount > 0) {
        projectionData.totalRevenue += event.amount;
        if (event.likelihood === 'confirmed') {
          projectionData.confirmedRevenue += event.amount;
        } else {
          projectionData.potentialRevenue += event.amount;
        }
      } else {
        projectionData.totalExpenses += Math.abs(event.amount);
      }
      
      projectionData.eventsByLikelihood[event.likelihood] += 1;
    });

  projectionData.netChange = projectionData.totalRevenue - projectionData.totalExpenses;
  
  return projectionData;
};

export const calculateMonthsToGoal = (currentAmount, goalAmount, monthlyChange) => {
  if (monthlyChange <= 0) return null;
  const remaining = goalAmount - currentAmount;
  if (remaining <= 0) return 0;
  return Math.ceil(remaining / monthlyChange);
};

export const getProbabilityMultiplier = (likelihood) => {
  const multipliers = {
    confirmed: 1.0,
    high: 0.85,
    medium: 0.55,
    low: 0.2
  };
  return multipliers[likelihood] || 0.5;
};

export const calculateWeightedProjection = (events, startDate, endDate) => {
  return events
    .filter(event => isDateInRange(event.date, startDate, endDate))
    .reduce((sum, event) => {
      const multiplier = getProbabilityMultiplier(event.likelihood);
      return sum + (event.amount * multiplier);
    }, 0);
};
