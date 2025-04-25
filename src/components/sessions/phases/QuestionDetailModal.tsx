
import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Question } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { QuestionSlide } from "./question-detail/QuestionSlide";

interface QuestionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  initialQuestionId?: string;
}

export function QuestionDetailModal({
  isOpen,
  onClose,
  questions,
  initialQuestionId,
}: QuestionDetailModalProps) {
  const initialSlide = React.useMemo(() => {
    return questions.findIndex((q) => q.id === initialQuestionId) || 0;
  }, [questions, initialQuestionId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[800px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Carousel 
          className="w-full relative" 
          opts={{ 
            startIndex: initialSlide,
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {questions.map((question) => (
              <CarouselItem key={question.id} className="transition-opacity duration-300">
                <QuestionSlide question={question} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-12 border-none bg-white hover:bg-gray-50 shadow-md">
            <ChevronLeft className="h-4 w-4 text-orange-500" />
          </CarouselPrevious>
          <CarouselNext className="absolute -right-12 border-none bg-white hover:bg-gray-50 shadow-md">
            <ChevronRight className="h-4 w-4 text-orange-500" />
          </CarouselNext>
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
