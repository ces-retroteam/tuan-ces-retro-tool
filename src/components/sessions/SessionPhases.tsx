
import { Session } from "@/types";
import ClosePhase from "./phases/ClosePhase";
import DiscussPhase from "./phases/DiscussPhase";
import ReviewPhase from "./phases/ReviewPhase";
import SurveyPhase from "./phases/SurveyPhase";

interface SessionPhasesProps {
    session: Session;
    isParticipant?: boolean;
    participantId?: string;
    activePhase: "survey" | "discuss" | "review" | "close";
}

// This version now just renders the active panel (tabs now in header)
export default function SessionPhases({ session, isParticipant = false, participantId, activePhase }: SessionPhasesProps) {
    return (
        <div className="w-full">
            {activePhase === "survey" && (
                <SurveyPhase session={session} isParticipant={isParticipant} participantId={participantId} />
            )}
            {activePhase === "discuss" && (
                <DiscussPhase session={session} isParticipant={isParticipant} />
            )}
            {activePhase === "review" && (
                <ReviewPhase session={session} isParticipant={isParticipant} />
            )}
            {activePhase === "close" && (
                <ClosePhase session={session} isParticipant={isParticipant} />
            )}
        </div>
    );
}
