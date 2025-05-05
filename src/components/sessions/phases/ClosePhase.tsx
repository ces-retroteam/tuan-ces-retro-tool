
import { useState } from 'react';
import { useSession } from '@/context/SessionContext';
import { useNavigate } from 'react-router-dom';
import { Session } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";
import { Check } from "lucide-react";
import TeamHealthMetricsSummary from './close/TeamHealthMetricsSummary';
import TeamHealthChart from './TeamHealthChart';
import ActionItemsList from './close/ActionItemsList';

interface ClosePhaseProps {
  session: Session;
  isParticipant?: boolean;
}

export default function ClosePhase({ session, isParticipant = false }: ClosePhaseProps) {
  const navigate = useNavigate();
  const { comments, actions, addAction } = useSession();
  const [newAction, setNewAction] = useState({ text: '', assignee: '', priority: 'medium', questionId: '' });
  
  const sessionComments = comments.filter(c => c.sessionId === session.id);
  const sessionActions = actions.filter(a => a.sessionId === session.id);
  
  // Calculate metrics for summary
  const avgScoreAllTopics = "3.8";
  const totalComments = sessionComments.length;
  const totalActionItems = sessionActions.length;
  const totalParticipants = 5; // Would ideally come from actual participants count
  
  const handleAddAction = () => {
    if (newAction.text) {
      addAction({
        sessionId: session.id,
        questionId: newAction.questionId || undefined,
        text: newAction.text,
        assignee: newAction.assignee || undefined,
        priority: newAction.priority as 'low' | 'medium' | 'high',
        status: 'open',
      });
      
      setNewAction({ text: '', assignee: '', priority: 'medium', questionId: '' });
      toast.success("Action item added successfully!");
    }
  };
  
  const handleFinish = () => {
    navigate('/');
  };

  return (
    <div className="space-y-8">
      {/* Metrics Summary Banner */}
      <TeamHealthMetricsSummary 
        avgScore={avgScoreAllTopics}
        actionItems={totalActionItems}
        participationRate="58%"
        totalParticipants={totalParticipants}
      />

      {/* Health Check Results Section */}
      <Card>
        <CardHeader>
          <CardTitle>How confident are you that we will deliver on time?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-6">
            <div className="w-full bg-blue-50 rounded-lg p-4 flex justify-between">
              <div className="flex space-x-6">
                {[1, 2, 3, 4, 5].map((score) => (
                  <div key={score} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      score === 3 ? 'bg-orange-400 text-white' : 'bg-gray-100'
                    }`}>
                      {score}
                    </div>
                    <span className="text-xs mt-1">
                      {score === 1 && "VERY UNCERTAIN"}
                      {score === 2 && "UNCERTAIN"}
                      {score === 3 && "SOMEWHAT UNCERTAIN"}
                      {score === 4 && "CONFIDENT"}
                      {score === 5 && "VERY CONFIDENT"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">No participants responded</p>
          </div>
        </CardContent>
      </Card>

      {/* Team Health Radar Chart */}
      <TeamHealthChart 
        session={session} 
        avgScoreAllTopics={avgScoreAllTopics} 
        totalComments={totalComments}
      />

      {/* Action Items */}
      <ActionItemsList 
        actions={sessionActions}
        session={session}
        isParticipant={isParticipant}
        onAddAction={handleAddAction}
        newAction={newAction}
        setNewAction={setNewAction}
      />

      <Card>
        <CardFooter className="flex justify-center pt-6">
          <Button 
            onClick={handleFinish}
            className="bg-blue-400 hover:bg-blue-500 text-white px-10"
          >
            EXIT
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
