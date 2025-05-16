
import { ChartContainer } from "@/components/ui/chart";
import { Session } from "@/types";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

interface TeamHealthChartProps {
    session: Session;
    avgScoreAllTopics: string;
    totalComments: number;
}
export default function TeamHealthChart({ session, avgScoreAllTopics, totalComments }: TeamHealthChartProps) {
    const isMobile = useIsMobile();
    
    const chartData = [
        { subject: "Team Collaboration", value: 3.5 },
        { subject: "Sprint Goal Confidence", value: 7 },
        { subject: "Technical Practices", value: 5 },
        { subject: "Work-Life Balance", value: 3 },
        { subject: "Team Morale", value: 4.3 },
    ];

    const chartConfig = {
        line1: {
            theme: { light: "#FEC6A1", dark: "#FEC6A1" },
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
                    fontSize={isMobile ? 10 : 12}
                >
                    {isMobile && payload.value.length > 10
                        ? payload.value.substring(0, 10) + "..."
                        : payload.value}
                </text>
            </g>
        );
    };

    return (
        <div className="bg-white rounded-lg p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Team Health Summary</h2>
            <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-6">Average scores from all participants for health check sprint</p>

            <div className="flex flex-col md:flex-row gap-3 mb-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FAFAFB] border">
                    <span className="text-[13px] md:text-[15px] text-[#8E9196] font-medium">Avg. Score</span>
                    <span className="font-bold text-[18px] md:text-[20px] text-[#F97316]">{avgScoreAllTopics}</span>
                    <span className="ml-1 text-[#8E9196]">/5</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FAFAFB] border">
                    <span className="text-[13px] md:text-[15px] text-[#8E9196] font-medium">Comments</span>
                    <span className="font-bold text-[18px] md:text-[20px] text-[#9b87f5]">{totalComments}</span>
                </div>
            </div>

            <div className="w-full h-[300px] md:h-[400px]">
                <ChartContainer config={chartConfig} className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius={isMobile ? "70%" : "80%"} data={chartData}>
                            <PolarGrid stroke="#f0cab6" strokeWidth={1} />
                            <PolarAngleAxis
                                dataKey="subject"
                                tick={renderPolarAngleAxis}
                                stroke="none"
                                fontSize={isMobile ? 10 : 12}
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
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
        </div>
    );
}
