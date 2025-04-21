
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
      <ResponsiveContainer width={600} height={450}>
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={formattedData}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF6B6B" /> {/* Score 1 - Red */}
              <stop offset="25%" stopColor="#FFB86C" /> {/* Score 2 - Orange */}
              <stop offset="50%" stopColor="#FFD93D" /> {/* Score 3 - Yellow */}
              <stop offset="75%" stopColor="#95E08D" /> {/* Score 4 - Light Green */}
              <stop offset="100%" stopColor="#4CAF50" /> {/* Score 5 - Green */}
            </linearGradient>
          </defs>
          <PolarGrid 
            stroke="#e5e7eb" 
            gridType="circle"
            fill="url(#scoreGradient)" 
            fillOpacity={0.15} 
          />
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
          <PolarRadiusAxis 
            domain={[0, 5]} 
            tickCount={6} 
            angle={90} 
            axisLine={false} 
            tick={{ fill: "#374151" }}
          />
          <Radar
            name="Average"
            dataKey="average"
            stroke="#FFFFFF"
            strokeWidth={3}
            fill="rgba(255, 255, 255, 0.3)"
            dot={{ r: 6, fill: "#fff", stroke: "#E15D2F", strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      <div className="flex items-center mt-4 gap-8 text-xs">
        <div className="flex items-center gap-1">
          <span style={{ width:12, height:7, background: "linear-gradient(90deg,#FF6B6B 0%,#FFB86C 25%,#FFD93D 50%,#95E08D 75%,#4CAF50 100%)", display:"inline-block", borderRadius:2, marginRight:8 }}></span>
          <span className="text-gray-600 uppercase tracking-tight font-medium">Distribution</span>
        </div>
        <div className="flex items-center gap-1">
          <span style={{ width: 30, height: 3, display: "inline-block", background: "#FFFFFF", borderRadius: 2, border: "1px solid #E5E7EB" }}></span>
          <span className="text-gray-600 uppercase tracking-tight font-medium">Mean</span>
        </div>
      </div>
    </div>
  );
}
