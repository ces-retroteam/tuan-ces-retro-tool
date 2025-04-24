
import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Question } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
        <Carousel className="w-full" opts={{ startIndex: initialSlide }}>
          <CarouselContent>
            {questions.map((question) => (
              <CarouselItem key={question.id}>
                <QuestionSlide question={question} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-12">
            <ChevronLeft className="h-4 w-4" />
          </CarouselPrevious>
          <CarouselNext className="hidden sm:flex -right-12">
            <ChevronRight className="h-4 w-4" />
          </CarouselNext>
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}

interface QuestionSlideProps {
  question: Question;
}

function QuestionSlide({ question }: QuestionSlideProps) {
  return (
    <Card className="border-0 bg-transparent">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{question.title}</h3>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">{question.score.toFixed(1)}</span>
              <TrendIndicator trend={question.trend} />
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Comments</h4>
            <CommentList comments={question.comments} />
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Action Items</h4>
            <ActionList actions={question.actions} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TrendIndicator({ trend }: { trend: Question["trend"] }) {
  return (
    <div className={cn(
      "flex items-center gap-1 px-2 py-1 rounded text-sm",
      trend === "up" && "text-green-500 bg-green-500/10",
      trend === "down" && "text-red-500 bg-red-500/10",
      trend === "steady" && "text-yellow-500 bg-yellow-500/10"
    )}>
      {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
      <span className="capitalize">{trend}</span>
    </div>
  );
}

function CommentList({ comments }: { comments: Question["comments"] }) {
  return (
    <div className="space-y-2 max-h-[200px] overflow-y-auto">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
          <p className="text-sm font-medium">{comment.author}</p>
          <p className="text-sm text-muted-foreground">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}

function ActionList({ actions }: { actions: Question["actions"] }) {
  return (
    <div className="space-y-2">
      {actions.map((action) => (
        <div key={action.id} className="flex items-start gap-2">
          <input 
            type="checkbox" 
            checked={action.completed} 
            readOnly 
            className="mt-1"
          />
          <span className="text-sm">{action.description}</span>
        </div>
      ))}
    </div>
  );
}
