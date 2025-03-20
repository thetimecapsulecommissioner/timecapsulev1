
import { subHours, subDays, format, startOfDay, endOfDay, isSameDay, isSameHour } from 'date-fns';

// Activity data types
export type ActivityMetrics = {
  siteVisits: number[];
  averageTimeSpent: number[];
  logins: number[];
  labels: string[];
};

export type TimeFrame = '24hours' | '7days' | '30days' | 'custom';

// Function to get formatted date ranges
export const getDateRange = (timeframe: TimeFrame, customRange?: { start: Date; end: Date }) => {
  const now = new Date();
  
  switch (timeframe) {
    case '24hours':
      return {
        start: subHours(now, 24),
        end: now,
        format: 'ha', // 1PM, 2PM, etc.
        steps: 24
      };
    case '7days':
      return {
        start: subDays(now, 7),
        end: now,
        format: 'EEE', // Mon, Tue, etc.
        steps: 7
      };
    case '30days':
      return {
        start: subDays(now, 30),
        end: now,
        format: 'MMM d', // Jan 1, Jan 2, etc.
        steps: 30
      };
    case 'custom':
      if (!customRange) {
        return {
          start: subDays(now, 7),
          end: now,
          format: 'MMM d',
          steps: 7
        };
      }
      
      // Calculate days between dates for custom range
      const diffTime = Math.abs(customRange.end.getTime() - customRange.start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      return {
        start: startOfDay(customRange.start),
        end: endOfDay(customRange.end),
        format: 'MMM d',
        steps: diffDays
      };
  }
};

// Process activity data for the selected timeframe
export const processActivityData = (
  activities: any[],
  timeframe: TimeFrame,
  customRange?: { start: Date; end: Date }
): ActivityMetrics => {
  const { start, end, format: dateFormat, steps } = getDateRange(timeframe, customRange);
  
  // Initialize arrays with zeros
  const siteVisits = Array(steps).fill(0);
  const timeSpentSum = Array(steps).fill(0);
  const timeSpentCount = Array(steps).fill(0);
  const logins = Array(steps).fill(0);
  const labels = [];
  
  // Generate labels based on timeframe
  for (let i = 0; i < steps; i++) {
    let date;
    
    if (timeframe === '24hours') {
      date = subHours(end, steps - i - 1);
      labels.push(format(date, dateFormat));
    } else {
      date = subDays(end, steps - i - 1);
      labels.push(format(date, dateFormat));
    }
  }
  
  // Process each activity
  activities.forEach(activity => {
    const activityDate = new Date(activity.timestamp);
    
    // Skip if activity is outside our time range
    if (activityDate < start || activityDate > end) return;
    
    // Calculate which bucket this activity belongs to
    let index;
    
    if (timeframe === '24hours') {
      for (let i = 0; i < steps; i++) {
        const hourDate = subHours(end, steps - i - 1);
        if (isSameHour(hourDate, activityDate)) {
          index = i;
          break;
        }
      }
    } else {
      for (let i = 0; i < steps; i++) {
        const dayDate = subDays(end, steps - i - 1);
        if (isSameDay(dayDate, activityDate)) {
          index = i;
          break;
        }
      }
    }
    
    if (index === undefined) return;
    
    // Increment site visit count
    if (activity.event_type === 'page_view') {
      siteVisits[index] += 1;
    }
    
    // Track session duration
    if (activity.session_duration) {
      timeSpentSum[index] += activity.session_duration;
      timeSpentCount[index] += 1;
    }
    
    // Increment login count
    if (activity.event_type === 'login') {
      logins[index] += 1;
    }
  });
  
  // Calculate average time spent (in seconds)
  const averageTimeSpent = timeSpentSum.map((sum, i) => 
    timeSpentCount[i] > 0 ? Math.round(sum / timeSpentCount[i]) : 0
  );
  
  return {
    siteVisits,
    averageTimeSpent,
    logins,
    labels
  };
};
