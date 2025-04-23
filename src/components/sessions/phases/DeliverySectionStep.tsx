
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
    <div className="bg-white rounded-2xl px-6 py-6 mb-4">
      <h2 className="font-bold text-[1.35rem] text-[#222] mb-2"
        style={{ fontFamily: "Clarendon, serif" }}>
        Delivery & Execution
      </h2>
      {!sessionIsAnonymous && !isSubmitted && (
        <div className="mb-6">
          <Label htmlFor="name" className="text-[#222] font-semibold mb-1 block"
            style={{ fontFamily: "Inter, Helvetica, Arial, sans-serif" }}>
            Your Name
          </Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="bg-[#F7F7F7] text-[#222] border border-gray-200 px-4 py-2 rounded-lg"
            style={{ fontFamily: "Inter, Helvetica, Arial, sans-serif" }}
          />
        </div>
      )}
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
