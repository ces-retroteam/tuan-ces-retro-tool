import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { MessageSquare } from "lucide-react";

interface RadarChartSectionProps {
  data: {
    label: string;
    average: number;
    commentCount: number;
    color: string;
  }[];
}

const getTopicFromQuestion = (question: string): string => {
  // Map of keywords to their topic labels
  const topicMap: { [key: string]: string } = {
    'job satisfaction': 'Satisfaction',
    'collaborating': 'Collaboration',
    'ideas': 'Ideas',
    'work-life balance': 'Work-Life',
    'effective': 'Effectiveness',
    'communication': 'Communication',
    'meetings': 'Meetings',
    'information': 'Information',
    'delivering value': 'Value'
  };

  // Find the first matching keyword in the question
  const topic = Object.entries(topicMap).find(([key]) => 
    question.toLowerCase().includes(key)
  );

  return topic ? topic[1] : question.split('?')[0].slice(0, 12) + '...';
};

export default function RadarChartSection({ data }: RadarChartSectionProps) {
  const formattedData = data.map(item => ({
    ...item,
    label: getTopicFromQuestion(item.label)
  }));

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 bg-white">
      <ResponsiveContainer width={500} height={380}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={formattedData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="label"
            tick={({ payload, x, y, index }) => {
              const item = formattedData[index];
              return (
                <g transform={`translate(${x},${y})`}>
                  <foreignObject x={-60} y={-35} width={120} height={60}>
                    <div className="flex flex-col items-center">
                      <span
                        className={`rounded-full px-3 py-0.5 font-bold text-xs ${
                          item.color === "#5E9323" 
                            ? "bg-[rgba(94,147,35,1)] text-white" 
                            : "bg-[#E15D2F] text-white"
                        }`}
                        style={{ minWidth: "70px", textAlign: "center", display: "inline-block" }}
                      >
                        {payload.value}
                      </span>
                      <span className="flex items-center justify-center gap-0.5 mt-1 text-[12px] text-gray-400">
                        <MessageSquare size={13} color="#aaa" className="inline" />
                        <span>{item.commentCount}</span>
                      </span>
                    </div>
                  </foreignObject>
                </g>
              );
            }}
            tickLine={false}
          />
          <PolarRadiusAxis domain={[1, 5]} tickCount={5} angle={90} axisLine={false} tick={{ fill: "#374151" }} />
          <Radar
            name="Average"
            dataKey="average"
            stroke="url(#colorGradient)"
            fill="url(#colorGradient)"
            fillOpacity={0.15}
            dot={{ r: 6, fill: "#fff", stroke: "#E15D2F", strokeWidth: 2 }}
            isAnimationActive={false}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E15D2F" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#5E9323" />
            </linearGradient>
          </defs>
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex items-center mt-4 gap-8 text-xs">
        <div className="flex items-center gap-1">
          <span style={{ width:12, height:7, background: "linear-gradient(90deg,#E15D2F 10%,#ffe345 96%,#5E9323 133%)", display:"inline-block",borderRadius:2,marginRight:8 }}></span>
          <span className="text-gray-600 uppercase tracking-tight font-medium">Distribution</span>
        </div>
        <div className="flex items-center gap-1">
          <span style={{ width: 30, height: 6, display: "inline-block", background: "#E15D2F", borderRadius: 2 }}></span>
          <span className="text-gray-600 uppercase tracking-tight font-medium">Mean</span>
        </div>
      </div>
    </div>
  );
}
