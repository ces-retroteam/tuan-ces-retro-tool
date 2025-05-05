
import { ChartContainer } from "@/components/ui/chart";
import { Session } from "@/types";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TeamHealthChartProps {
    session: Session;
    avgScoreAllTopics: string;
    totalComments: number;
}

export default function TeamHealthChart({ session, avgScoreAllTopics, totalComments }: TeamHealthChartProps) {
    const chartData = [
        { subject: "Ownership", value: 3.5 },
        { subject: "Value", value: 4.2 },
        { subject: "Goal Alignment", value: 2.8 },
        { subject: "Communication", value: 3.5 },
        { subject: "Team Morale", value: 1.5 },
        { subject: "Velocity", value: 2.2 },
        { subject: "Support and Resources", value: 3.7 },
        { subject: "Process", value: 5.0 },
        { subject: "Fun", value: 4.3 },
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
        <Card className="mt-6 border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100 font-bold">Team Health Radar</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full h-[400px]">
                    <ChartContainer config={chartConfig} className="w-full h-full">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                            <PolarGrid stroke="#e5e7eb" strokeWidth={1} />
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
                                strokeWidth={2}
                                fill="#E15D2F"
                                fillOpacity={0.2}
                            />
                        </RadarChart>
                    </ChartContainer>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-4 gap-2 mt-2">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Topic</div>
                        <div className="text-sm font-medium text-center text-gray-700 dark:text-gray-300">Health check 1</div>
                        <div className="text-sm font-medium text-center text-gray-700 dark:text-gray-300">Health check 2</div>
                        <div className="text-sm font-medium text-center text-gray-700 dark:text-gray-300">Health check 3</div>
                    </div>
                    
                    {chartData.map((item) => (
                        <div key={item.subject} className="grid grid-cols-4 gap-2 py-2 border-b border-gray-200 dark:border-gray-700">
                            <div className="text-sm text-gray-700 dark:text-gray-300">{item.subject}</div>
                            <div className="flex justify-center">
                                {renderScoreBadge(Math.floor(Math.random() * 5) + 1)}
                            </div>
                            <div className="flex justify-center">
                                {renderScoreBadge(Math.floor(Math.random() * 5) + 1)}
                            </div>
                            <div className="flex justify-center">
                                {renderScoreBadge(Math.floor(item.value))}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function renderScoreBadge(score: number) {
    const colors = {
        1: "bg-red-400 text-white",
        2: "bg-orange-400 text-white",
        3: "bg-yellow-400 text-black",
        4: "bg-lime-400 text-black",
        5: "bg-green-400 text-white",
    };
    
    return (
        <div className={`${colors[score as keyof typeof colors]} text-sm px-2 py-1 rounded-md min-w-8 text-center`}>
            {score}
        </div>
    );
}
