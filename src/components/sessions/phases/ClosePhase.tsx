
import { useState } from 'react';
import { useSession } from '@/context/SessionContext';
import { useNavigate } from 'react-router-dom';
import { Session } from '@/types';
import { toast } from "sonner";
import TeamHealthMetricsSummary from './close/TeamHealthMetricsSummary';
import TeamHealthChart from './TeamHealthChart';
import ActionItemsList from './close/ActionItemsList';
import ConfidenceQuestion from './close/ConfidenceQuestion';
import ExitButton from './close/ExitButton';

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
      <ConfidenceQuestion />

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

      {/* Exit Button */}
      <ExitButton onExit={handleFinish} />
    </div>
  );
}
