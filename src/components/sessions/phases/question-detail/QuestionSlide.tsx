
import { Question } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { TrendIndicator } from "./TrendIndicator";
import { CommentList } from "./CommentList";
import { ActionList } from "./ActionList";

interface QuestionSlideProps {
  question: Question;
}

export function QuestionSlide({ question }: QuestionSlideProps) {
  return (
    <Card className="border-0 bg-transparent">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{question.text}</h3>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">{question.score?.toFixed(1)}</span>
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
