
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Session, Participant as ParticipantType } from "@/types";
import { useSession } from "@/context/SessionContext";

interface ParticipantsListProps {
  session: Session;
}

export function ParticipantsList({ session }: ParticipantsListProps) {
  const { participants } = useSession();

  // Filter participants that are in the current session
  const sessionParticipants = participants.filter(
    (participant) => participant.sessionId === session.id
  );
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Participants</h2>
        <Badge variant="secondary">{sessionParticipants.length}</Badge>
      </div>
      
      {/* Show message if no participants */}
      {sessionParticipants.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No participants have joined this session yet.
        </div>
      ) : (
        <div className="space-y-3">
          {sessionParticipants.map((participant) => (
            <ParticipantRow 
              key={participant.id} 
              participant={participant}
              session={session}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ParticipantRowProps {
  participant: ParticipantType;
  session: Session;
}

function ParticipantRow({ participant, session }: ParticipantRowProps) {
  // For demo purposes, we'll generate some random data
  // In a real app, this would come from actual participant data
  const role = ["Facilitator", "Team Member", "Observer"][Math.floor(Math.random() * 3)];
  const isOnline = Math.random() > 0.3;
  const hasJoined = true; // All participants in the list have joined
  
  // Calculate progress based on how many questions they've answered
  const totalQuestions = session.template.questions.length;
  const answeredQuestions = participant.responses?.length || 0;
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
  
  // Get initials for avatar fallback
  const initials = participant.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-white" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium truncate">{participant.name}</p>
          <Badge 
            variant={role === "Facilitator" ? "default" : "secondary"} 
            className="text-xs py-0 px-2 h-5"
          >
            {role}
          </Badge>
        </div>
        
        <div className="mt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-1.5 mt-1" 
          />
        </div>
      </div>
    </div>
  );
}
