
import { useState } from "react";
import { Response } from "@/types";
import { toast } from "sonner";
import { useSession } from "@/context/SessionContext";

export type SurveyPage = "delivery" | "collaboration" | "additional";

export const useSurvey = (isParticipant: boolean, session: { isAnonymous: boolean }) => {
  const { addParticipant } = useSession();
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [additionalItems, setAdditionalItems] = useState<string[]>([""]);
  const [currentPage, setCurrentPage] = useState<SurveyPage>("delivery");

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleCommentChange = (questionId: string, value: string) => {
    setComments((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleAdditionalItemChange = (index: number, value: string) => {
    const newItems = [...additionalItems];
    newItems[index] = value;
    setAdditionalItems(newItems);
  };

  const addAdditionalItem = () => {
    setAdditionalItems(["", ...additionalItems]);
  };

  const handleSubmit = () => {
    if (isParticipant) {
      setIsSubmitting(true);

      const participantResponses: Response[] = [
        ...Object.entries(responses).map(([questionId, value]) => ({
          questionId,
          value,
        })),
        ...Object.entries(comments).map(([questionId, value]) => ({
          questionId: `comment_${questionId}`,
          value,
        })),
        ...additionalItems
          .filter((item) => item.trim())
          .map((item, index) => ({
            questionId: `additional_${index}`,
            value: item,
          })),
      ];

      try {
        const participantData = {
          name: session.isAnonymous ? "Anonymous User" : name,
          responses: participantResponses,
        };

        addParticipant(participantData);

        setIsSubmitted(true);
        setIsSubmitting(false);
        toast.success("Survey submitted successfully!");
      } catch (error) {
        console.error("Error submitting survey:", error);
        setIsSubmitting(false);
        toast.error("Failed to submit survey. Please try again.");
      }
    }
  };

  return {
    responses,
    comments,
    name,
    setName,
    isSubmitting,
    isSubmitted,
    additionalItems,
    currentPage,
    setCurrentPage,
    handleResponseChange,
    handleCommentChange,
    handleAdditionalItemChange,
    addAdditionalItem,
    handleSubmit,
  };
};
