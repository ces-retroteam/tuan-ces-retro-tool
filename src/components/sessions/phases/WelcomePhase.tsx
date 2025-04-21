
import { useState } from 'react';
import { useSession } from '@/context/SessionContext';
import { Session } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';

interface WelcomePhaseProps {
  session: Session;
  isParticipant?: boolean;
  onBeginSurvey?: () => void; // New prop
}

export default function WelcomePhase({ session, isParticipant = false, onBeginSurvey }: WelcomePhaseProps) {
  const { updateSession } = useSession();
  const [copying, setCopying] = useState(false);

  const sessionLink = `${window.location.origin}/join/${session.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sessionLink);
    setCopying(true);

    setTimeout(() => {
      setCopying(false);
    }, 2000);
  };

  // Remove the local handleNext, use the onBeginSurvey prop for the button
  const handleNext = () => {
    if (!isParticipant && onBeginSurvey) {
      onBeginSurvey();
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

        {/* Share/QR Row */}
        {!isParticipant && (
          <div className="bg-accent p-4 rounded-lg flex flex-col md:flex-row items-center gap-6">
            {/* Share Link */}
            <div className="flex-1 w-full flex flex-col mb-4 md:mb-0">
              <h3 className="text-lg font-medium mb-2">Share With Your Team</h3>
              <p className="text-sm mb-4">
                Invite participants by sharing this link:
              </p>
              <div className="flex items-center space-x-2">
                <div className="bg-background p-2 rounded border flex-1 truncate">
                  {sessionLink}
                </div>
                <Button onClick={handleCopyLink} variant="secondary" size="sm">
                  {copying ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
            {/* QR Code */}
            <div className="flex-shrink-0 flex justify-center items-center p-2">
              <div className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground mb-2">Or Scan to Join</span>
                <QRCodeSVG
                  value={sessionLink}
                  size={180}
                  bgColor="#fff"
                  fgColor="#E15D2F"
                  includeMargin={true}
                  style={{ borderRadius: 12, border: '2px solid #eee', background: '#fff' }}
                />
              </div>
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
