import { useState, useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { Session, Comment, Response } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";
import RadarChartSection from './RadarChartSection';
import { MessageSquare } from "lucide-react";

interface DiscussPhaseProps {
  session: Session;
  isParticipant?: boolean;
}

export default function DiscussPhase({ session, isParticipant = false }: DiscussPhaseProps) {
  const { updateSession, participants, comments, addComment } = useSession();
  const [newComments, setNewComments] = useState<Record<string, string>>({});
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
          .filter(Boolean) as Response[];
        
        const sum = responses.reduce((acc, r) => acc + (Number(r.value) || 0), 0);
        const avg = responses.length > 0 ? sum / responses.length : 0;
        
        agg[question.id] = {
          average: Math.round(avg * 10) / 10,
          count: responses.length
        };
      } else if (question.type === 'text') {
        const textResponses = relevantParticipants
          .map(p => {
            const response = p.responses?.find(r => r.questionId === question.id);
            if (response && response.value && typeof response.value === 'string' && response.value.trim()) {
              return {
                value: response.value,
                participant: p.name
              };
            }
            return null;
          })
          .filter(Boolean);
        
        agg[question.id] = {
          responses: textResponses,
          count: textResponses?.length || 0
        };
      }
    });
    
    setAggregatedResponses(agg);
  }, [participants, session.template.questions]);
  
  const filteredComments = comments.filter(c => c.sessionId === session.id);
  
  const handleAddComment = (questionId: string) => {
    if (newComments[questionId]) {
      addComment({
        sessionId: session.id,
        questionId,
        text: newComments[questionId],
        userName: isParticipant ? undefined : "Facilitator"
      });
      
      setNewComments(prev => ({
        ...prev,
        [questionId]: ''
      }));
      
      toast.success("Comment added successfully!");
    }
  };
  
  const handleNext = () => {
    if (!isParticipant) {
      const updatedSession = {
        ...session,
        currentPhase: 'review' as const
      };
      updateSession(updatedSession);
    }
  };
  
  const getScaleLabel = (value: number) => {
    if (value < 2) return "Poor";
    if (value < 3) return "Below Average";
    if (value < 4) return "Average";
    if (value < 5) return "Good";
    return "Excellent";
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
              className={
                (isPerfect
                  ? "bg-[#163111]"
                  : "bg-[#443813]"
                )
                + " rounded-lg px-7 py-4 flex items-center gap-6 shadow-sm"
              }
            >
              <div
                className={
                  (isPerfect ? "bg-[#5E9323]" : "bg-[#F97316]")
                  + " w-16 h-16 flex flex-col items-center justify-center rounded-full text-white font-bold text-xl"
                }
              >
                {avg.toFixed(1)}
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-lg font-semibold text-white">{question.text}</span>
                <div className="flex items-center gap-3 mt-2">
                  <span className={(isPerfect ? "bg-[#5E9323]" : "bg-[#F97316]") + " rounded-full px-3 py-1 text-white text-sm font-bold"}>
                    {avg.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Card className="m-6">
        <CardContent className="p-6">
          {!isParticipant && (
            <div className="flex justify-end mt-4">
              <Button 
                onClick={handleNext}
                className="bg-[#E15D2F] hover:bg-[#E15D2F]/90 text-white font-medium"
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
