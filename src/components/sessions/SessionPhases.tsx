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

  const handlePhaseChange = (phase: 'survey' | 'discuss' | 'review' | 'close') => {
    if (!isParticipant) {
      const updatedSession = {
        ...session,
        currentPhase: phase
      };
      updateSession(updatedSession);
      setActiveTab(phase);
    }
  };

  return (
    <div className="w-full">
      <Tabs 
        value={isParticipant ? session.currentPhase : activeTab} 
        onValueChange={(value) => handlePhaseChange(value as any)}
        className="w-full"
      >
        <div className="mb-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger 
              value="survey" 
              disabled={isParticipant && session.currentPhase !== 'survey'}
              className="data-[state=active]:bg-[#E15D2F] data-[state=active]:text-white"
            >
              Survey
            </TabsTrigger>
            <TabsTrigger 
              value="discuss" 
              disabled={isParticipant && session.currentPhase !== 'discuss'}
              className="data-[state=active]:bg-[#E15D2F] data-[state=active]:text-white"
            >
              Discuss
            </TabsTrigger>
            <TabsTrigger 
              value="review" 
              disabled={isParticipant && session.currentPhase !== 'review'}
              className="data-[state=active]:bg-[#E15D2F] data-[state=active]:text-white"
            >
              Review
            </TabsTrigger>
            <TabsTrigger 
              value="close" 
              disabled={isParticipant && session.currentPhase !== 'close'}
              className="data-[state=active]:bg-[#E15D2F] data-[state=active]:text-white"
            >
              Close
            </TabsTrigger>
          </TabsList>
        </div>

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
