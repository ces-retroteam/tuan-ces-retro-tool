import { useState, useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { Session } from '@/types';
import { Card } from '@/components/ui/card';
import RadarChartSection from './RadarChartSection';

interface DiscussPhaseProps {
  session: Session;
  isParticipant?: boolean;
}

export default function DiscussPhase({ session, isParticipant = false }: DiscussPhaseProps) {
  const { participants } = useSession();
  const [aggregatedResponses, setAggregatedResponses] = useState<Record<string, any>>({});
  
  useEffect(() => {
    const relevantParticipants = participants.filter(p => 
      p.responses && p.responses.some(r => r.questionId === session.template.questions[0].id)
    );
    
    const agg: Record<string, any> = {};
    
    session.template.questions.forEach((question) => {
      if (question.type === 'scale') {
        const responses = relevantParticipants
          .map(p => p.responses?.find(r => r.questionId === question.id))
          .filter(Boolean);
        
        const sum = responses.reduce((acc, r) => acc + (Number(r.value) || 0), 0);
        const avg = responses.length > 0 ? sum / responses.length : 0;
        
        agg[question.id] = {
          average: Math.round(avg * 10) / 10,
          count: responses.length
        };
      }
    });
    
    setAggregatedResponses(agg);
  }, [participants, session.template.questions]);

  const radarData = session.template.questions
    .filter(q => q.type === "scale")
    .map(question => {
      const item = aggregatedResponses[question.id];
      return {
        label: question.text,
        average: item ? item.average : 0,
        commentCount: 0,
        color: "#E76F51"
      };
    });

  return (
    <div className="bg-white rounded-lg">
      <RadarChartSection data={radarData} />
    </div>
  );
}
