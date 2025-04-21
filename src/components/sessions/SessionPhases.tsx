
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { Session } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WelcomePhase from './phases/WelcomePhase';
import SurveyPhase from './phases/SurveyPhase';
import DiscussPhase from './phases/DiscussPhase';
import ClosePhase from './phases/ClosePhase';
import ReviewPhase from './phases/ReviewPhase';

interface SessionPhasesProps {
  session: Session;
  isParticipant?: boolean;
  participantId?: string;
}

export default function SessionPhases({ session, isParticipant = false, participantId }: SessionPhasesProps) {
  const navigate = useNavigate();
  const { updateSession } = useSession();
  const [activeTab, setActiveTab] = useState(session.currentPhase);
  
  const handlePhaseChange = (phase: 'welcome' | 'survey' | 'discuss' | 'review' | 'close') => {
    if (!isParticipant) {
      const updatedSession = {
        ...session,
        currentPhase: phase
      };
      updateSession(updatedSession);
      setActiveTab(phase);
    }
  };

  const handleBeginSurvey = () => {
    handlePhaseChange('survey');
  };

  return (
    <div className="w-full">
      <Tabs 
        value={isParticipant ? session.currentPhase : activeTab} 
        onValueChange={(value) => handlePhaseChange(value as any)}
        className="w-full"
      >
        <div className="mb-4">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger 
              value="welcome" 
              disabled={isParticipant && session.currentPhase !== 'welcome'}
            >
              Welcome
            </TabsTrigger>
            <TabsTrigger 
              value="survey" 
              disabled={isParticipant && session.currentPhase !== 'survey'}
            >
              Survey
            </TabsTrigger>
            <TabsTrigger 
              value="discuss" 
              disabled={isParticipant && session.currentPhase !== 'discuss'}
            >
              Discuss
            </TabsTrigger>
            <TabsTrigger 
              value="review" 
              disabled={isParticipant && session.currentPhase !== 'review'}
            >
              Review
            </TabsTrigger>
            <TabsTrigger 
              value="close" 
              disabled={isParticipant && session.currentPhase !== 'close'}
            >
              Close
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="welcome">
          <WelcomePhase session={session} isParticipant={isParticipant} onBeginSurvey={handleBeginSurvey} />
        </TabsContent>
        
        <TabsContent value="survey">
          <SurveyPhase 
            session={session} 
            isParticipant={isParticipant} 
            participantId={participantId} 
          />
        </TabsContent>
        
        <TabsContent value="discuss">
          <DiscussPhase session={session} isParticipant={isParticipant} />
        </TabsContent>
        
        <TabsContent value="review">
          <ReviewPhase session={session} isParticipant={isParticipant} />
        </TabsContent>
        
        <TabsContent value="close">
          <ClosePhase session={session} isParticipant={isParticipant} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
