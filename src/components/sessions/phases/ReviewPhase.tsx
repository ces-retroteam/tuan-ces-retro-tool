
import { Session } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ReviewPhaseProps {
  session: Session;
  isParticipant?: boolean;
}

export default function ReviewPhase({ session, isParticipant = false }: ReviewPhaseProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Results</CardTitle>
        <CardDescription>
          Review the collected feedback and responses from the team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-muted-foreground">
            This section will display aggregate results from your team's responses.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
