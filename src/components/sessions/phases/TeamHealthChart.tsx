
import { ChartContainer } from "@/components/ui/chart";
import { Session } from "@/types";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
interface TeamHealthChartProps {
    session: Session;
    avgScoreAllTopics: string;
    totalComments: number;
}
export default function TeamHealthChart({ session, avgScoreAllTopics, totalComments }: TeamHealthChartProps) {
    const chartData = [
        { subject: "Team Collaboration", value: 3.5 },
        { subject: "Sprint Goal Confidence", value: 7 },
        { subject: "Technical Practices", value: 5 },
        { subject: "Work-Life Balance", value: 3 },
        { subject: "Team Morale", value: 4.3 },
    ];

    const chartConfig = {
        line1: {
            theme: { light: "#E15D2F", dark: "#E15D2F" },
        },
    };

    const renderPolarAngleAxis = ({ payload, x, y, cx, cy, ...rest }: any) => {
        return (
            <g>
                <text
                    x={x}
                    y={y}
                    textAnchor={x > cx ? "start" : x < cx ? "end" : "middle"}
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

            <div className="flex gap-4 mb-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FAFAFB] border">
                    <span className="text-[15px] text-[#8E9196] font-medium">Avg. Score</span>
                    <span className="font-bold text-[20px] text-[#E15D2F]">{avgScoreAllTopics}</span>
                    <span className="ml-1 text-[#8E9196]">/5</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FAFAFB] border">
                    <span className="text-[15px] text-[#8E9196] font-medium">Comments</span>
                    <span className="font-bold text-[20px] text-[#9b87f5]">{totalComments}</span>
                </div>
            </div>

            <div className="w-full h-[400px]">
                <ChartContainer config={chartConfig} className="w-full h-full">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="#f0d3c6" strokeWidth={1} />
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
                            stroke="#E15D2F"
                            strokeWidth={1}
                            fill="#E15D2F"
                            fillOpacity={0.5}
                        />
                    </RadarChart>
                </ChartContainer>
            </div>
        </div>
    );
}
