
import { Check, Users } from "lucide-react";

interface TeamHealthMetricsSummaryProps {
  avgScore: string;
  actionItems: number;
  participationRate: string;
  totalParticipants: number;
}

export default function TeamHealthMetricsSummary({
  avgScore,
  actionItems,
  participationRate,
  totalParticipants
}: TeamHealthMetricsSummaryProps) {
  return (
    <div className="w-full bg-gradient-to-b from-slate-500 to-slate-600 text-white p-8 rounded-lg">
      <div className="text-center mb-8">
        <h2 className="text-xl font-medium">This health check has ended</h2>
      </div>
      
      <div className="flex justify-center gap-16">
        <div className="flex flex-col items-center">
          <div className="bg-yellow-400 text-black w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold mb-2">
            {avgScore}
          </div>
          <div className="font-medium">Overall health</div>
          <div className="text-sm text-slate-200">by {totalParticipants} participant{totalParticipants !== 1 ? 's' : ''}</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-blue-100 text-blue-800 w-10 h-10 rounded-full flex items-center justify-center mb-2">
            <Check className="w-5 h-5" />
          </div>
          <div className="font-medium">{actionItems} new actions</div>
          <div className="text-sm text-slate-200">+ {actionItems} existing open actions</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-blue-100 text-blue-800 w-10 h-10 rounded-full flex items-center justify-center mb-2">
            <Users className="w-5 h-5" />
          </div>
          <div className="font-medium">{participationRate} participation</div>
          <div className="text-sm text-slate-200">{totalParticipants}/12 invited participants</div>
        </div>
      </div>
    </div>
  );
}
