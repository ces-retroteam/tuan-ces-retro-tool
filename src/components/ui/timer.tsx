
import React, { useState, useEffect } from "react";
import { Timer as TimerIcon, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TimerProps {
  duration: number; // in seconds
  onExpire?: () => void;
  autoStart?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  showControls?: boolean;
  isPaused?: boolean;
}

export function Timer({
  duration,
  onExpire,
  autoStart = true,
  className,
  size = "md",
  showControls = false,
  isPaused = false,
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(autoStart);
  
  // Convert seconds to minutes and seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  // Calculate percentage for visual indication
  const percentageLeft = (timeLeft / duration) * 100;
  
  // Determine color based on time left
  const getColor = () => {
    if (percentageLeft > 50) return "text-green-600";
    if (percentageLeft > 20) return "text-yellow-500";
    return "text-red-500";
  };
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && !isPaused && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && onExpire) {
      onExpire();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onExpire, isPaused]);
  
  // Reset timer to original duration
  const resetTimer = () => {
    setTimeLeft(duration);
    setIsActive(autoStart);
  };
  
  // Toggle timer between active and paused
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // If duration changes, update the time left
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  return (
    <div className={cn(
      "flex items-center gap-2",
      size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base",
      className
    )}>
      <div className={cn(
        "flex items-center gap-1",
        getColor()
      )}>
        <TimerIcon className="w-4 h-4" />
        <span className="font-mono font-bold">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
      
      {showControls && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTimer}
            className="h-6 w-6 p-0"
          >
            {isActive ? "⏸" : "▶️"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetTimer}
            className="h-6 w-6 p-0"
          >
            <TimerReset className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
