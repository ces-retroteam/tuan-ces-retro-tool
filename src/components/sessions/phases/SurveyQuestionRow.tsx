
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Dummy current user data (replace with actual user info in a real app)
const currentUser = {
  name: "Alex Johnson",
  avatarUrl: "",
};

// Updated color array to accommodate 10 scores
const COLORS = [
  "bg-[#ea384c] text-white", // 1 - Red
  "bg-[#E15D2F] text-white", // 2 
  "bg-[#aa9231] text-white", // 3
  "bg-[#aa9231] text-white", // 4
  "bg-[#aa9231] text-white", // 5
  "bg-[#aa9231] text-white", // 6
  "bg-[#6ca543] text-white", // 7
  "bg-[#6ca543] text-white", // 8
  "bg-[#55bb6a] text-white", // 9
  "bg-[#55bb6a] text-white", // 10 - Green
];

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

export default function SurveyQuestionRow({
  question,
  value,
  comment,
  onValueChange,
  onCommentChange,
  disabled,
}: SurveyQuestionRowProps) {
  const anySelected = typeof value === "number" && Array.from({length: 10}, (_, i) => i + 1).includes(value);

  return (
    <div className="bg-white rounded-2xl px-6 py-6 my-6 flex flex-col gap-4 relative">
      {/* QUESTION TEXT */}
      <div className="flex flex-col gap-1">
        <Label
          className="
            text-[1.125rem] font-bold leading-tight text-[#222]
            flex items-center gap-2 uppercase tracking-tight
          "
        >
          {question.text}
          {question.required && (
            <span className="text-[#ea384c] text-lg" aria-label="Required">*</span>
          )}
        </Label>
        {question.description && (
          <span className="text-sm text-[#555] font-normal">{question.description}</span>
        )}
      </div>

      {/* SCORE SCALE */}
      <div className="flex flex-row items-center gap-8">
        <div className="flex flex-row gap-2 flex-wrap">
          {Array.from({length: 10}, (_, i) => i + 1).map((num, idx) => {
            const isSelected = value === num;
            const colorClass =
              anySelected
                ? (isSelected ? COLORS[idx] : "bg-gray-300 text-white")
                : COLORS[idx];

            return (
              <button
                key={num}
                type="button"
                className={[
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition focus-visible:ring-2 ring-[#E15D2F]",
                  isSelected
                    ? "ring-2 border-orange-500 ring-orange-500 scale-110"
                    : "border-gray-200 opacity-80",
                  colorClass,
                  disabled
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:brightness-110 hover:scale-105",
                ].join(" ")}
                disabled={disabled}
                onClick={() => !disabled && onValueChange(num)}
                aria-label={`Score ${num}`}
              >
                {num}
              </button>
            );
          })}
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-col items-start">
            <span className="text-xs text-gray-600 font-medium">1: Never / Poor performance</span>
            <span className="text-xs text-gray-600">10: Always / Excellent performance</span>
          </div>
        </div>
      </div>

      {/* COMMENT INPUT WITH OVERLAPPING AVATAR */}
      <div className="relative w-full">
        <Avatar className="absolute -left-3 -top-0 z-10 h-8 w-8 shrink-0 border">
          {currentUser.avatarUrl ? (
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
          ) : (
            <AvatarFallback>
              {currentUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          )}
        </Avatar>
        <Textarea
          placeholder="Add a comment (optional)..."
          className="bg-[#F7F7F7] border border-gray-200 text-[#222] min-h-[42px] pl-12 py-2 text-base flex-1 resize-none shadow-sm rounded-lg focus-visible:border-orange-500"
          value={comment}
          onChange={e => onCommentChange(e.target.value)}
          disabled={disabled}
          id={"comment_" + question.id}
          maxLength={256}
          style={{
            fontFamily: "Inter, Helvetica, Arial, sans-serif",
            lineHeight: 1.5,
            fontWeight: 400,
          }}
        />
      </div>
    </div>
  );
}
