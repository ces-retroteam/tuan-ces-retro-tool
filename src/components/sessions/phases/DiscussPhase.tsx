
import { useState, useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { Session } from '@/types';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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

  return (
    <div className="w-full">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Discussion Topics</h2>
        <p className="text-gray-500 mb-6">Review feedback and comments from the team</p>
        
        {session.template.questions
          .filter(q => q.type === "scale")
          .map((question) => {
            const item = aggregatedResponses[question.id];
            return (
              <Collapsible key={question.id} className="border rounded-lg">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-900">{question.text}</span>
                    <span className="text-sm font-semibold bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                      {item ? item.average.toFixed(1) : '0'}/5
                    </span>
                  </div>
                  <ChevronDown className="h-5 w-5 text-gray-500 transform transition-transform duration-200 ease-in-out" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 pt-0">
                  <p className="text-gray-600">No comments yet.</p>
                </CollapsibleContent>
              </Collapsible>
            );
        })}
      </div>
    </div>
  );
}
