
import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  expired: boolean;
}

export const useCountdown = (targetDate: Date) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = targetDate.getTime() - new Date().getTime();
    
    // Force the expired state for testing if needed
    // const difference = -1; // Uncomment to force expired state
    
    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        expired: true
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      expired: false
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [targetDate]);

  const formattedTimeLeft = timeLeft.expired 
    ? 'Time expired' 
    : timeLeft.days > 1 
      ? `${timeLeft.days}d` 
      : `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`;

  return { timeLeft, formattedTimeLeft };
};
