"use client";

import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

const DealCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 35,
    seconds: 42,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center bg-white rounded-lg p-2 sm:p-3 shadow-md border">
      <span className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-xs sm:text-sm text-gray-600 font-medium">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <div className="flex items-center gap-1 sm:gap-2 text-red-700">
        <Timer className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-sm sm:text-base font-semibold">
          Deal Ends In:
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1 sm:gap-2">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Mins" />
        <TimeUnit value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
};

export default DealCountdown;
