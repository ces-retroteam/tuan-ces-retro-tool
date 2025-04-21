
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Session } from "@/types";
import { useNavigate } from "react-router-dom";

interface SessionCardProps {
  session: Session;
}

export default function SessionCard({ session }: SessionCardProps) {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case 'welcome':
        return 'Welcome';
      case 'survey':
        return 'Survey';
      case 'discuss':
        return 'Discussion';
      case 'close':
        return 'Closed';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{session.name}</CardTitle>
            <CardDescription>{session.description}</CardDescription>
          </div>
          <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Template:</span>
            <span>{session.template.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Created:</span>
            <span>{formatDate(session.dateCreated)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Phase:</span>
            <span className="flex items-center">
              <span className={`h-2 w-2 rounded-full mr-1.5 ${getStatusColor(session.status)}`}></span>
              {getPhaseLabel(session.currentPhase)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Anonymous:</span>
            <span>{session.isAnonymous ? "Yes" : "No"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => navigate(`/session/${session.id}`)} className="w-full">
          {session.status === 'active' ? 'Continue Session' : 'View Results'}
        </Button>
      </CardFooter>
    </Card>
  );
}
