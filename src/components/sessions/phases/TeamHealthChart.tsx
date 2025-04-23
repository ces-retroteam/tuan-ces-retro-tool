import { ChartContainer } from "@/components/ui/chart";
import { Session } from "@/types";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
interface TeamHealthChartProps {
    session: Session;
}

export default function TeamHealthChart({ session }: TeamHealthChartProps) {
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
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="#f0cab6" strokeWidth={1} />
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
