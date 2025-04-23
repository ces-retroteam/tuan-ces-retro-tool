
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { Card, CardContent } from '@/components/ui/card';
import WelcomeDialog from '@/components/sessions/phases/WelcomeDialog';
import { Button } from '@/components/ui/button';
import { Users } from "lucide-react";
import { SessionHeader } from "@/components/sessions/SessionHeader";
import SessionPhases from "@/components/sessions/SessionPhases";

// Helper: detect if viewing as participant or facilitator.
const detectIsParticipant = () => {
  return window.location.pathname.includes("/join/");
};

const PHASES = ["survey", "discuss", "review", "close"] as const;

const SessionPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { sessions, setCurrentSession } = useSession();
  const [welcomeOpen, setWelcomeOpen] = useState(false);

  const session = sessions.find((s) => s.id === sessionId);
  const isParticipant = detectIsParticipant();

  // Tab state: for facilitator, allow phase navigation.
  const [activePhase, setActivePhase] = useState<"welcome" | "survey" | "discuss" | "review" | "close">("survey");

  useEffect(() => {
    if (session && isParticipant) {
      setWelcomeOpen(true);
    }
  }, [session, isParticipant]);

  useEffect(() => {
    if (session) {
      setCurrentSession(session);
      if (isParticipant) {
        setActivePhase(session.currentPhase as "welcome" | "survey" | "discuss" | "review" | "close");
      }
    }
  }, [session, setCurrentSession, isParticipant]);

  // If participant, listen to session's currentPhase changes
  useEffect(() => {
    if (session && isParticipant && activePhase !== session.currentPhase) {
      setActivePhase(session.currentPhase as "welcome" | "survey" | "discuss" | "review" | "close");
    }
  }, [session, isParticipant, activePhase]);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold mb-4">Session Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The session you're looking for doesn't exist or has been deleted.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handlePhaseChange = (phase: "welcome" | "survey" | "discuss" | "review" | "close") => {
    if (!isParticipant) {
      setActivePhase(phase);
      // (Facilitator-only logic assumed)
      setCurrentSession({
        ...session,
        currentPhase: phase,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Session Header */}
      <SessionHeader
        activePhase={activePhase}
        onPhaseChange={handlePhaseChange}
        isParticipant={isParticipant}
        sessionCurrentPhase={session.currentPhase as "welcome" | "survey" | "discuss" | "review" | "close"}
      />
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <Card>
              <CardContent className="p-6">
                <SessionPhases 
                  session={session} 
                  isParticipant={isParticipant} 
                  participantId={undefined} 
                  activePhase={activePhase}
                />
              </CardContent>
            </Card>
          </div>
          {/* Right Sidebar */}
          <aside className="w-full md:w-72 flex-shrink-0 mt-6 md:mt-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col gap-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <Users className="w-5 h-5" />
                Invite teammates
              </h2>
              <Button
                variant="default"
                size="lg"
                onClick={() => setWelcomeOpen(true)}
                className="w-full"
              >
                Invite
              </Button>
            </div>
          </aside>
        </div>
      </main>
      <WelcomeDialog 
        session={session} 
        open={welcomeOpen}
        onOpenChange={setWelcomeOpen}
        isParticipant={isParticipant}
      />
    </div>
  );
};

export default SessionPage;
