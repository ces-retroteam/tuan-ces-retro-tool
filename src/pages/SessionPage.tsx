
import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { Card, CardContent } from '@/components/ui/card';
import WelcomeDialog from '@/components/sessions/phases/WelcomeDialog';
import { Button } from '@/components/ui/button';
import { Users } from "lucide-react";
import { SessionHeader } from "@/components/sessions/SessionHeader";
import SessionPhases from "@/components/sessions/SessionPhases";
import { AnimatePresence, motion } from "framer-motion";
import { ParticipantsList } from "@/components/sessions/phases/review/ParticipantsList";
import { useIsMobile } from "@/hooks/use-mobile";

const detectIsParticipant = () => {
  return window.location.pathname.includes("/join/");
};

const PHASES = ["survey", "discuss", "review", "close"] as const;

const PHASES_ARR: ("welcome" | "survey" | "discuss" | "review" | "close")[] = [
  "welcome",
  "survey",
  "discuss",
  "review",
  "close",
];

const PAGE_ANIMATION = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20, transition: { duration: 0.15 } },
  transition: { duration: 0.26, ease: "easeOut" },
};

const SessionPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { sessions, setCurrentSession } = useSession();
  const [welcomeOpen, setWelcomeOpen] = useState(true);
  const isMobile = useIsMobile();

  const session = sessions.find((s) => s.id === sessionId);
  const isParticipant = detectIsParticipant();

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

  useEffect(() => {
    if (session && isParticipant && activePhase !== session.currentPhase) {
      setActivePhase(session.currentPhase as "welcome" | "survey" | "discuss" | "review" | "close");
    }
  }, [session, isParticipant, activePhase]);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold mb-4 text-textPrimary">Session Not Found</h2>
        <p className="text-textSecondary mb-6">
          The session you're looking for doesn't exist or has been deleted.
        </p>
        <button
          onClick={() => navigate("/")}
          className="btn-primary"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handlePhaseChange = (phase: "welcome" | "survey" | "discuss" | "review" | "close") => {
    if (!isParticipant) {
      setActivePhase(phase);
      setCurrentSession({
        ...session,
        currentPhase: phase,
      });
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <SessionHeader
        activePhase={activePhase}
        onPhaseChange={handlePhaseChange}
        isParticipant={isParticipant}
        sessionCurrentPhase={session.currentPhase as "welcome" | "survey" | "discuss" | "review" | "close"}
      />
      <main className="flex-grow container mx-auto px-6 py-section max-w-screen-2xl">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 min-w-0 relative order-2 md:order-1">
            <Card className="card-hover bg-white border border-gray-200">
              <CardContent className="p-card">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activePhase}
                    variants={PAGE_ANIMATION}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={PAGE_ANIMATION.transition}
                  >
                    <SessionPhases
                      session={session}
                      isParticipant={isParticipant}
                      participantId={undefined}
                      activePhase={activePhase}
                    />
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
          <aside className="w-full md:w-72 flex-shrink-0 order-1 md:order-2">
            <div className="space-y-6">
              {/* Participants List */}
              <ParticipantsList session={session} />
              
              {/* Invite Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-card">
                <h2 className="text-section-title font-semibold text-textPrimary flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-purple" />
                  Invite teammates
                </h2>
                <Button
                  variant="default"
                  size={isMobile ? "default" : "lg"}
                  onClick={() => setWelcomeOpen(true)}
                  className="w-full btn-primary"
                >
                  Invite
                </Button>
              </div>
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
