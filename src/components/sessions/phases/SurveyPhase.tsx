
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
import { useNavigate } from 'react-router-dom';

interface SurveyPhaseProps {
  session: Session;
  isParticipant?: boolean;
  participantId?: string;
}

export default function SurveyPhase({ session, isParticipant = false, participantId }: SurveyPhaseProps) {
  const navigate = useNavigate();
  const { updateSession, participants, addParticipant } = useSession();
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
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
  
  const handleSubmit = () => {
    if (isParticipant) {
      setIsSubmitting(true);
      
      const participantResponses: Response[] = Object.entries(responses).map(([questionId, value]) => ({
        questionId,
        value
      }));
      
      // In a real app, this would be an API call to save responses
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
    if (!isParticipant) {
      const updatedSession = {
        ...session,
        currentPhase: 'discuss' as const
      };
      updateSession(updatedSession);
    }
  };
  
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
            <Slider
              defaultValue={[responses[question.id] || 3]}
              min={1}
              max={5}
              step={1}
              onValueChange={([value]) => handleResponseChange(question.id, value)}
              disabled={isSubmitted}
            />
            <div className="text-center font-medium">
              {responses[question.id] || 3}
            </div>
          </div>
        );
      case 'text':
        return (
          <Textarea
            placeholder="Enter your response here..."
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            disabled={isSubmitted}
          />
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
              {session.template.questions.map((question) => (
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
  
  // For participants, show the survey form
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Health Survey</CardTitle>
        <CardDescription>
          {session.isAnonymous ? "Your responses will be anonymous." : "Please provide your feedback below."}
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
              Your responses have been recorded. Please wait for the discussion phase.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {session.template.questions.map((question) => (
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
      <CardFooter className="flex justify-end">
        {!isSubmitted && (
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || (session.template.questions
              .filter(q => q.required)
              .some(q => !responses[q.id]))}
          >
            {isSubmitting ? "Submitting..." : "Submit Survey"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
