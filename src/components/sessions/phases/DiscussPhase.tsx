
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
        commentCount: filteredComments.filter(c => c.questionId === question.id).length,
        color
      };
    });

  return (
    <div style={{ background: "#1A1F2C" }}>
      <RadarChartSection data={radarData} />

      <div className="space-y-3 px-4 pb-7">
        {session.template.questions.filter(q => q.type === "scale").map((question, idx) => {
          const data = aggregatedResponses[question.id];
          const avg = data ? data.average : 1;
          const commentCount = filteredComments.filter(c => c.questionId === question.id).length;
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
                {/* Safely check if description exists before rendering it */}
                {question.description && (
                  <span className="block text-sm text-gray-300">{question.description}</span>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <span className={(isPerfect ? "bg-[#5E9323]" : "bg-[#F97316]") + " rounded-full px-3 py-1 text-white text-sm font-bold"}>{avg.toFixed(1)}</span>
                  <span className="flex items-center text-gray-400 text-sm gap-1">
                    <MessageSquare size={15} />{commentCount}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Card className="m-6">
        <CardHeader>
          <CardTitle className="font-bold" style={{ fontFamily: "Clarendon, serif" }}>Discussion Phase</CardTitle>
          <CardDescription>
            Review survey results and discuss as a team.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {session.template.questions.map((question) => {
            const questionComments = filteredComments.filter(c => c.questionId === question.id);
            const data = aggregatedResponses[question.id];
            
            return (
              <Card key={question.id} className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg" style={{ fontFamily: "Clarendon, serif" }}>{question.text}</CardTitle>
                  {question.type === 'scale' && data && (
                    <div className="flex items-center mt-2">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1 text-xs text-muted-foreground">
                          <span>Poor (1)</span>
                          <span>Excellent (5)</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${(data.average / 5) * 100}%`,
                              background: data.average === 5 ? "#5E9323" : "#E15D2F" 
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-24 ml-4 text-center">
                        <div className="text-2xl font-bold">{data.average}</div>
                        <div className="text-xs text-muted-foreground">{getScaleLabel(data.average)}</div>
                        <div className="text-xs text-muted-foreground mt-1">{data.count} responses</div>
                      </div>
                    </div>
                  )}
                  {question.type === 'text' && data && (
                    <div className="mt-2">
                      <span className="text-sm text-muted-foreground">{data.count} responses</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pb-2">
                  {question.type === 'text' && data && data.responses && (
                    <div className="max-h-40 overflow-y-auto border rounded-md p-2 mb-4">
                      {data.responses.length > 0 ? (
                        <ul className="space-y-2">
                          {data.responses.map((r: any, idx: number) => (
                            <li key={idx} className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              "{r.value}"
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No text responses</p>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Comments</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
                      {questionComments.length > 0 ? (
                        questionComments.map((comment) => (
                          <div key={comment.id} className="bg-accent p-2 rounded-md">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-medium">
                                {comment.userName || "Anonymous"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm">{comment.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No comments yet</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Add a comment..."
                        className="text-sm bg-[#F7F7F7] border border-gray-200"
                        value={newComments[question.id] || ''}
                        onChange={(e) => setNewComments(prev => ({
                          ...prev,
                          [question.id]: e.target.value
                        }))}
                      />
                      <Button 
                        size="sm" 
                        className="self-end bg-[#E15D2F] hover:bg-[#E15D2F]/90"
                        onClick={() => handleAddComment(question.id)}
                        disabled={!newComments[question.id]}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
        <CardFooter className="flex justify-end">
          {!isParticipant && (
            <Button 
              onClick={handleNext}
              className="bg-[#E15D2F] hover:bg-[#E15D2F]/90 text-white font-medium"
            >
              Proceed to Review
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

