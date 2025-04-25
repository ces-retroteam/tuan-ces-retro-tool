
import { Question } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { TrendIndicator } from "./TrendIndicator";
import { CommentList } from "./CommentList";
import { ActionList } from "./ActionList";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Plus, Check } from "lucide-react";

interface QuestionSlideProps {
  question: Question;
}

export function QuestionSlide({ question }: QuestionSlideProps) {
  const [showActionInput, setShowActionInput] = useState(false);
  const [newAction, setNewAction] = useState("");

  const handleAddAction = () => {
    if (newAction.trim()) {
      // Here you would typically call a function to save the action
      console.log("New action:", newAction);
      setNewAction("");
      setShowActionInput(false);
    }
  };

  return (
    <Card className="border-0 bg-white shadow-sm">
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
            {showActionInput ? (
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Type your action..."
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAction()}
                  autoFocus
                />
                <button 
                  onClick={handleAddAction}
                  className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowActionInput(true)}
                className="text-orange-600 hover:text-orange-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add action...
              </button>
            )}
            
            {question.actions && question.actions.length > 0 ? (
              <ActionList actions={question.actions} />
            ) : (
              <p className="text-gray-500 text-sm">No actions yet</p>
            )}
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
