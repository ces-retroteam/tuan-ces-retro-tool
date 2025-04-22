
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

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
    <div className="w-full flex flex-col space-y-8 bg-white px-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Team Health Summary</h2>
        <p className="text-gray-500 mt-1">Average scores from all participants for health check sprint 11</p>
      </div>

      <div className="w-full flex flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height={450}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={formattedData}>
            <PolarGrid 
              stroke="#e5e7eb" 
              gridType="polygon"
              strokeWidth={0.5}
              strokeOpacity={0.5}
            />
            <PolarAngleAxis
              dataKey="label"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickLine={false}
            />
            <PolarRadiusAxis 
              domain={[0, 5]} 
              tickCount={6} 
              angle={90} 
              axisLine={false}
              tick={{ fill: "#374151", fontSize: 10 }}
              stroke="#e5e7eb"
              strokeOpacity={0.5}
            />
            <Radar
              name="Average"
              dataKey="average"
              stroke="#E76F51"
              strokeWidth={2}
              fill="#FAE1DD"
              fillOpacity={0.6}
              dot={false}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Discussion Topics</h2>
        <p className="text-gray-500 mb-6">Review feedback and comments from the team</p>
        
        <div className="space-y-4">
          {formattedData.map((item) => (
            <Collapsible key={item.label} className="border rounded-lg">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-900">{item.label}</span>
                  <span className="text-sm font-semibold bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                    {item.average.toFixed(1)}/5
                  </span>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-500 transform transition-transform duration-200 ease-in-out" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 pt-0">
                <p className="text-gray-600">No comments yet.</p>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
}
