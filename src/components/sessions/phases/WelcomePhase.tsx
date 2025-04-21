
import { useState } from 'react';
import { useSession } from '@/context/SessionContext';
import { Session } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WelcomePhaseProps {
  session: Session;
  isParticipant?: boolean;
}

export default function WelcomePhase({ session, isParticipant = false }: WelcomePhaseProps) {
  const { updateSession } = useSession();
  const [copying, setCopying] = useState(false);
  
  const handleCopyLink = () => {
    const sessionLink = `${window.location.origin}/join/${session.id}`;
    navigator.clipboard.writeText(sessionLink);
    setCopying(true);
    
    setTimeout(() => {
      setCopying(false);
    }, 2000);
  };
  
  const handleNext = () => {
    if (!isParticipant) {
      const updatedSession = {
        ...session,
        currentPhase: 'survey' as const
      };
      updateSession(updatedSession);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Welcome to {session.name}</CardTitle>
        <CardDescription>{session.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">About This Session</h3>
          <p className="text-muted-foreground">
            This session uses the <strong>{session.template.name}</strong> template to gather feedback
            about your team's health and dynamics.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">How It Works</h3>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>We'll start with a <strong>survey</strong> to collect everyone's feedback.</li>
            <li>Then we'll move to <strong>discussion</strong> to review results together.</li>
            <li>Finally, we'll <strong>close</strong> by identifying actions to address key issues.</li>
          </ol>
        </div>
        
        {!isParticipant && (
          <div className="bg-accent p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Share With Your Team</h3>
            <p className="text-sm mb-4">
              Invite participants by sharing this link:
            </p>
            <div className="flex items-center space-x-2">
              <div className="bg-background p-2 rounded border flex-1 truncate">
                {`${window.location.origin}/join/${session.id}`}
              </div>
              <Button onClick={handleCopyLink} variant="secondary" size="sm">
                {copying ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {!isParticipant && (
          <Button onClick={handleNext}>
            Begin Survey
          </Button>
        )}
        {isParticipant && (
          <p className="text-sm text-muted-foreground">
            Please wait for the facilitator to begin the survey.
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
