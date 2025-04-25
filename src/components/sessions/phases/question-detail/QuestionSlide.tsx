
import { Question } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { TrendIndicator } from "./TrendIndicator";
import { CommentList } from "./CommentList";
import { ActionList } from "./ActionList";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Plus, Check } from "lucide-react";
import { useSession } from "@/context/SessionContext";

interface QuestionSlideProps {
  question: Question;
}

export function QuestionSlide({ question }: QuestionSlideProps) {
  const { addAction, actions } = useSession();
  const [showActionInput, setShowActionInput] = useState(false);
  const [newAction, setNewAction] = useState("");

  // Filter actions for this specific question
  const questionActions = actions.filter(action => action.questionId === question.id);

  const handleAddAction = () => {
    if (newAction.trim()) {
      addAction({
        text: newAction,
        sessionId: "current-session",
        priority: "medium",
        status: "open",
        questionId: question.id
      });
      setNewAction("");
      setShowActionInput(false);
    }
  };

  return (
    <Card className="border-0 bg-white shadow-sm w-full max-w-[800px] mx-auto">
      <CardContent className="p-8">
        <div className="space-y-8 animate-fade-in">
          {/* Score and Title Section */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center shadow-md">
                <span className="text-5xl font-bold text-white">{question.score?.toFixed(1)}</span>
              </div>
            </div>
            <div className="space-y-3 flex-1">
              <h3 className="text-2xl font-semibold text-gray-900">{question.text}</h3>
              <p className="text-lg text-gray-600">{question.description}</p>
            </div>
          </div>

          {/* Trend Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium uppercase text-gray-500">Trend</h4>
            <div className="h-3 bg-orange-100 rounded-full w-64">
              <div 
                className="h-3 bg-orange-500 rounded-full transition-all duration-500" 
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
            
            {questionActions.length > 0 ? (
              <div className="space-y-2">
                {questionActions.map((action) => (
                  <div 
                    key={action.id} 
                    className={`flex items-start gap-2 p-2 rounded-lg ${
                      action.status === 'completed' 
                        ? 'bg-[#FEC6A1]/30 hover:bg-[#FEC6A1]/40' 
                        : 'bg-accent/30'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={action.status === 'completed'} 
                      readOnly 
                      className="mt-1"
                    />
                    <span className="text-sm">{action.text}</span>
                  </div>
                ))}
              </div>
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
