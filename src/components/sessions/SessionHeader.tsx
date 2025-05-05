
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import React from "react";
import { Check } from "lucide-react";

// Dummy current user data (replace with actual user info in a real app)
const currentUser = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    avatarUrl: "",
};

interface SessionHeaderProps {
    activePhase: "welcome" | "survey" | "discuss" | "review" | "close";
    onPhaseChange: (phase: "welcome" | "survey" | "discuss" | "review" | "close") => void;
    isParticipant: boolean;
    sessionCurrentPhase: "welcome" | "survey" | "discuss" | "review" | "close";
}

export function SessionHeader({ activePhase, onPhaseChange, isParticipant, sessionCurrentPhase }: SessionHeaderProps) {
    const phases = ["welcome", "survey", "discuss", "review", "close"];
    const activeIndex = phases.indexOf(activePhase);
    
    // Calculate progress percentage
    const progressPercentage = Math.max((activeIndex / (phases.length - 1)) * 100, 0);
    
    // Determine which phases are complete, active, or upcoming
    const getPhaseStatus = (phase: string, index: number) => {
        if (index < activeIndex) return "complete";
        if (index === activeIndex) return "active";
        return "upcoming";
    };

    return (
        <header className="w-full flex justify-center border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="w-full max-w-screen-3xl flex flex-col py-3 px-4 md:px-8">
                <div className="flex items-center justify-between mb-4">
                    {/* Logo & name */}
                    <Link to="/" className="flex items-center space-x-2 shrink-0">
                        <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                            TP
                        </div>
                        <span className="text-xl font-bold hidden md:block">Team Pulse</span>
                    </Link>
                    
                    {/* User info */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="flex flex-col text-right max-w-[160px]">
                            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                                {currentUser.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</span>
                        </div>
                        <Avatar className="h-9 w-9 ml-2">
                            {currentUser.avatarUrl ? (
                                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                            ) : (
                                <AvatarFallback>
                                    {currentUser.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2)}
                                </AvatarFallback>
                            )}
                        </Avatar>
                    </div>
                </div>
                
                {/* Progress indicator */}
                <div className="relative w-full px-2">
                    {/* Progress bar */}
                    <div className="mb-8">
                        <Progress 
                            value={progressPercentage} 
                            className="h-2 bg-gray-200"
                            style={{ 
                                "--primary": "#E15D2F", 
                                "--secondary": "#e9e9e9" 
                            } as React.CSSProperties} 
                        />
                    </div>
                    
                    {/* Phase indicators */}
                    <div className="flex justify-between w-full absolute -top-3">
                        {phases.map((phase, index) => {
                            const status = getPhaseStatus(phase, index);
                            const isClickable = !isParticipant || phase === sessionCurrentPhase;
                            
                            const displayName = phase.charAt(0).toUpperCase() + phase.slice(1);
                            
                            return (
                                <div 
                                    key={phase}
                                    className={`flex flex-col items-center ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                    onClick={() => isClickable && onPhaseChange(phase as "welcome" | "survey" | "discuss" | "review" | "close")}
                                >
                                    <div 
                                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                                            status === 'complete' 
                                                ? 'bg-[#E15D2F] border-[#E15D2F] text-white' 
                                                : status === 'active'
                                                ? 'bg-white border-[#E15D2F] text-[#E15D2F]'
                                                : 'bg-white border-gray-300 text-gray-300'
                                        }`}
                                    >
                                        {status === 'complete' ? (
                                            <Check className="w-3 h-3" />
                                        ) : (
                                            <span className="text-xs">{index + 1}</span>
                                        )}
                                    </div>
                                    <span 
                                        className={`text-xs mt-1 whitespace-nowrap ${
                                            status === 'complete' || status === 'active' 
                                                ? 'text-gray-800 font-medium' 
                                                : 'text-gray-400'
                                        }`}
                                    >
                                        {displayName}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </header>
    );
}
