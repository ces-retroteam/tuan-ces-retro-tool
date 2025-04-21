
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";

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

// Color classes for scores 1-5
const COLORS = [
  "bg-[#ea384c] text-white", // 1 - Red
  "bg-[#c07213] text-white", // 2 - Orange
  "bg-[#aa9231] text-white", // 3 - Yellow/Gold
  "bg-[#6ca543] text-white", // 4 - Light Green
  "bg-[#55bb6a] text-white", // 5 - Green
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
    <div className="bg-[#1a1f2c] rounded-2xl px-6 py-6 my-6 flex flex-col gap-2 md:gap-4">
      <div className="flex flex-col gap-1">
        <Label className="text-base text-white font-bold flex items-center gap-2">
          {question.text}
          {question.required && <span className="text-[#ea384c] text-lg">*</span>}
        </Label>
        {question.description && (
          <span className="text-sm text-[#9f9ea1]">{question.description}</span>
        )}
      </div>
      {/* Scale options 1-5, laid out horizontally, separated */}
      <div className="flex flex-row items-center gap-6 mt-3">
        <div className="flex flex-row items-center gap-4">
          {[1, 2, 3, 4, 5].map((num, idx) => (
            <button
              key={num}
              type="button"
              className={`
                w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold border-2 focus-visible:ring-2 transition
                ${value === num ? "ring-2 ring-[#6ca543]" : ""}
                ${COLORS[idx]}
                ${disabled ? "opacity-60 cursor-not-allowed" : "hover:brightness-110"}
              `}
              disabled={disabled}
              onClick={() => !disabled && onValueChange(num)}
              aria-label={"Rate " + num}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="flex flex-row items-center gap-2 ml-4">
          <span className="text-xs text-[#8e9196] font-medium">Never</span>
          <span className="mx-2 text-xs text-[#8e9196]">|</span>
          <span className="text-xs text-[#8e9196] font-medium">Always</span>
        </div>
      </div>
      {/* Comment Box */}
      <div className="flex flex-row items-center gap-3 mt-4">
        <MessageSquare className="text-[#8e9196]" size={20} />
        <Textarea
          placeholder="Your comment (optional)..."
          className="bg-[#222] border border-[#333] text-white min-h-[44px] px-3 py-2 text-sm flex-1 resize-none shadow-sm rounded-lg"
          value={comment}
          onChange={e => onCommentChange(e.target.value)}
          disabled={disabled}
          id={"comment_" + question.id}
          maxLength={256}
        />
      </div>
    </div>
  );
}
