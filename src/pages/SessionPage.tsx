
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import Layout from '@/components/layout/Layout';
import SessionPhases from '@/components/sessions/SessionPhases';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SessionPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { sessions, setCurrentSession } = useSession();

  const session = sessions.find((s) => s.id === sessionId);

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
          <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{session.name}</h1>
          {session.description && (
            <p className="text-muted-foreground mt-1">{session.description}</p>
          )}
        </div>

        <Card>
          <CardContent className="p-6">
            <SessionPhases session={session} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SessionPage;
