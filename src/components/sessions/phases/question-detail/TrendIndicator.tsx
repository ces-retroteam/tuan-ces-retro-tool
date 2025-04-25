
import { Question } from "@/types";
import { cn } from "@/lib/utils";

export function TrendIndicator({ trend }: { trend: Question["trend"] }) {
  return (
    <div className={cn(
      "flex items-center gap-1 px-2 py-1 rounded text-sm",
      trend === "up" && "text-green-500 bg-green-500/10",
      trend === "down" && "text-red-500 bg-red-500/10",
      trend === "steady" && "text-yellow-500 bg-yellow-500/10"
    )}>
      {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
      <span className="capitalize">{trend}</span>
    </div>
  );
}
