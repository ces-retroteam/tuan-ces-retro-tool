
import React from "react";
import SurveyQuestionRow from "./SurveyQuestionRow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeliverySectionStepProps {
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
  sessionIsAnonymous: boolean;
  name: string;
  setName: (name: string) => void;
}

export default function DeliverySectionStep({
  questions,
  responses,
  comments,
  onResponseChange,
  onCommentChange,
  isSubmitted,
  sessionIsAnonymous,
  name,
  setName,
}: DeliverySectionStepProps) {
  return (
    <div className="space-y-6">
      {!sessionIsAnonymous && !isSubmitted && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Label htmlFor="name" className="text-textPrimary font-semibold mb-2 block">
            Your Name
          </Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="bg-gray-50 text-textPrimary border-gray-200 focus:border-darkBlue focus:ring-1 focus:ring-darkBlue"
          />
        </div>
      )}
      
      <div className="space-y-4">
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
