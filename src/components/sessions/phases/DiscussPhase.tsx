
import { useState, useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { Session } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import TeamHealthChart from './TeamHealthChart';

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

  const healthCategories = [
    { 
      id: "collab_1", 
      subject: "Team Collaboration", 
      questionId: "collab_1",
      explanation: "Measures how well team members work together, communicate, and support each other in daily activities."
    },
    { 
      id: "delivery_1", 
      subject: "Sprint Goal Confidence", 
      questionId: "delivery_1",
      explanation: "Reflects the team's confidence in meeting sprint commitments and delivering planned work."
    },
    { 
      id: "delivery_2", 
      subject: "Technical Practices", 
      questionId: "delivery_2",
      explanation: "Evaluates the quality of code, testing practices, and technical documentation."
    },
    { 
      id: "collab_2", 
      subject: "Work-Life Balance", 
      questionId: "collab_2",
      explanation: "Assesses the team's ability to maintain healthy boundaries between work and personal life."
    },
    { 
      id: "collab_3", 
      subject: "Team Morale", 
      questionId: "collab_3",
      explanation: "Indicates overall team satisfaction, motivation, and enthusiasm for work."
    },
  ];

  return (
    <div className="w-full space-y-6">
      <TeamHealthChart session={session} />
      
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Discussion Topics</h2>
            <p className="text-gray-500">Review feedback and comments from the team</p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <Info className="mr-1 h-4 w-4" />
                Explain Categories
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Health Check Categories</h4>
                <div className="space-y-2">
                  {healthCategories.map((category) => (
                    <div key={category.id} className="text-sm">
                      <p className="font-medium text-gray-900">{category.subject}</p>
                      <p className="text-gray-500 text-xs">{category.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {healthCategories.map((category) => {
            const score = aggregatedResponses[category.questionId]?.average || 0;
            return (
              <AccordionItem 
                key={category.id} 
                value={category.id}
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-gray-900">{category.subject}</span>
                    <span className="text-sm font-semibold bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                      {score.toFixed(1)}/5
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    <p className="text-sm text-gray-600">{category.explanation}</p>
                    <p className="text-gray-600">No comments yet.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
