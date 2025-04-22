
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { useSession } from '@/context/SessionContext';
import { Session } from '@/types';

interface TeamHealthChartProps {
  session: Session;
}

export default function TeamHealthChart({ session }: TeamHealthChartProps) {
  const { participants } = useSession();

  // Get all participants who have submitted responses
  const relevantParticipants = participants.filter(p => 
    p.responses && p.responses.some(r => r.questionId === 'delivery_1')
  );

  // Calculate average scores for each category
  const calculateAverageScore = (questionId: string): number => {
    const responses = relevantParticipants
      .map(p => p.responses?.find(r => r.questionId === questionId))
      .filter(Boolean)
      .map(r => Number(r.value));

    const sum = responses.reduce((acc, val) => acc + val, 0);
    return responses.length > 0 ? Math.round((sum / responses.length) * 10) / 10 : 0;
  };

  const chartData = [
    { subject: 'Team Collaboration', value: calculateAverageScore('collab_1') },
    { subject: 'Sprint Goal Confidence', value: calculateAverageScore('delivery_1') },
    { subject: 'Technical Practices', value: calculateAverageScore('delivery_2') },
    { subject: 'Work-Life Balance', value: calculateAverageScore('collab_2') },
    { subject: 'Team Morale', value: calculateAverageScore('collab_3') }
  ];

  return (
    <div className="bg-white rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900">Team Health Summary</h2>
      <p className="text-gray-500 mb-6">Average scores from all participants for health check sprint</p>
      
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="#aaadb0" strokeWidth={0.5} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#555555', fontSize: 12 }}
              stroke="none"
            />
            <Radar
              name="Team Health"
              dataKey="value"
              stroke="#ea384c"
              strokeWidth={2}
              fill="#FDE1D3"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
