
import { useSession } from '@/context/SessionContext';
import { Session } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TeamHealthChart from './TeamHealthChart';

interface DiscussPhaseProps {
  session: Session;
  isParticipant?: boolean;
}

// Helpers for extracting challenges
const extractTopChallenges = (participants: any[]) => {
  // Additional items stored as { questionId: "additional_X", value: "the challenge" }
  const challengeItems: string[] = [];
  participants.forEach(p => {
    if (!p.responses) return;
    p.responses.forEach((r: any) => {
      if (r.questionId.startsWith("additional_") && typeof r.value === "string") {
        challengeItems.push(r.value);
      }
    });
  });
  return challengeItems;
};

export default function DiscussPhase({ session, isParticipant = false }: DiscussPhaseProps) {
  const { participants } = useSession();
  // Only show participants with responses for questions of interest
  const relevantParticipants = participants.filter(p =>
    p.responses && p.responses.some(r => r.questionId === session.template.questions[0].id)
  );

  // Calculate aggregated score per main dimension as in the chart
  const healthCategories = [
    {
      id: "collab_1",
      subject: "Team Collaboration",
      questionId: "collab_1",
      explanation: "Measures how well team members work together, communicate, and support each other in daily activities.",
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

  // Calculate average scores
  const aggregatedResponses: Record<string, { average: number; count: number }> = {};
  healthCategories.forEach((category) => {
    const responses = relevantParticipants
      .map(p => p.responses?.find(r => r.questionId === category.questionId))
      .filter(Boolean)
      .map(r => Number(r.value));
    const sum = responses.reduce((acc, num) => acc + (Number(num) || 0), 0);
    const avg = responses.length > 0 ? sum / responses.length : 0;
    aggregatedResponses[category.questionId] = {
      average: Math.round(avg * 10) / 10,
      count: responses.length,
    };
  });

  // Top challenges
  const topChallenges: string[] = extractTopChallenges(relevantParticipants);

  return (
    <div className="w-full space-y-6">
      <TeamHealthChart session={session} />

      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Discussion Topics</h2>
            <p className="text-gray-500">Review feedback and comments from the team</p>
          </div>
        </div>

        <Accordion type="single" collapsible className="space-y-2 animate-fade-in">
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

        {/* NEW: Top Challenges Section */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2 text-[#ea384c]">Top challenges</h3>
          {topChallenges.length > 0 ? (
            <ul className="list-disc list-inside flex flex-col gap-2 animate-fade-in">
              {topChallenges.map((item, idx) => (
                <li key={idx} className="text-gray-700 bg-orange-50 px-3 py-2 rounded">
                  {item}
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
