
import { useState } from "react";
import { useSession } from "@/context/SessionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Calendar, Menu, User, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ActionsList() {
  const { actions, addAction } = useSession();
  const [newActionText, setNewActionText] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleAddAction = () => {
    if (newActionText.trim()) {
      addAction({
        text: newActionText,
        sessionId: "current-session",
        priority: "medium",
        status: "open"
      });
      setNewActionText("");
      setShowInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddAction();
    }
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardHeader className="pb-3 space-y-1.5">
        <CardTitle className="text-2xl font-semibold text-gray-900">
          Team actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Actions from health check section */}
        <div className="space-y-4">
          <h3 className="text-base font-medium text-gray-600">Actions from this health check</h3>
          
          {/* Add action input area */}
          <div 
            className={`bg-yellow-50/50 p-4 rounded-lg border border-yellow-100 transition-all ${
              showInput ? 'ring-2 ring-primary/10' : ''
            }`}
            onClick={() => !showInput && setShowInput(true)}
          >
            {showInput ? (
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Type your action here..."
                  value={newActionText}
                  onChange={(e) => setNewActionText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 px-0 h-8 text-gray-700"
                  autoFocus
                />
                <button
                  onClick={handleAddAction}
                  className="p-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <Plus className="w-4 h-4 text-primary" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  +
                </span>
                Add action...
              </div>
            )}
          </div>

          {actions.length === 0 && (
            <div className="text-gray-500 text-sm py-4 text-center">
              No actions yet
            </div>
          )}
        </div>

        {/* Other open actions section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-600">Other open actions</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">SHOW PUBLISHED</span>
              <Switch />
            </div>
          </div>

          {/* Action items with enhanced styling */}
          <div className="space-y-2">
            {actions.map((action) => (
              <div 
                key={action.id} 
                className="flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-lg group border border-transparent hover:border-gray-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center transition-colors group-hover:border-primary/60" />
                  <span className="text-gray-700 font-medium">{action.text}</span>
                  <span className="text-gray-400 text-xs font-medium">
                    {new Date(action.createdAt).toLocaleDateString('en-US', {
                      weekday: 'short',
                      day: '2-digit',
                      month: 'short'
                    }).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                    <Menu className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                    <User className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
