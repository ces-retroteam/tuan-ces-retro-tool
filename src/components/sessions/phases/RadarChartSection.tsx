
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Comment } from "@/types";
import { MessageSquare } from "lucide-react";

interface RadarChartSectionProps {
  data: {
    label: string;
    average: number;
    commentCount: number;
    color: string;
  }[];
}

export default function RadarChartSection({ data }: RadarChartSectionProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-6" style={{ background: "#1A1F2C" }}>
      <ResponsiveContainer width={500} height={380}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#333" />
          <PolarAngleAxis
            dataKey="label"
            tick={({ payload, x, y, index }) => {
              // Custom label with comment icon and count
              const item = data[index];
              return (
                <g transform={`translate(${x},${y})`}>
                  <foreignObject x={-60} y={-35} width={120} height={60}>
                    <div className="flex flex-col items-center">
                      <span
                        className={`rounded-full px-3 py-0.5 font-bold text-xs ${item.color === "#5E9323"
                          ? "bg-[rgba(94,147,35,1)] text-white"
                          : "bg-[#F97316] text-white"
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
          <PolarRadiusAxis domain={[1, 5]} tickCount={5} angle={90} axisLine={false} tick={{ fill: "#fff" }} />
          <Radar
            name="Average"
            dataKey="average"
            stroke="#fff"
            fill="#fff"
            fillOpacity={0.15}
            dot={{ r: 6, fill: "#fff", stroke: "#fff", strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex items-center mt-4 gap-8 text-xs">
        <div className="flex items-center gap-1">
          <span style={{ width:12, height:7, background: "linear-gradient(90deg,#ea384c 10%,#ffe345 96%,#5E9323 133%)", display:"inline-block",borderRadius:2,marginRight:8 }}></span>
          <span className="text-gray-400">DISTRIBUTION</span>
        </div>
        <div className="flex items-center gap-1">
          <span style={{ width: 30, height: 6, display: "inline-block", background: "#fff", borderRadius: 2 }}></span>
          <span className="text-gray-400">MEAN</span>
        </div>
      </div>
    </div>
  );
}
