
import { ChartContainer } from "@/components/ui/chart";
import { Session } from "@/types";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";

interface TeamHealthChartProps {
    session: Session;
    avgScoreAllTopics: string;
    totalComments: number;
}

export default function TeamHealthChart({ session, avgScoreAllTopics, totalComments }: TeamHealthChartProps) {
    // Radar chart data with more dimensions as shown in the image
    const chartData = [
        { subject: "Ownership", value: 3.5 },
        { subject: "Value", value: 4.2 },
        { subject: "Goal Alignment", value: 2.8 },
        { subject: "Communication", value: 3.0 },
        { subject: "Team Roles", value: 1.5 },
        { subject: "Velocity", value: 2.5 },
        { subject: "Support and Resources", value: 5 },
        { subject: "Process", value: 5 },
        { subject: "Fun", value: 4.2 },
    ];

    const chartConfig = {
        line1: {
            theme: { light: "#000000", dark: "#000000" },
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
        <Card className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900">Health radar</h2>
            
            <div className="flex gap-4 mb-6">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FAFAFB] border">
                    <span className="text-[15px] text-[#8E9196] font-medium">Avg. Score</span>
                    <span className="font-bold text-[20px] text-[#F97316]">{avgScoreAllTopics}</span>
                    <span className="ml-1 text-[#8E9196]">/5</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FAFAFB] border">
                    <span className="text-[15px] text-[#8E9196] font-medium">Comments</span>
                    <span className="font-bold text-[20px] text-[#9b87f5]">{totalComments}</span>
                </div>
            </div>

            <div className="w-full h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ChartContainer config={chartConfig}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                            <PolarGrid stroke="#e0e0e0" strokeWidth={1} />
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
                                stroke="#000000"
                                strokeWidth={2}
                                fill="#c7e9b0"
                                fillOpacity={0.3}
                            />
                        </RadarChart>
                    </ChartContainer>
                </ResponsiveContainer>
            </div>
            
            {/* Health Check Breakdown Table */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Team Health Radar</h3>
                    <button className="text-sm text-blue-500">SHOW BREAKDOWN</button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-sm text-gray-500">
                                <th className="p-2 text-left"></th>
                                <th className="p-2 text-center">Health check fff<br/>2023-03-03<br/>Ø 3.2</th>
                                <th className="p-2 text-center">Health check 1<br/>2023-03-17<br/>Ø 3.5</th>
                                <th className="p-2 text-center">Health check 1<br/>2023-03-31<br/>Ø 4.2</th>
                                <th className="p-2 text-center">Health check 1<br/>IN PROGRESS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                "Ownership", "Value", "Goal Alignment", "Communication", 
                                "Team Roles", "Velocity", "Support and Resources", "Process", "Fun"
                            ].map((dimension, index) => (
                                <tr key={dimension} className="border-t">
                                    <td className="p-2 text-left font-medium">{dimension}</td>
                                    <td className="p-2 text-center">-</td>
                                    <td className="p-2">
                                        {index % 3 === 0 && (
                                            <div className="bg-yellow-400 text-white text-center py-1 font-medium rounded">
                                                3a
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-2">
                                        {index % 2 === 0 && (
                                            <div className={`${index % 4 === 0 ? 'bg-green-400' : 'bg-orange-400'} text-white text-center py-1 font-medium rounded`}>
                                                {index % 4 === 0 ? '4a' : '2a'}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-2 text-center">-</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    );
}

interface CardProps {
    className?: string;
    children: React.ReactNode;
}

function Card({ className, children }: CardProps) {
    return (
        <div className={`bg-white rounded-lg shadow-sm ${className || ''}`}>
            {children}
        </div>
    );
}
