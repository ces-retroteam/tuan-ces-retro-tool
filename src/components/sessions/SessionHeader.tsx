import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs component
import React from "react";

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
    return (
        <header className="w-full flex justify-center border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="w-full max-w-screen-3xl flex items-center justify-between py-3 px-4 md:px-8">
                {/* Logo & name */}
                <Link to="/" className="flex items-center space-x-2 shrink-0">
                    <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        TP
                    </div>
                    <span className="text-xl font-bold hidden md:block">Team Pulse</span>
                </Link>
                {/* TABS (centered) */}
                <nav className="flex-1 flex justify-center">
                    <Tabs value={activePhase} className="w-[320px]">
                        <TabsList className="grid grid-cols-4 w-full bg-transparent shadow-none p-0 gap-2">
                            <TabsTrigger
                                value="survey"
                                onClick={() => !isParticipant && onPhaseChange("survey")}
                                disabled={isParticipant && sessionCurrentPhase !== "survey"}
                                className="data-[state=active]:bg-[#E15D2F] data-[state=active]:text-white text-base"
                                tabIndex={0}
                            >
                                Survey
                            </TabsTrigger>
                            <TabsTrigger
                                value="discuss"
                                onClick={() => !isParticipant && onPhaseChange("discuss")}
                                disabled={isParticipant && sessionCurrentPhase !== "discuss"}
                                className="data-[state=active]:bg-[#E15D2F] data-[state=active]:text-white text-base"
                                tabIndex={0}
                            >
                                Discuss
                            </TabsTrigger>
                            <TabsTrigger
                                value="review"
                                onClick={() => !isParticipant && onPhaseChange("review")}
                                disabled={isParticipant && sessionCurrentPhase !== "review"}
                                className="data-[state=active]:bg-[#E15D2F] data-[state=active]:text-white text-base"
                                tabIndex={0}
                            >
                                Review
                            </TabsTrigger>
                            <TabsTrigger
                                value="close"
                                onClick={() => !isParticipant && onPhaseChange("close")}
                                disabled={isParticipant && sessionCurrentPhase !== "close"}
                                className="data-[state=active]:bg-[#E15D2F] data-[state=active]:text-white text-base"
                                tabIndex={0}
                            >
                                Close
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </nav>
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
        </header>
    );
}
