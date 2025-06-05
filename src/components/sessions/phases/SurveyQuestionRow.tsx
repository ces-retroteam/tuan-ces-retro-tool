
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Dummy current user data (replace with actual user info in a real app)
const currentUser = {
  name: "Alex Johnson",
  avatarUrl: "",
};

// Updated color array for 10-point scale with navy theme
const SCORE_COLORS = [
  "bg-red-500 hover:bg-red-600", // 1 - Poor
  "bg-red-400 hover:bg-red-500", // 2
  "bg-orange-500 hover:bg-orange-600", // 3
  "bg-orange-400 hover:bg-orange-500", // 4
  "bg-yellow-500 hover:bg-yellow-600", // 5
  "bg-yellow-400 hover:bg-yellow-500", // 6
  "bg-green-400 hover:bg-green-500", // 7
  "bg-green-500 hover:bg-green-600", // 8
  "bg-green-600 hover:bg-green-700", // 9
  "bg-green-700 hover:bg-green-800", // 10 - Excellent
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
  const isSelected = (score: number) => value === score;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm space-y-6">
      {/* Question Header */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-primary-900 leading-tight">
          {question.text}
          {question.required && (
            <span className="text-red-500 ml-1" aria-label="Required">*</span>
          )}
        </h3>
        {question.description && (
          <p className="text-gray-600 leading-relaxed">
            {question.description}
          </p>
        )}
      </div>

      {/* Score Scale */}
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3 justify-start">
          {Array.from({length: 10}, (_, i) => i + 1).map((score, index) => {
            const selected = isSelected(score);
            
            return (
              <button
                key={score}
                type="button"
                className={`
                  relative w-12 h-12 rounded-xl font-bold text-white text-lg
                  transition-all duration-200 transform
                  ${selected 
                    ? `${SCORE_COLORS[index]} scale-110 ring-4 ring-primary-200 shadow-lg` 
                    : `${SCORE_COLORS[index]} hover:scale-105 shadow-md`
                  }
                  ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  focus:outline-none focus:ring-4 focus:ring-primary-200
                `}
                disabled={disabled}
                onClick={() => !disabled && onValueChange(score)}
                aria-label={`Score ${score}`}
              >
                {score}
                {selected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Scale Labels */}
        <div className="flex justify-between text-sm text-gray-500 px-1">
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            Poor Performance
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-700 rounded-full"></div>
            Excellent Performance
          </span>
        </div>
      </div>

      {/* Comment Input */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-primary-900">
          Comments & Feedback
        </label>
        <div className="relative">
          <Avatar className="absolute left-4 top-4 z-10 h-8 w-8 border-2 border-white shadow-sm">
            {currentUser.avatarUrl ? (
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
            ) : (
              <AvatarFallback className="bg-primary-600 text-white text-xs font-medium">
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
            placeholder="Share specific examples, suggestions, or observations... (one per line)"
            className="bg-gray-50 border border-gray-200 text-primary-900 min-h-[100px] pl-16 pr-4 py-4 text-sm resize-none rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:bg-white transition-all placeholder-gray-500"
            value={comment}
            onChange={e => onCommentChange(e.target.value)}
            disabled={disabled}
            id={"comment_" + question.id}
            maxLength={500}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {comment.length}/500
          </div>
        </div>
        <p className="text-xs text-gray-500 ml-16">
          💡 Each line will be saved as a separate comment for better organization
        </p>
      </div>
    </div>
  );
}
