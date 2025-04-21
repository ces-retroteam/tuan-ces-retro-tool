
import { useState, useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { Session } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import RadarChartSection from './RadarChartSection';

interface DiscussPhaseProps {
  session: Session;
  isParticipant?: boolean;
}

export default function DiscussPhase({ session, isParticipant = false }: DiscussPhaseProps) {
  const { updateSession, participants } = useSession();
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

  const handleNext = () => {
    if (!isParticipant) {
      const updatedSession = {
        ...session,
        currentPhase: 'review' as const
      };
      updateSession(updatedSession);
    }
  };

  const radarData = session.template.questions
    .filter(q => q.type === "scale")
    .map(question => {
      const item = aggregatedResponses[question.id];
      let color = "#F97316"; // orange (default)
      if (item?.average === 5) color = "#5E9323"; // green for perfect
      return {
        label: question.text,
        average: item ? item.average : 1,
        commentCount: 0,
        color
      };
    });

  return (
    <div className="bg-white">
      <RadarChartSection data={radarData} />

      <div className="space-y-3 px-4 pb-7">
        {session.template.questions.filter(q => q.type === "scale").map((question) => {
          const data = aggregatedResponses[question.id];
          const avg = data ? data.average : 1;
          const isPerfect = avg === 5;
          return (
            <div
              key={question.id}
              className={`
                bg-white 
                rounded-lg 
                px-6 py-4 
                flex 
                items-center 
                gap-6 
                shadow-sm 
                border 
                ${isPerfect 
                  ? "border-green-500 shadow-green-100" 
                  : "border-orange-500 shadow-orange-100"
                }
              `}
            >
              <div
                className={`
                  w-16 
                  h-16 
                  flex 
                  flex-col 
                  items-center 
                  justify-center 
                  rounded-full 
                  font-bold 
                  text-xl
                  ${isPerfect 
                    ? "bg-green-500 text-white" 
                    : "bg-orange-500 text-white"
                  }
                `}
              >
                {avg.toFixed(1)}
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-lg font-semibold text-gray-900">{question.text}</span>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`
                    rounded-full 
                    px-3 
                    py-1 
                    text-sm 
                    font-bold
                    ${isPerfect 
                      ? "bg-green-100 text-green-800" 
                      : "bg-orange-100 text-orange-800"
                    }
                  `}>
                    {avg.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Card className="m-6 bg-white border border-gray-200">
        <CardContent className="p-6">
          {!isParticipant && (
            <div className="flex justify-end mt-4">
              <Button 
                onClick={handleNext}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium"
              >
                Proceed to Review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

