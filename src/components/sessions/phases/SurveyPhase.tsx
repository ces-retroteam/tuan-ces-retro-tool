import { useState, useEffect } from "react";
import { useSession } from "@/context/SessionContext";
import { Session, Response, Participant } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import SurveyQuestionRow from "./SurveyQuestionRow";

interface SurveyPhaseProps {
  session: Session;
  isParticipant?: boolean;
  participantId?: string;
}

type SurveySection = "delivery" | "collaboration" | "additional";

export default function SurveyPhase({
  session,
  isParticipant = false,
  participantId,
}: SurveyPhaseProps) {
  const { updateSession, participants, addParticipant } = useSession();
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [additionalItems, setAdditionalItems] = useState<string[]>([""]);
  const [currentSection, setCurrentSection] = useState<SurveySection>("delivery");

  useEffect(() => {
    if (isParticipant && participantId) {
      const participant = participants.find((p) => p.id === participantId);
      if (participant?.responses) {
        const responseObj: Record<string, any> = {};
        const commentObj: Record<string, string> = {};

        participant.responses.forEach((response) => {
          if (response.questionId.startsWith("comment_")) {
            commentObj[response.questionId.replace("comment_", "")] =
              response.value as string;
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
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleCommentChange = (questionId: string, value: string) => {
    setComments((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleAdditionalItemChange = (index: number, value: string) => {
    const newItems = [...additionalItems];
    newItems[index] = value;
    setAdditionalItems(newItems);
  };

  const addAdditionalItem = () => {
    setAdditionalItems([...additionalItems, ""]);
  };

  const handleSubmit = () => {
    if (isParticipant) {
      setIsSubmitting(true);

      const participantResponses: Response[] = [
        ...Object.entries(responses).map(([questionId, value]) => ({
          questionId,
          value,
        })),
        ...Object.entries(comments).map(([questionId, value]) => ({
          questionId: `comment_${questionId}`,
          value,
        })),
        ...additionalItems
          .filter((item) => item.trim())
          .map((item, index) => ({
            questionId: `additional_${index}`,
            value: item,
          })),
      ];

      try {
        const participantData: Omit<Participant, "id" | "joinedAt"> = {
          name: session.isAnonymous ? "Anonymous User" : name,
          responses: participantResponses,
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

  const deliveryQuestions = [
    {
      id: "delivery_1",
      text: "How effectively does the team deliver on its commitments?",
      description: "Consider meeting goals, deadlines, and expectations.",
      type: "scale",
      required: true,
    },
    {
      id: "delivery_2",
      text: "How would you rate the quality of our deliverables?",
      description: "Think about clarity, accuracy, and completeness.",
      type: "scale",
      required: true,
    },
    {
      id: "delivery_3",
      text: "How well does the team handle unexpected obstacles?",
      description: "Assess flexibility and problem-solving.",
      type: "scale",
      required: true,
    },
  ];

  const collaborationQuestions = [
    {
      id: "collab_1",
      text: "How well does the team communicate internally?",
      description: "Includes regular updates and open sharing.",
      type: "scale",
      required: true,
    },
    {
      id: "collab_2",
      text: "How effectively do team members support each other?",
      description: "Look for encouragement, mentorship, or help.",
      type: "scale",
      required: true,
    },
    {
      id: "collab_3",
      text: "Rate the team's ability to constructively resolve conflicts.",
      description: "How are disagreements handled?",
      type: "scale",
      required: true,
    },
  ];

  const additionalPrompt =
    "What are the top 3 challenges facing the team? (Add as many as you'd like)";

  if (!isParticipant) {
    const participantCount = participants.filter(
      (p) =>
        p.responses &&
        p.responses.some((r) => r.questionId === deliveryQuestions[0].id)
    ).length;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Survey Phase</CardTitle>
          <CardDescription>
            Participants are completing the survey. Once everyone has responded,
            proceed to the discussion phase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="bg-[#F7F7F7] p-4 rounded-lg border mb-2">
            <h3 className="text-lg font-semibold mb-2 text-[#222]">
              Participation Status
            </h3>
            <p className="text-[#555]">{participantCount} participants have submitted responses.</p>
          </div>
          {/* Section: Delivery & Execution */}
          <div className="bg-white rounded-2xl px-6 py-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="font-bold text-[1.35rem] text-[#222] mb-2" style={{ fontFamily: "Clarendon, serif" }}>
              Delivery & Execution
            </h2>
            <div className="space-y-6">
              {deliveryQuestions.map((question) => (
                <SurveyQuestionRow
                  key={question.id}
                  question={question}
                  value={responses[question.id]}
                  comment={comments[question.id] || ""}
                  onValueChange={(val) => handleResponseChange(question.id, val)}
                  onCommentChange={(val) => handleCommentChange(question.id, val)}
                  disabled={isSubmitted}
                />
              ))}
            </div>
          </div>
          {/* Section: Team Collaboration */}
          <div className="bg-white rounded-2xl px-6 py-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="font-bold text-[1.35rem] text-[#222] mb-2" style={{ fontFamily: "Clarendon, serif" }}>
              Team Collaboration
            </h2>
            <div className="space-y-6">
              {collaborationQuestions.map((question) => (
                <SurveyQuestionRow
                  key={question.id}
                  question={question}
                  value={responses[question.id]}
                  comment={comments[question.id] || ""}
                  onValueChange={(val) => handleResponseChange(question.id, val)}
                  onCommentChange={(val) => handleCommentChange(question.id, val)}
                  disabled={isSubmitted}
                />
              ))}
            </div>
          </div>
          {/* Section: Additional Questions */}
          <div className="bg-white rounded-2xl px-6 py-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-[1.35rem] text-[#222] mb-2" style={{ fontFamily: "Clarendon, serif" }}>
              Additional Questions
            </h2>
            <Label className="text-base text-[#222] font-semibold flex gap-2 mb-3">
              {additionalPrompt}
            </Label>
            <div className="space-y-3">
              {additionalItems.map((item, index) => (
                <Input
                  key={index}
                  type="text"
                  placeholder={`Challenge ${index + 1}`}
                  value={item}
                  onChange={(e) => handleAdditionalItemChange(index, e.target.value)}
                  disabled={isSubmitted}
                  className="bg-[#F7F7F7] border border-gray-200 text-[#222] px-4 py-2 rounded-lg"
                  style={{ fontFamily: "Inter, Helvetica, Arial, sans-serif" }}
                />
              ))}
            </div>
            {/* No add button in admin mode */}
          </div>
        </CardContent>
        {/* No Proceed to Discussion button */}
      </Card>
    );
  }

  function renderSection(section: SurveySection) {
    if (section === "delivery") {
      return (
        <div className="bg-white rounded-2xl px-6 py-6 shadow-sm border border-gray-100 mb-4">
          <h2 className="font-bold text-[1.35rem] text-[#222] mb-2"
            style={{ fontFamily: "Clarendon, serif" }}>
            Delivery & Execution
          </h2>
          <CardDescription className="mb-4 text-[#555]">
            Please rate how well the team delivers and executes on its goals.
          </CardDescription>
          {!session.isAnonymous && !isSubmitted && (
            <div className="mb-6">
              <Label htmlFor="name" className="text-[#222] font-semibold mb-1 block"
                style={{ fontFamily: "Inter, Helvetica, Arial, sans-serif" }}>
                Your Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-[#F7F7F7] text-[#222] border border-gray-200 px-4 py-2 rounded-lg"
                style={{ fontFamily: "Inter, Helvetica, Arial, sans-serif" }}
              />
            </div>
          )}
          <div className="space-y-6">
            {deliveryQuestions.map((question) => (
              <SurveyQuestionRow
                key={question.id}
                question={question}
                value={responses[question.id]}
                comment={comments[question.id] || ""}
                onValueChange={(val) => handleResponseChange(question.id, val)}
                onCommentChange={(val) => handleCommentChange(question.id, val)}
                disabled={isSubmitted}
              />
            ))}
          </div>
        </div>
      );
    }
    if (section === "collaboration") {
      return (
        <div className="bg-white rounded-2xl px-6 py-6 shadow-sm border border-gray-100 mb-4">
          <h2 className="font-bold text-[1.35rem] text-[#222] mb-2"
            style={{ fontFamily: "Clarendon, serif" }}>
            Team Collaboration
          </h2>
          <CardDescription className="mb-4 text-[#555]">
            Please rate how well the team collaborates internally.
          </CardDescription>
          <div className="space-y-6">
            {collaborationQuestions.map((question) => (
              <SurveyQuestionRow
                key={question.id}
                question={question}
                value={responses[question.id]}
                comment={comments[question.id] || ""}
                onValueChange={(val) => handleResponseChange(question.id, val)}
                onCommentChange={(val) => handleCommentChange(question.id, val)}
                disabled={isSubmitted}
              />
            ))}
          </div>
        </div>
      );
    }
    if (section === "additional") {
      return (
        <div className="bg-white rounded-2xl px-6 py-6 shadow-sm border border-gray-100 mb-4">
          <h2 className="font-bold text-[1.35rem] text-[#222] mb-2" style={{ fontFamily: "Clarendon, serif" }}>
            Additional Questions
          </h2>
          <Label className="text-base text-[#222] font-semibold flex gap-2 mb-3">
            {additionalPrompt}
          </Label>
          <div className="space-y-3">
            {additionalItems.map((item, index) => (
              <Input
                key={index}
                type="text"
                placeholder={`Challenge ${index + 1}`}
                value={item}
                onChange={(e) => handleAdditionalItemChange(index, e.target.value)}
                disabled={isSubmitted}
                className="bg-[#F7F7F7] border border-gray-200 text-[#222] px-4 py-2 rounded-lg"
                style={{ fontFamily: "Inter, Helvetica, Arial, sans-serif" }}
              />
            ))}
          </div>
          {!isSubmitted && (
            <Button
              variant="outline"
              onClick={addAdditionalItem}
              className="w-full mt-3 flex items-center gap-2 border-[#E15D2F] hover:bg-[#FFF4F0]"
              style={{ color: "#E15D2F" }}
            >
              <Plus size={18} />
              <span className="uppercase font-semibold tracking-wide">Add Another Challenge</span>
            </Button>
          )}
        </div>
      );
    }
    return null;
  }

  return (
    <Card>
      <CardContent className="space-y-10 pt-6 pb-2">
        {renderSection(currentSection)}
        {isSubmitted && (
          <div className="bg-accent p-4 rounded-lg text-center">
            <h3 className="text-lg font-medium">Thank You!</h3>
            <p className="text-muted-foreground">
              Your responses have been recorded.
            </p>
          </div>
        )}
      </CardContent>
      {!isSubmitted && (
        <CardFooter className="flex flex-col gap-4 items-end">
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              style={{ color: "#222", borderColor: "#E15D2F" }}
              disabled={currentSection === "delivery"}
              onClick={() => setCurrentSection(surveySections[surveySections.indexOf(currentSection) - 1])}
            >
              Prev
            </Button>
            {currentSection !== "additional" ? (
              <Button
                style={{
                  backgroundColor: "#E15D2F",
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  fontFamily: "Inter, Helvetica, Arial, sans-serif"
                }}
                onClick={() => setCurrentSection(surveySections[surveySections.indexOf(currentSection) + 1])}
                disabled={
                  (currentSection === "delivery" &&
                    deliveryQuestions.filter((q) => q.required).some((q) => ![1, 2, 3, 4, 5].includes(responses[q.id])) ||
                  (currentSection === "collaboration" &&
                    collaborationQuestions.filter((q) => q.required).some((q) => ![1, 2, 3, 4, 5].includes(responses[q.id])) ||
                  (!session.isAnonymous && !name.trim()))
                }
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  (!session.isAnonymous && !name.trim()) ||
                  deliveryQuestions.filter((q) => q.required).some((q) => ![1, 2, 3, 4, 5].includes(responses[q.id])) ||
                  collaborationQuestions.filter((q) => q.required).some((q) => ![1, 2, 3, 4, 5].includes(responses[q.id]))
                }
                className="font-bold"
                style={{
                  backgroundColor: "#E15D2F",
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  fontFamily: "Inter, Helvetica, Arial, sans-serif"
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit Survey"}
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
