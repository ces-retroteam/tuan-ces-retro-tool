
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Timer as TimerIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Timer } from "@/components/ui/timer";
import { SurveyDisplayMode, SurveyPage } from "@/types/survey";

interface TimerConfigProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  duration: number; // in seconds
  onDurationChange: (seconds: number) => void;
  displayMode: SurveyDisplayMode;
  currentPage?: SurveyPage;
  isPaused: boolean;
}

export function TimerConfig({
  isEnabled,
  onToggle,
  duration,
  onDurationChange,
  displayMode,
  currentPage,
  isPaused,
}: TimerConfigProps) {
  // Convert seconds to minutes for input
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    onDurationChange(value * 60 + seconds);
  };
  
  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
    onDurationChange(minutes * 60 + value);
  };

  return (
    <div className="flex flex-col space-y-3 bg-slate-50 p-3 rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TimerIcon className="w-5 h-5 text-slate-600" />
          <h3 className="font-medium text-sm">Timer Settings</h3>
        </div>
        <Switch 
          checked={isEnabled}
          onCheckedChange={onToggle}
        />
      </div>
      
      {isEnabled && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="minutes" className="text-xs">Minutes</Label>
              <Input
                id="minutes"
                type="number"
                min="0"
                value={minutes}
                onChange={handleMinutesChange}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="seconds" className="text-xs">Seconds</Label>
              <Input
                id="seconds"
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={handleSecondsChange}
                className="h-8"
              />
            </div>
          </div>
          
          <div className="text-xs text-slate-500 italic">
            {displayMode === "one-question" && (
              <p>Timer will reset for each question</p>
            )}
            {displayMode === "grouped" && (
              <p>Timer applies to each section ({currentPage})</p>
            )}
            {displayMode === "all-questions" && (
              <p>Timer applies to the entire survey</p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600">Preview:</span>
            <Timer
              duration={duration}
              autoStart={false}
              size="sm"
              isPaused={isPaused}
            />
          </div>
        </div>
      )}
    </div>
  );
}
