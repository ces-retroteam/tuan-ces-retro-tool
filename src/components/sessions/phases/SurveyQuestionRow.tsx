
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UserCircle } from "lucide-react";

export interface SurveyQuestionRowProps {
  question: {
    id: string;
    text: string;
    description?: string;
    required?: boolean;
  };
  value: number | undefined;
  comment: string;
  onValueChange: (value: number) => void;
  onCommentChange: (comment: string) => void;
  disabled?: boolean;
}

const COLORS = [
  "bg-[#ea384c] text-white",             // 0 - Red
  "bg-[#c07213] text-white",             // 1 - Orange
  "bg-[#aa9231] text-white",             // 2 - Yellow Gold
  "bg-[#698c10] text-white",             // 3 - Olive Green
  "bg-[#6ca543] text-white",             // 4 - Lighter Green
  "bg-[#55bb6a] text-white",             // 5 - Green
];

export default function SurveyQuestionRow({
  question,
  value,
  comment,
  onValueChange,
  onCommentChange,
  disabled,
}: SurveyQuestionRowProps) {
  return (
    <div className="bg-[#1a1f2c] rounded-lg px-6 py-5 my-4 flex flex-col md:flex-row md:items-start md:gap-6">
      <div className="md:w-2/5 flex flex-col gap-2 mb-4 md:mb-0">
        <Label className="text-base text-white font-semibold flex gap-2">
          {question.text}
          {question.required && <span className="text-[#ea384c]">*</span>}
        </Label>
        {question.description && (
          <span className="text-sm text-[#9f9ea1]">{question.description}</span>
        )}
      </div>
      <div className="flex-1 flex flex-col md:flex-row gap-6 w-full md:items-start">
        {/* Scale numbers 0-5 in a row */}
        <div className="flex flex-col min-w-[280px]">
          <div className="flex items-center gap-3 mb-3 justify-between">
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold 
                  transition-all border-2 border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coolGray-300
                  ${value === num ? "ring-2 ring-[#55bb6a]" : ""}
                  ${COLORS[num]}`}
                style={{
                  opacity: disabled ? 0.7 : 1,
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
                disabled={disabled}
                onClick={() => onValueChange(num)}
                aria-label={"Rate " + num}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-[#8e9196]">
            <span className="ml-1">NEVER</span>
            <span className="mr-2">ALWAYS</span>
          </div>
        </div>
        {/* Comment input */}
        <div className="flex-1 flex items-start">
          <UserCircle className="text-[#8e9196] mr-3 mt-2 flex-shrink-0" size={22} />
          <Textarea
            placeholder="Additional comments..."
            className="bg-[#222] border border-[#333] text-white min-h-[48px] px-3 py-2 text-sm flex-1 w-full"
            value={comment}
            onChange={e => onCommentChange(e.target.value)}
            disabled={disabled}
            id={"comment_" + question.id}
          />
        </div>
      </div>
    </div>
  );
}
