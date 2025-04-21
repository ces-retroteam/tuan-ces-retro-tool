
import React from "react";
import SurveyQuestionRow from "./SurveyQuestionRow";

interface CollaborationSectionStepProps {
  questions: {
    id: string;
    text: string;
    description?: string;
    required?: boolean;
  }[];
  responses: Record<string, any>;
  comments: Record<string, string>;
  onResponseChange: (id: string, value: number) => void;
  onCommentChange: (id: string, value: string) => void;
  isSubmitted: boolean;
}

export default function CollaborationSectionStep({
  questions,
  responses,
  comments,
  onResponseChange,
  onCommentChange,
  isSubmitted,
}: CollaborationSectionStepProps) {
  return (
    <div className="bg-white rounded-2xl px-6 py-6 shadow-sm border border-gray-100 mb-4">
      <h2 className="font-bold text-[1.35rem] text-[#222] mb-2"
        style={{ fontFamily: "Clarendon, serif" }}>
        Team Collaboration
      </h2>
      <div className="mb-4 text-[#555]">
        Please rate how well the team collaborates internally.
      </div>
      <div className="space-y-6">
        {questions.map((question) => (
          <SurveyQuestionRow
            key={question.id}
            question={question}
            value={responses[question.id]}
            comment={comments[question.id] || ""}
            onValueChange={val => onResponseChange(question.id, val)}
            onCommentChange={val => onCommentChange(question.id, val)}
            disabled={isSubmitted}
          />
        ))}
      </div>
    </div>
  );
}
