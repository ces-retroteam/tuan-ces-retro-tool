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
      <ResponsiveContainer width={700} height={500}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formattedData}>
          <PolarGrid 
            stroke="#e5e7eb" 
            gridType="polygon"
            strokeWidth={0.5}
            strokeOpacity={0.5}
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
            stroke="#e5e7eb"
            strokeOpacity={0.5}
          />
          <Radar
            name="Average"
            dataKey="average"
            stroke="#FF4444"
            strokeWidth={2}
            fill="#FFCDD2"
            fillOpacity={0.3}
            dot={{ r: 4, fill: "#fff", stroke: "#FF4444", strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      <div className="flex items-center mt-4 gap-8 text-xs">
        <div className="flex items-center gap-1">
          <span style={{ width:12, height:7, background: "#FFCDD2", border: "1px solid #FF4444", display:"inline-block", borderRadius:2, marginRight:8 }}></span>
          <span className="text-gray-600 uppercase tracking-tight font-medium">Score Distribution</span>
        </div>
      </div>
    </div>
  );
}
