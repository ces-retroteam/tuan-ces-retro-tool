
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
      <DialogContent className="sm:max-w-[95vw] md:max-w-[850px] min-h-[600px] p-8 bg-gray-50/95 backdrop-blur supports-[backdrop-filter]:bg-gray-50/95">
        <Carousel 
          className="w-full mx-auto relative" 
          opts={{ 
            startIndex: initialSlide,
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {questions.map((question) => (
              <CarouselItem key={question.id} className="pl-2 md:pl-4 transition-opacity duration-300 flex items-center justify-center">
                <QuestionSlide question={question} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-12 border-none bg-white/80 hover:bg-white shadow-md">
            <ChevronLeft className="h-4 w-4 text-orange-500" />
          </CarouselPrevious>
          <CarouselNext className="absolute -right-12 border-none bg-white/80 hover:bg-white shadow-md">
            <ChevronRight className="h-4 w-4 text-orange-500" />
          </CarouselNext>
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
