
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SessionPhases from '@/components/sessions/SessionPhases';

const JoinSession = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { sessions, addParticipant } = useSession();
  
  const [name, setName] = useState('');
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  const session = sessions.find(s => s.id === sessionId);

  useEffect(() => {
    // Check if user already joined this session (in localStorage)
    const savedParticipantId = localStorage.getItem(`participant_${sessionId}`);
    if (savedParticipantId) {
      setParticipantId(savedParticipantId);
    }
  }, [sessionId]);

  const handleJoin = () => {
    if (!session) return;
    
    setIsJoining(true);
    
    try {
      let displayName = name;
      if (session.isAnonymous) {
        displayName = `Anonymous User`;
      }
      
      const newParticipantId = addParticipant({ name: displayName });
      setParticipantId(newParticipantId);
      
      // Save in localStorage to remember this participant
      localStorage.setItem(`participant_${sessionId}`, newParticipantId);
      
      setIsJoining(false);
    } catch (error) {
      console.error("Error joining session:", error);
      setIsJoining(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Session Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The session you're trying to join doesn't exist or has been deleted.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!participantId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Join Session: {session.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {!session.isAnonymous && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            {session.isAnonymous && (
              <p className="text-muted-foreground mb-4">
                This is an anonymous session. Your identity will not be shared with others.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleJoin} 
              className="w-full"
              disabled={isJoining || (!session.isAnonymous && !name)}
            >
              {isJoining ? "Joining..." : "Join Session"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              TP
            </div>
            <span className="text-xl font-bold">Team Pulse</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Session: {session.name}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>
              {session.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SessionPhases 
              session={session} 
              isParticipant={true}
              participantId={participantId}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default JoinSession;
