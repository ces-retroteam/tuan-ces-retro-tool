
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

interface TeamHealthChartProps {
  data: Array<{
    subject: string;
    value: number;
  }>;
}

export default function TeamHealthChart({ data }: TeamHealthChartProps) {
  return (
    <div className="bg-white rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900">Team Health Summary</h2>
      <p className="text-gray-500 mb-6">Average scores from all participants for health check sprint</p>
      
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
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
