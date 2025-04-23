
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import Layout from '@/components/layout/Layout';
import SessionPhases from '@/components/sessions/SessionPhases';
import { Card, CardContent } from '@/components/ui/card';
import WelcomeDialog from '@/components/sessions/phases/WelcomeDialog';
import { Button } from '@/components/ui/button';
import { Users } from "lucide-react";

// Helper: detect if viewing as participant or facilitator.
const detectIsParticipant = () => {
  // For now, you can adapt logic for participant detection if you store roles.
  // Example: Read query param like ?role=participant, or session.userRole
  // For this sample, assume participants are at "/join/:sessionId" and facilitators at "/session/:sessionId"
  // We'll need an explicit prop/context for robust real-life usage.
  return window.location.pathname.includes("/join/");
};

const SessionPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { sessions, setCurrentSession } = useSession();
  const [welcomeOpen, setWelcomeOpen] = useState(false);

  const session = sessions.find((s) => s.id === sessionId);
  const isParticipant = detectIsParticipant();

  // Show Welcome dialog on first mount if member/participant
  useEffect(() => {
    if (session && isParticipant) {
      setWelcomeOpen(true);
    }
  }, [session, isParticipant]);

  useEffect(() => {
    if (session) {
      setCurrentSession(session);
    }
  }, [session, setCurrentSession]);

  if (!session) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <Card>
            <CardContent className="p-6">
              <SessionPhases session={session} isParticipant={isParticipant} />
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
            {/* Optional content could go here in future */}
          </div>
        </aside>
      </div>
      <WelcomeDialog 
        session={session} 
        open={welcomeOpen}
        onOpenChange={setWelcomeOpen}
        isParticipant={isParticipant}
      />
    </Layout>
  );
};

export default SessionPage;
