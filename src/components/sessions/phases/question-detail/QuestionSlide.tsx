
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
        <div className="space-y-8 animate-fade-in">
          {/* Score and Title Section */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">{question.score?.toFixed(1)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">{question.text}</h3>
              <p className="text-lg text-gray-600">{question.description}</p>
            </div>
          </div>

          {/* Trend Section */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium uppercase text-gray-500">Trend</h4>
            <div className="h-2 bg-orange-100 rounded-full w-48">
              <div 
                className="h-2 bg-orange-500 rounded-full transition-all duration-500" 
                style={{ width: `${(question.score || 0) * 10}%` }}
              />
            </div>
          </div>

          {/* Actions Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button className="text-orange-600 hover:text-orange-700 flex items-center gap-2">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none" 
                  className="text-orange-500"
                  stroke="currentColor"
                >
                  <path d="M8 4v8M4 8h8" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Add action...
              </button>
            </div>
            <p className="text-gray-500 text-sm">No actions yet</p>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            <button className="w-2 h-2 rounded-full bg-orange-200" />
            <button className="w-2 h-2 rounded-full bg-orange-500" />
            <button className="w-2 h-2 rounded-full bg-orange-200" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
