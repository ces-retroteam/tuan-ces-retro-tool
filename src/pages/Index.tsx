import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SessionCard from '@/components/sessions/SessionCard';
import SessionTemplateDialog from '@/components/sessions/SessionTemplateDialog';

const Index = () => {
  const { sessions } = useSession();
  const navigate = useNavigate();

  const activeSessions = sessions.filter(session => session.status === 'active');
  const completedSessions = sessions.filter(session => session.status === 'completed');
  const [showDialog, setShowDialog] = useState(false);

  return (
    <Layout>
      <SessionTemplateDialog open={showDialog} onOpenChange={setShowDialog} />
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Team Pulse</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage team health check sessions
            </p>
          </div>
          <Button 
            className="self-start md:self-center"
            onClick={() => setShowDialog(true)}
          >
            Create New Session
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Sessions that are currently in progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeSessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeSessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No active sessions</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setShowDialog(true)}
                  >
                    Create a new session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {completedSessions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Completed Sessions</CardTitle>
                <CardDescription>
                  Review past session results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedSessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="bg-accent">
          <CardHeader>
            <CardTitle>About Team Pulse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                Team Pulse helps you run effective team health checks to identify strengths,
                pain points, and opportunities for improvement.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
