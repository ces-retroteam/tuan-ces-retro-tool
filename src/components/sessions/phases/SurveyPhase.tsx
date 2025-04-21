
import { useState, useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { Session, Response, Participant } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import SurveyQuestionRow from "./SurveyQuestionRow";

interface SurveyPhaseProps {
  session: Session;
  isParticipant?: boolean;
  participantId?: string;
}

type SurveySection = 'delivery' | 'collaboration' | 'additional';

export default function SurveyPhase({ session, isParticipant = false, participantId }: SurveyPhaseProps) {
  const { updateSession, participants, addParticipant } = useSession();
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentSection, setCurrentSection] = useState<SurveySection>('delivery');
  const [additionalItems, setAdditionalItems] = useState<string[]>(['']);
  
  useEffect(() => {
    if (isParticipant && participantId) {
      const participant = participants.find(p => p.id === participantId);
      if (participant?.responses) {
        const responseObj: Record<string, any> = {};
        const commentObj: Record<string, string> = {};
        
        participant.responses.forEach(response => {
          if (response.questionId.startsWith('comment_')) {
            commentObj[response.questionId.replace('comment_', '')] = response.value as string;
          } else {
            responseObj[response.questionId] = response.value;
          }
        });
        
        setResponses(responseObj);
        setComments(commentObj);
        setIsSubmitted(true);
      }
    }
  }, [isParticipant, participantId, participants]);
  
  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleCommentChange = (questionId: string, value: string) => {
    setComments(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleAdditionalItemChange = (index: number, value: string) => {
    const newItems = [...additionalItems];
    newItems[index] = value;
    setAdditionalItems(newItems);
  };

  const addAdditionalItem = () => {
    setAdditionalItems([...additionalItems, '']);
  };
  
  const handleSubmit = () => {
    if (isParticipant) {
      setIsSubmitting(true);
      
      const participantResponses: Response[] = [
        ...Object.entries(responses).map(([questionId, value]) => ({
          questionId,
          value
        })),
        ...Object.entries(comments).map(([questionId, value]) => ({
          questionId: `comment_${questionId}`,
          value
        })),
        ...additionalItems.filter(item => item.trim()).map((item, index) => ({
          questionId: `additional_${index}`,
          value: item
        }))
      ];
      
      try {
        const participantData: Omit<Participant, 'id' | 'joinedAt'> = {
          name: session.isAnonymous ? `Anonymous User` : name,
          responses: participantResponses
        };
        
        addParticipant(participantData);
        
        setIsSubmitted(true);
        setIsSubmitting(false);
        toast.success("Survey submitted successfully!");
      } catch (error) {
        console.error("Error submitting survey:", error);
        setIsSubmitting(false);
        toast.error("Failed to submit survey. Please try again.");
      }
    }
  };
  
  const handleNext = () => {
    if (currentSection === 'delivery') {
      setCurrentSection('collaboration');
    } else if (currentSection === 'collaboration') {
      setCurrentSection('additional');
    } else if (!isParticipant) {
      const updatedSession = {
        ...session,
        currentPhase: 'discuss' as const
      };
      updateSession(updatedSession);
    }
  };
  
  const handlePrevious = () => {
    if (currentSection === 'additional') {
      setCurrentSection('collaboration');
    } else if (currentSection === 'collaboration') {
      setCurrentSection('delivery');
    }
  };
  
  const deliveryQuestions = [
    { id: 'delivery_1', text: 'How effectively does the team deliver on its commitments?', type: 'scale', required: true },
    { id: 'delivery_2', text: 'How would you rate the quality of our deliverables?', type: 'scale', required: true },
    { id: 'delivery_3', text: 'How well does the team handle unexpected obstacles?', type: 'scale', required: true },
  ];
  
  const collaborationQuestions = [
    { id: 'collab_1', text: 'How well does the team communicate internally?', type: 'scale', required: true },
    { id: 'collab_2', text: 'How effectively do team members support each other?', type: 'scale', required: true },
    { id: 'collab_3', text: "Rate the team's ability to constructively resolve conflicts", type: 'scale', required: true },
  ];
  
  const additionalQuestions = [
    { id: 'additional', text: 'What are the top 3 challenges facing the team?', type: 'text', required: false },
  ];
  
  const renderQuestionInput = (question: any) => {
    if (question.type === "scale") {
      return (
        <SurveyQuestionRow
          key={question.id}
          question={question}
          value={responses[question.id]}
          comment={comments[question.id] || ""}
          onValueChange={val => handleResponseChange(question.id, val)}
          onCommentChange={val => handleCommentChange(question.id, val)}
          disabled={isSubmitted}
        />
      );
    }
    if (question.type === "text") {
      if (question.id === "additional") {
        return (
          <div className="space-y-4">
            {additionalItems.map((item, index) => (
              <Input
                key={index}
                type="text"
                placeholder={`Challenge ${index + 1}`}
                value={item}
                onChange={(e) => handleAdditionalItemChange(index, e.target.value)}
                disabled={isSubmitted}
                className="mb-2 bg-[#222] text-white border-[#333]"
              />
            ))}
            {!isSubmitted && (
              <Button 
                variant="outline" 
                onClick={addAdditionalItem}
                className="w-full mt-2"
              >
                <span className="text-white">Add Another Challenge</span>
              </Button>
            )}
          </div>
        );
      }
      return (
        <Textarea
          placeholder="Enter your response here..."
          value={responses[question.id] || ''}
          onChange={(e) => handleResponseChange(question.id, e.target.value)}
          disabled={isSubmitted}
          className="bg-[#222] text-white border-[#333]"
        />
      );
    }
    return (
      <Input
        type="text"
        placeholder="Enter your response here..."
        value={responses[question.id] || ''}
        onChange={(e) => handleResponseChange(question.id, e.target.value)}
        disabled={isSubmitted}
        className="bg-[#222] text-white border-[#333]"
      />
    );
  };
  
  if (!isParticipant) {
    const participantCount = participants.filter(p => 
      p.responses && p.responses.some(r => r.questionId === session.template.questions[0].id)
    ).length;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Survey Phase</CardTitle>
          <CardDescription>
            Participants are completing the survey. Once everyone has responded, proceed to the discussion phase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-accent p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Participation Status</h3>
            <p className="text-muted-foreground">
              {participantCount} participants have submitted responses.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Questions</h3>
            <div className="space-y-4">
              {[
                ...deliveryQuestions,
                ...collaborationQuestions,
                ...additionalQuestions
              ].map((question) => (
                <div key={question.id} className="p-4 bg-card border rounded-lg">
                  <p className="font-medium">{question.text}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleNext}>
            Proceed to Discussion
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  const renderSectionContent = () => {
    switch (currentSection) {
      case 'delivery':
        return (
          <>
            <CardHeader>
              <CardTitle>Delivery & Execution</CardTitle>
              <CardDescription>
                Please rate how well the team delivers and executes on its goals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!session.isAnonymous && !isSubmitted && (
                <div className="space-y-2 mb-6">
                  <Label htmlFor="name" className="text-white">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-[#222] text-white border-[#333]"
                  />
                </div>
              )}
              
              {isSubmitted ? (
                <div className="bg-accent p-4 rounded-lg text-center">
                  <h3 className="text-lg font-medium">Thank You!</h3>
                  <p className="text-muted-foreground">
                    Your responses have been recorded.
                  </p>
                </div>
              ) : (
                <div>
                  {deliveryQuestions.map((question) => (
                    <div key={question.id}>
                      {renderQuestionInput(question)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </>
        );
      case 'collaboration':
        return (
          <>
            <CardHeader>
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Please rate how well the team collaborates internally.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="bg-accent p-4 rounded-lg text-center">
                  <h3 className="text-lg font-medium">Thank You!</h3>
                  <p className="text-muted-foreground">
                    Your responses have been recorded.
                  </p>
                </div>
              ) : (
                <div>
                  {collaborationQuestions.map((question) => (
                    <div key={question.id}>
                      {renderQuestionInput(question)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </>
        );
      case 'additional':
        return (
          <>
            <CardHeader>
              <CardTitle>Additional Questions</CardTitle>
              <CardDescription>
                Please provide responses to these additional questions about the team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="bg-accent p-4 rounded-lg text-center">
                  <h3 className="text-lg font-medium">Thank You!</h3>
                  <p className="text-muted-foreground">
                    Your responses have been recorded.
                  </p>
                </div>
              ) : (
                <div>
                  {additionalQuestions.map((question) => (
                    <div key={question.id}>
                      <Label className="text-base text-white font-semibold flex gap-2 mb-2">
                        {question.text}
                      </Label>
                      {renderQuestionInput(question)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card>
      {renderSectionContent()}
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentSection === 'delivery' || isSubmitted}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        
        <div className="flex gap-2">
          {currentSection === 'additional' && !isSubmitted ? (
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Survey"}
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              disabled={isSubmitted || (
                currentSection === 'delivery' && 
                deliveryQuestions
                  .filter(q => q.required)
                  .some(q => ![1,2,3,4,5].includes(responses[q.id]))
              ) || (
                currentSection === 'collaboration' && 
                collaborationQuestions
                  .filter(q => q.required)
                  .some(q => ![1,2,3,4,5].includes(responses[q.id]))
              )}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
