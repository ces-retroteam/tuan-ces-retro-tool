
import React from "react";
import { CardDescription } from "@/components/ui/card";
import SurveyQuestionRow from "./SurveyQuestionRow";

interface CollaborationSectionProps {
  collaborationQuestions: {
    id: string;
    text: string;
    description?: string;
    required?: boolean;
  }[];
  responses: Record<string, any>;
  comments: Record<string, string>;
  onResponseChange: (questionId: string, value: any) => void;
  onCommentChange: (questionId: string, value: string) => void;
  isSubmitted: boolean;
}

export default function CollaborationSection({
  collaborationQuestions,
  responses,
  comments,
  onResponseChange,
  onCommentChange,
  isSubmitted,
}: CollaborationSectionProps) {
  return (
    <div className="bg-white rounded-2xl px-6 py-6 shadow-sm border border-gray-100 mb-4">
      <h2 className="font-bold text-[1.35rem] text-[#222] mb-2"
        style={{ fontFamily: "Clarendon, serif" }}>
        Team Collaboration
      </h2>
      <CardDescription className="mb-4 text-[#555]">
        Please rate how well the team collaborates internally.
      </CardDescription>
      <div className="space-y-6">
        {collaborationQuestions.map((question) => (
          <SurveyQuestionRow
            key={question.id}
            question={question}
            value={responses[question.id]}
            comment={comments[question.id] || ""}
            onValueChange={(val) => onResponseChange(question.id, val)}
            onCommentChange={(val) => onCommentChange(question.id, val)}
            disabled={isSubmitted}
          />
        ))}
      </div>
    </div>
  );
}
