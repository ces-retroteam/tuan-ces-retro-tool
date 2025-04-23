
import React, { useState } from "react";
import { useSession } from "@/context/SessionContext";
import { Session } from "@/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TeamHealthChart from "./TeamHealthChart";
import TagDropdown, { ChallengeTag } from "./TagDropdown";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DiscussPhaseProps {
    session: Session;
    isParticipant?: boolean;
}

// Helpers for extracting challenges
const extractTopChallenges = (participants: any[]) => {
    // Mock challenges for demonstration
    return [
        "Sprint planning meetings are running too long",
        "Need more clarity on acceptance criteria",
        "Technical debt is slowing down new feature development",
        "Cross-team dependencies are causing delays",
        "Knowledge sharing between team members could be improved",
    ];
};

// Helper to dynamically get background color className by score
function getBgColorByScore(score: number): string {
    if (score >= 4) return "bg-orange-100/100";
    if (score >= 3) return "bg-orange-200/100";
    if (score >= 2) return "bg-orange-300/100";
    if (score >= 1) return "bg-orange-400/100";
    return "bg-orange-500/70";
}

export default function DiscussPhase({ session, isParticipant = false }: DiscussPhaseProps) {
    const { participants, comments } = useSession();

    const relevantParticipants = participants.filter(
        (p) => p.responses && p.responses.some((r) => r.questionId === session.template.questions[0].id),
    );

    const healthCategories = [
        {
            id: "collab_1",
            subject: "Team Collaboration",
            questionId: "collab_1",
            explanation:
                "Measures how well team members work together, communicate, and support each other in daily activities.",
        },
        {
            id: "delivery_1",
            subject: "Sprint Goal Confidence",
            questionId: "delivery_1",
            explanation: "Reflects the team's confidence in meeting sprint commitments and delivering planned work.",
        },
        {
            id: "delivery_2",
            subject: "Technical Practices",
            questionId: "delivery_2",
            explanation: "Evaluates the quality of code, testing practices, and technical documentation.",
        },
        {
            id: "collab_2",
            subject: "Work-Life Balance",
            questionId: "collab_2",
            explanation: "Assesses the team's ability to maintain healthy boundaries between work and personal life.",
        },
        {
            id: "collab_3",
            subject: "Team Morale",
            questionId: "collab_3",
            explanation: "Indicates overall team satisfaction, motivation, and enthusiasm for work.",
        },
    ];

    // Calculate average scores (placeholder: demo, uses random values)
    const aggregatedResponses: Record<string, { average: number; count: number }> = {};
    healthCategories.forEach((category) => {
        const responses = relevantParticipants
            .map((p) => p.responses?.find((r) => r.questionId === category.questionId))
            .filter(Boolean)
            .map((r) => Number(r.value));
        aggregatedResponses[category.questionId] = {
            average: Math.round(Math.random() * 10 + (Math.random() * 30 + 10)) / 10,
            count: responses.length,
        };
    });

    // ---- AVG SCORE OF ALL TOPICS ----
    // Calculate the arithmetic mean of available categories
    const actualAverages = Object.values(aggregatedResponses).map((r) => r.average);
    const avgScoreAllTopics =
        actualAverages.length > 0
            ? (actualAverages.reduce((sum, val) => sum + val, 0) / actualAverages.length).toFixed(1)
            : "0.0";

    // ---- COMMENT COUNTER ----
    // Only count comments belonging to this session
    const totalComments = Array.isArray(comments)
        ? comments.filter((comment) => comment.sessionId === session.id).length
        : 0;

    // Top challenges
    const topChallenges: string[] = extractTopChallenges(relevantParticipants);

    // State to track tags per challenge (for demo, stateful, not persisted)
    const [challengeTags, setChallengeTags] = useState<Record<number, ChallengeTag>>({});

    const handleTagChange = (idx: number, newTag: ChallengeTag) => {
        setChallengeTags((prev) => ({
            ...prev,
            [idx]: newTag,
        }));
    };

    // State for expanding/collapsing all topics
    const [allOpen, setAllOpen] = useState(false);

    // Get array of open ids or []
    const openAccordionItems = allOpen ? healthCategories.map((c) => c.id) : [];

    return (
        <div className="w-full space-y-6">
            <TeamHealthChart session={session} avgScoreAllTopics={avgScoreAllTopics} totalComments={totalComments} />
            <div className="bg-white rounded-lg p-6">
                <div className="flex justify-between items-center flex-wrap mb-6">
                    {/* Stats at top-left */}
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FAFAFB] border">
                                <span className="text-[15px] text-[#8E9196] font-medium">Avg. Score</span>
                                <span className="font-bold text-[20px] text-[#F97316]">{avgScoreAllTopics}</span>
                                <span className="ml-1 text-[#8E9196]">/5</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FAFAFB] border">
                                <span className="text-[15px] text-[#8E9196] font-medium">Comments</span>
                                <span className="font-bold text-[20px] text-[#9b87f5]">{totalComments}</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mt-2">Discussion Topics</h2>
                        <p className="text-gray-500">Review feedback and comments from the team</p>
                    </div>
                    {/* Expand/collapse all button */}
                    <Button
                        variant="outline"
                        className="h-10 px-4 flex items-center gap-2 self-start mt-4 md:mt-0"
                        onClick={() => setAllOpen((open) => !open)}
                    >
                        {allOpen ? (
                            <>
                                <ChevronUp className="w-4 h-4" />
                                Collapse all
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4" />
                                Expand all
                            </>
                        )}
                    </Button>
                </div>

                <Accordion
                    type="multiple"
                    value={openAccordionItems}
                    className="space-y-2 animate-fade-in"
                >
                    {healthCategories.map((category) => {
                        const score = aggregatedResponses[category.questionId]?.average || 0;
                        const bgColor = getBgColorByScore(score);
                        return (
                            <AccordionItem
                                key={category.id}
                                value={category.id}
                                className={`border rounded-lg px-4 transition-colors duration-500 ${bgColor}`}
                            >
                                <div className="flex items-center justify-between w-full py-4">
                                    <span className="font-medium text-gray-900">{category.subject}</span>
                                    <span className="text-sm font-semibold bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                                        {score.toFixed(1)}/5
                                    </span>
                                </div>
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

                {/* Top Challenges Section */}
                <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-2">Top challenges</h3>
                    {topChallenges.length > 0 ? (
                        <ul className="list-disc list-inside flex flex-col gap-2 animate-fade-in">
                            {topChallenges.map((item, idx) => (
                                <li
                                    key={idx}
                                    className="text-gray-700 flex items-center justify-between bg-orange-50 px-3 py-2 rounded"
                                >
                                    {/* Span for challenge, truncated if too long */}
                                    <span className="truncate max-w-[320px]" title={item}>
                                        {item}
                                    </span>
                                    <span className="ml-4 min-w-[120px] max-w-[140px]">
                                        <TagDropdown
                                            value={challengeTags[idx] || "TBD"}
                                            onChange={(tag) => handleTagChange(idx, tag)}
                                            // Truncate any tag display using Tailwind in dropdown
                                            className="block truncate max-w-[100px]"
                                        />
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No challenges reported yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
