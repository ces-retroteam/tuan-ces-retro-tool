import React, { useState } from "react";
import { useSession } from "@/context/SessionContext";
import { Session } from "@/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TeamHealthChart from "./TeamHealthChart";
import TagDropdown, { ChallengeTag } from "./TagDropdown";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import CommentList from "./CommentList";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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

    // --- AVG SCORE BY CATEGORY ---
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
    const actualAverages = Object.values(aggregatedResponses).map((r) => r.average);
    const avgScoreAllTopics =
        actualAverages.length > 0
            ? (actualAverages.reduce((sum, val) => sum + val, 0) / actualAverages.length).toFixed(1)
            : "0.0";

    // ---- COMMENT COUNTER ----
    // Only count comments belonging to this session
    const sessionComments = Array.isArray(comments)
        ? comments.filter((comment) => comment.sessionId === session.id)
        : [];

    const totalComments = sessionComments.length;

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

    // State for focused topic modal (replaces Sheet)
    const [focusedTopic, setFocusedTopic] = useState<null | typeof healthCategories[0]>(null);

    // For accordion open/close
    const openAccordionItems = allOpen ? healthCategories.map((c) => c.id) : [];

    // Focused card on main list (null = none)
    const [cardFocusId, setCardFocusId] = useState<string | null>(null);

    return (
        <div className="w-full space-y-6">
            {/* TeamHealthChart + stats */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <TeamHealthChart session={session} avgScoreAllTopics={avgScoreAllTopics} totalComments={totalComments} />
                <div className="flex flex-row items-center gap-8 mt-2 self-end">
                    <div>
                        <div className="text-xs text-gray-400">Average score</div>
                        <div className="text-lg font-bold text-orange-700">{avgScoreAllTopics}/5</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400">Comments</div>
                        <div className="text-lg font-bold text-blue-700">{totalComments}</div>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg p-6">
                <div className="flex justify-between items-center flex-wrap mb-6">
                    {/* Stats at top-left */}
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold text-gray-900 mt-2">Discussion Topics</h2>
                        <p className="text-gray-500">Review feedback and comments from the team</p>
                    </div>
                    {/* Expand/collapse all button */}
                    <Button
                        variant="outline"
                        className="h-10 px-4 flex items-center gap-2 self-start mt-4"
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
                {/* List of clickable topic cards */}
                <div className="space-y-2 animate-fade-in">
                    {healthCategories.map((category) => {
                        const score = aggregatedResponses[category.questionId]?.average || 0;
                        const bgColor = getBgColorByScore(score);
                        const isFocused = cardFocusId === category.id;
                        // comments for this topic/question
                        const topicComments = sessionComments.filter((c) => c.questionId === category.questionId);
                        return (
                            <div
                                key={category.id}
                                tabIndex={0}
                                className={`border rounded-lg px-4 py-4 transition-colors duration-500 cursor-pointer focus:ring-2 ring-orange-300 mb-0.5
                                    ${bgColor} ${isFocused ? "ring-2 ring-violet-500 z-10" : ""}`}
                                onClick={() => {
                                    setFocusedTopic(category);
                                    setCardFocusId(category.id);
                                }}
                                onBlur={() => setCardFocusId(null)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div>
                                        <span className="font-medium text-gray-900 mr-2">{category.subject}</span>
                                        <span className="text-xs text-gray-500">{category.id}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold text-orange-800 px-2 py-0.5 rounded">
                                            {score.toFixed(1)}/5
                                        </span>
                                        <Button variant="ghost" size="icon" aria-label="Open details" onClick={(e) => {
                                            // Prevent onClick for parent, just open overlay
                                            e.stopPropagation();
                                            setFocusedTopic(category);
                                            setCardFocusId(category.id);
                                        }}>
                                            <ExternalLink className="w-5 h-5 text-gray-800" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="ml-1 mt-2 text-[14px] text-gray-600">
                                    {category.explanation}
                                </div>
                                {/* Focused state: Show comments under card */}
                                {isFocused && (
                                  <div className="mt-3">
                                    <div className="text-xs font-medium text-gray-500 mb-1">Comments for this topic:</div>
                                    <CommentList comments={topicComments} participants={participants} />
                                  </div>
                                )}
                            </div>
                        );
                    })}
                </div>
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
                                    <TagDropdown
                                        value={challengeTags[idx] || "TBD"}
                                        onChange={(tag) => handleTagChange(idx, tag)}
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No challenges reported yet.</p>
                    )}
                </div>
            </div>
            {/* Pop-up Dialog for focused topic (scrollable) */}
            <Dialog open={!!focusedTopic} onOpenChange={(open) => {
                if (!open) {
                    setFocusedTopic(null);
                    setCardFocusId(null);
                }
            }}>
                <DialogContent className="max-w-lg w-full max-h-[80vh] p-0 overflow-hidden">
                    {focusedTopic && (
                        <ScrollArea className="h-full max-h-[80vh] p-6">
                            <DialogHeader>
                                <DialogTitle>
                                    <span className="font-bold">{focusedTopic.subject}</span>
                                </DialogTitle>
                                <DialogDescription>
                                    {focusedTopic.explanation}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="mt-2 mb-4">
                                <span className="font-semibold text-orange-800">
                                    Score: {aggregatedResponses[focusedTopic.questionId]?.average?.toFixed(1)}/5
                                </span>
                            </div>
                            <div className="mb-3 mt-1">
                                <span className="text-sm text-gray-700 font-medium mb-2 block">All comments for this topic:</span>
                                <CommentList
                                    comments={sessionComments.filter((c) => c.questionId === focusedTopic.questionId)}
                                    participants={participants}
                                />
                            </div>
                        </ScrollArea>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
