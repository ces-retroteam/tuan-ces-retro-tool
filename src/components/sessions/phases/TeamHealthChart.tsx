
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { useSession } from '@/context/SessionContext';
import { Session } from '@/types';
import { ChartContainer } from "@/components/ui/chart";

interface TeamHealthChartProps {
  session: Session;
}

export default function TeamHealthChart({ session }: TeamHealthChartProps) {
  const { participants } = useSession();

  const relevantParticipants = participants.filter(p => 
    p.responses && p.responses.some(r => r.questionId === 'delivery_1')
  );

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

  const chartConfig = {
    line1: { 
      theme: { light: "#FEC6A1", dark: "#FEC6A1" }
    }
  };

  const renderPolarAngleAxis = ({ payload, x, y, cx, cy, ...rest }: any) => {
    return (
      <g>
        <text
          x={x}
          y={y}
          textAnchor={x > cx ? 'start' : x < cx ? 'end' : 'middle'}
          fill="#555555"
          fontSize={12}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900">Team Health Summary</h2>
      <p className="text-gray-500 mb-6">Average scores from all participants for health check sprint</p>
      
      <div className="w-full h-[400px]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <RadarChart 
            cx="50%" 
            cy="50%" 
            outerRadius="80%" 
            data={chartData}
          >
            <PolarGrid 
              stroke="#F1F0FB" 
              strokeWidth={0.5} 
            />
            <PolarAngleAxis
              dataKey="subject"
              tick={renderPolarAngleAxis}
              stroke="none"
              fontSize={12}
              tickLine={false}
            />
            <Radar
              name="Team Health"
              dataKey="value"
              stroke="#FEC6A1"
              strokeWidth={1}
              fill="#FEC6A1"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
