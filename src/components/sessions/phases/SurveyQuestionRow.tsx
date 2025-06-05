
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Dummy current user data (replace with actual user info in a real app)
const currentUser = {
  name: "Alex Johnson",
  avatarUrl: "",
};

// Updated color array to accommodate 10 scores with navy theme
const COLORS = [
  "bg-red-500 text-white", // 1 - Red
  "bg-red-400 text-white", // 2 
  "bg-orange-500 text-white", // 3
  "bg-orange-400 text-white", // 4
  "bg-yellow-500 text-white", // 5
  "bg-yellow-400 text-white", // 6
  "bg-green-400 text-white", // 7
  "bg-green-500 text-white", // 8
  "bg-green-600 text-white", // 9
  "bg-green-700 text-white", // 10 - Green
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
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      {/* Question Header */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-textPrimary uppercase tracking-wide">
          {question.text}
          {question.required && (
            <span className="text-red-500 ml-1" aria-label="Required">*</span>
          )}
        </h3>
        {question.description && (
          <p className="text-sm text-textSecondary leading-relaxed">
            {question.description}
          </p>
        )}
      </div>

      {/* Score Scale */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {Array.from({length: 10}, (_, i) => i + 1).map((num, idx) => {
            const isSelected = value === num;
            const colorClass = anySelected
              ? (isSelected ? COLORS[idx] : "bg-gray-200 text-gray-600")
              : COLORS[idx];

            return (
              <button
                key={num}
                type="button"
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                  transition-all duration-200 border-2
                  ${isSelected 
                    ? `${colorClass} border-darkBlue scale-110 shadow-lg` 
                    : `${colorClass} border-transparent hover:scale-105 hover:shadow-md`
                  }
                  ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
                disabled={disabled}
                onClick={() => !disabled && onValueChange(num)}
                aria-label={`Score ${num}`}
              >
                {num}
              </button>
            );
          })}
        </div>
        
        {/* Scale Labels */}
        <div className="flex justify-between text-xs text-textSecondary">
          <span>1: Never / Poor performance</span>
          <span>10: Always / Excellent performance</span>
        </div>
      </div>

      {/* Comment Input */}
      <div className="relative">
        <Avatar className="absolute left-3 top-3 z-10 h-8 w-8 border-2 border-white shadow-sm">
          {currentUser.avatarUrl ? (
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
          ) : (
            <AvatarFallback className="bg-darkBlue text-white text-xs font-medium">
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
          placeholder="Add comments (one per line)..."
          className="bg-gray-50 border border-gray-200 text-textPrimary min-h-[80px] pl-14 pr-4 py-3 text-sm resize-none rounded-lg focus:border-darkBlue focus:ring-1 focus:ring-darkBlue"
          value={comment}
          onChange={e => onCommentChange(e.target.value)}
          disabled={disabled}
          id={"comment_" + question.id}
          maxLength={500}
        />
        <div className="text-xs text-textSecondary mt-1 text-right">
          Press Enter for new line. Each line will be saved as a separate comment.
        </div>
      </div>
    </div>
  );
}
