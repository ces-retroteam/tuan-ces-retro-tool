
import { useState, useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { Session, Response, Participant } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';

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
  
  // Check if this participant has already submitted responses
  useEffect(() => {
    if (isParticipant && participantId) {
      const participant = participants.find(p => p.id === participantId);
      if (participant?.responses) {
        const responseObj: Record<string, any> = {};
        participant.responses.forEach(response => {
          responseObj[response.questionId] = response.value;
        });
        setResponses(responseObj);
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
        // Convert regular responses
        ...Object.entries(responses).map(([questionId, value]) => ({
          questionId,
          value
        })),
        // Add comments as responses with special prefix
        ...Object.entries(comments).map(([questionId, value]) => ({
          questionId: `comment_${questionId}`,
          value
        })),
        // Add additional items
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
  
  // Mock questions for the different sections
  const deliveryQuestions = [
    { id: 'delivery_1', text: 'How effectively does the team deliver on its commitments?', type: 'scale', required: true },
    { id: 'delivery_2', text: 'How would you rate the quality of our deliverables?', type: 'scale', required: true },
    { id: 'delivery_3', text: 'How well does the team handle unexpected obstacles?', type: 'scale', required: true },
  ];
  
  const collaborationQuestions = [
    { id: 'collab_1', text: 'How well does the team communicate internally?', type: 'scale', required: true },
    { id: 'collab_2', text: 'How effectively do team members support each other?', type: 'scale', required: true },
    { id: 'collab_3', text: 'Rate the team\'s ability to constructively resolve conflicts', type: 'scale', required: true },
  ];
  
  const additionalQuestions = [
    { id: 'additional', text: 'What are the top 3 challenges facing the team?', type: 'text', required: false },
  ];
  
  const renderQuestionInput = (question: any) => {
    switch (question.type) {
      case 'scale':
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 - Poor</span>
              <span>3 - Average</span>
              <span>5 - Excellent</span>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                className="flex-1"
                defaultValue={[responses[question.id] || 3]}
                min={1}
                max={5}
                step={1}
                onValueChange={([value]) => handleResponseChange(question.id, value)}
                disabled={isSubmitted}
              />
              <div className="text-center font-medium min-w-8">
                {responses[question.id] || 3}
              </div>
            </div>
            <div className="mt-2">
              <Label htmlFor={`comment_${question.id}`}>Comments (optional)</Label>
              <Textarea
                id={`comment_${question.id}`}
                placeholder="Add any comments about your rating..."
                value={comments[question.id] || ''}
                onChange={(e) => handleCommentChange(question.id, e.target.value)}
                disabled={isSubmitted}
                className="mt-1"
              />
            </div>
          </div>
        );
      case 'text':
        return (
          <div>
            {question.id === 'additional' ? (
              <div className="space-y-4">
                {additionalItems.map((item, index) => (
                  <Input
                    key={index}
                    type="text"
                    placeholder={`Challenge ${index + 1}`}
                    value={item}
                    onChange={(e) => handleAdditionalItemChange(index, e.target.value)}
                    disabled={isSubmitted}
                    className="mb-2"
                  />
                ))}
                {!isSubmitted && (
                  <Button 
                    variant="outline" 
                    onClick={addAdditionalItem}
                    className="w-full mt-2"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Another Challenge
                  </Button>
                )}
              </div>
            ) : (
              <Textarea
                placeholder="Enter your response here..."
                value={responses[question.id] || ''}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                disabled={isSubmitted}
              />
            )}
          </div>
        );
      default:
        return (
          <Input
            type="text"
            placeholder="Enter your response here..."
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            disabled={isSubmitted}
          />
        );
    }
  };
  
  // For facilitators, show a dashboard of responses
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
  
  // Render the appropriate section based on currentSection state
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
            <CardContent className="space-y-6">
              {!session.isAnonymous && !isSubmitted && (
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
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
                <div className="space-y-6">
                  {deliveryQuestions.map((question) => (
                    <div key={question.id} className="space-y-2">
                      <Label htmlFor={question.id}>
                        {question.text}
                        {question.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
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
            <CardContent className="space-y-6">
              {isSubmitted ? (
                <div className="bg-accent p-4 rounded-lg text-center">
                  <h3 className="text-lg font-medium">Thank You!</h3>
                  <p className="text-muted-foreground">
                    Your responses have been recorded.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {collaborationQuestions.map((question) => (
                    <div key={question.id} className="space-y-2">
                      <Label htmlFor={question.id}>
                        {question.text}
                        {question.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
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
            <CardContent className="space-y-6">
              {isSubmitted ? (
                <div className="bg-accent p-4 rounded-lg text-center">
                  <h3 className="text-lg font-medium">Thank You!</h3>
                  <p className="text-muted-foreground">
                    Your responses have been recorded.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {additionalQuestions.map((question) => (
                    <div key={question.id} className="space-y-2">
                      <Label htmlFor={question.id}>
                        {question.text}
                        {question.required && <span className="text-destructive ml-1">*</span>}
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
  
  // For participants, show the survey form with navigation
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
                  .some(q => !responses[q.id])
              ) || (
                currentSection === 'collaboration' && 
                collaborationQuestions
                  .filter(q => q.required)
                  .some(q => !responses[q.id])
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
