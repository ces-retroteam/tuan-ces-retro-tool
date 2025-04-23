import React, { useState, useEffect } from "react";
import { useSession } from "@/context/SessionContext";
import { Session, Response, Participant } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DeliverySectionStep from "./DeliverySectionStep";
import CollaborationSectionStep from "./CollaborationSectionStep";
import AdditionalSectionStep from "./AdditionalSectionStep";

interface SurveyPhaseProps {
    session: Session;
    isParticipant?: boolean;
    participantId?: string;
}

export default function SurveyPhase({ session, isParticipant = false, participantId }: SurveyPhaseProps) {
    const { updateSession, participants, addParticipant } = useSession();
    const [responses, setResponses] = useState<Record<string, any>>({});
    const [comments, setComments] = useState<Record<string, string>>({});
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [additionalItems, setAdditionalItems] = useState<string[]>([""]);
    const [currentSection, setCurrentSection] = useState<number>(0);

    useEffect(() => {
        if (isParticipant && participantId) {
            const participant = participants.find((p) => p.id === participantId);
            if (participant?.responses) {
                const responseObj: Record<string, any> = {};
                const commentObj: Record<string, string> = {};

                participant.responses.forEach((response) => {
                    if (response.questionId.startsWith("comment_")) {
                        commentObj[response.questionId.replace("comment_", "")] = response.value as string;
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
            text: "Commitments",
            description: "How effectively does the team deliver on its commitments?",
            type: "scale",
            required: true,
        },
        {
            id: "delivery_2",
            text: "Quality of Deliverables",
            description: "How would you rate the quality of our deliverables?",
            type: "scale",
            required: true,
        },
        {
            id: "delivery_3",
            text: "Managing Challenges",
            description: "How well does the team handle unexpected obstacles?",
            type: "scale",
            required: true,
        },
    ];

    const collaborationQuestions = [
        {
            id: "collab_1",
            text: "Communicate",
            description: "How well does the team communicate internally?",
            type: "scale",
            required: true,
        },
        {
            id: "collab_2",
            text: "We before me",
            description: "How effectively do team members support each other?",
            type: "scale",
            required: true,
        },
        {
            id: "collab_3",
            text: "Conflicts.",
            description: "Rate the team's ability to constructively resolve conflicts.",
            type: "scale",
            required: true,
        },
    ];

    const additionalPrompt = "What are the top 3 challenges facing the team? (Add as many as you'd like)";

    const surveySections = [
        {
            label: "Delivery & Execution",
            Component: (
                <DeliverySectionStep
                    questions={deliveryQuestions}
                    responses={responses}
                    comments={comments}
                    onResponseChange={handleResponseChange}
                    onCommentChange={handleCommentChange}
                    isSubmitted={isSubmitted}
                    sessionIsAnonymous={session.isAnonymous}
                    name={name}
                    setName={setName}
                />
            ),
        },
        {
            label: "Team Collaboration",
            Component: (
                <CollaborationSectionStep
                    questions={collaborationQuestions}
                    responses={responses}
                    comments={comments}
                    onResponseChange={handleResponseChange}
                    onCommentChange={handleCommentChange}
                    isSubmitted={isSubmitted}
                />
            ),
        },
        {
            label: "Additional Questions",
            Component: (
                <AdditionalSectionStep
                    prompt={additionalPrompt}
                    items={additionalItems}
                    onItemChange={handleAdditionalItemChange}
                    addItem={addAdditionalItem}
                    isSubmitted={isSubmitted}
                />
            ),
        },
    ];

    if (!isParticipant) {
        const participantCount = participants.filter(
            (p) => p.responses && p.responses.some((r) => r.questionId === deliveryQuestions[0].id),
        ).length;

        return (
            <>
                <DeliverySectionStep
                    questions={deliveryQuestions}
                    responses={responses}
                    comments={comments}
                    onResponseChange={handleResponseChange}
                    onCommentChange={handleCommentChange}
                    isSubmitted={isSubmitted}
                    sessionIsAnonymous={session.isAnonymous}
                    name={name}
                    setName={setName}
                />
                <CollaborationSectionStep
                    questions={collaborationQuestions}
                    responses={responses}
                    comments={comments}
                    onResponseChange={handleResponseChange}
                    onCommentChange={handleCommentChange}
                    isSubmitted={isSubmitted}
                />
                <AdditionalSectionStep
                    prompt={additionalPrompt}
                    items={additionalItems}
                    onItemChange={handleAdditionalItemChange}
                    addItem={addAdditionalItem}
                    isSubmitted={isSubmitted}
                />
            </>
        );
    }

    const isDeliveryValid =
        deliveryQuestions.filter((q) => q.required).every((q) => [1, 2, 3, 4, 5].includes(responses[q.id])) &&
        (session.isAnonymous || name.trim().length > 0);

    const isCollabValid = collaborationQuestions
        .filter((q) => q.required)
        .every((q) => [1, 2, 3, 4, 5].includes(responses[q.id]));

    return (
        <Card>
            <CardContent className="space-y-10 pt-6 pb-2">
                {/* Step UI */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-lg font-bold" style={{ fontFamily: "Clarendon, serif" }}>
                            {surveySections[currentSection].label}
                        </div>
                        <div className="flex gap-2">
                            {surveySections.map((section, idx) => (
                                <div
                                    key={section.label}
                                    className={`w-3 h-3 rounded-full ${
                                        currentSection === idx ? "bg-orange-500" : "bg-gray-200"
                                    }`}
                                ></div>
                            ))}
                        </div>
                    </div>
                    {surveySections[currentSection].Component}
                    {isSubmitted && (
                        <div className="bg-accent p-4 rounded-lg text-center mt-2">
                            <h3 className="text-lg font-medium">Thank You!</h3>
                            <p className="text-muted-foreground">Your responses have been recorded.</p>
                        </div>
                    )}
                </div>
            </CardContent>
            {!isSubmitted && (
                <CardFooter className="flex flex-col gap-4 items-end">
                    <div className="flex justify-between w-full">
                        <Button
                            variant="outline"
                            style={{ color: "#222", borderColor: "#E15D2F" }}
                            disabled={currentSection === 0}
                            onClick={() => setCurrentSection(currentSection - 1)}
                        >
                            Prev
                        </Button>
                        {currentSection < surveySections.length - 1 ? (
                            <Button
                                style={{
                                    backgroundColor: "#E15D2F",
                                    color: "#fff",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.04em",
                                    fontFamily: "Inter, Helvetica, Arial, sans-serif",
                                }}
                                onClick={() => setCurrentSection(currentSection + 1)}
                                disabled={
                                    (currentSection === 0 && !isDeliveryValid) ||
                                    (currentSection === 1 && !isCollabValid)
                                }
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !isDeliveryValid || !isCollabValid}
                                className="font-bold"
                                style={{
                                    backgroundColor: "#E15D2F",
                                    color: "#fff",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.04em",
                                    fontFamily: "Inter, Helvetica, Arial, sans-serif",
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
