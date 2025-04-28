
import { useState } from "react";
import { useSession } from "@/context/SessionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, UserPlus, Flag, Plus, Check, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { format } from "date-fns";

export function ActionsList() {
  const { actions, addAction, updateAction, deleteAction } = useSession();
  const [newActionText, setNewActionText] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [selectedDueDate, setSelectedDueDate] = useState<Date | undefined>(undefined);

  // Filter actions to only show regular actions (not team agreements or parking lot items)
  const regularActions = actions.filter(a => 
    !a.questionId?.startsWith('parking_') && 
    !a.questionId?.startsWith('agreement_')
  );

  const handleAddAction = () => {
    if (newActionText.trim()) {
      addAction({
        text: newActionText,
        sessionId: "current-session",
        priority: "medium",
        status: "open",
        dueDate: selectedDueDate ? selectedDueDate.toISOString() : undefined
      });
      setNewActionText("");
      setShowInput(false);
      setSelectedDueDate(undefined);
    }
  };

  const handleUpdateActionStatus = (actionId: string, newStatus: 'open' | 'in-progress' | 'completed') => {
    const action = actions.find(a => a.id === actionId);
    if (action) {
      updateAction({
        ...action,
        status: newStatus
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddAction();
    }
  };

  const renderActionItem = (action: any) => (
    <div 
      key={action.id} 
      className={`group relative flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-primary/10 transition-all hover:shadow-sm ${
        action.status === 'completed' 
          ? 'bg-[#FEC6A1]/30 hover:bg-[#FEC6A1]/40' 
          : 'hover:bg-accent/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleUpdateActionStatus(action.id, action.status === 'completed' ? 'open' : 'completed')}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer
            ${action.status === 'completed' 
              ? 'border-primary bg-primary text-white' 
              : 'border-gray-300 hover:border-primary/50'
            }`}
        >
          {action.status === 'completed' && <Check className="w-3 h-3" />}
        </button>
        <div className="flex flex-col gap-1">
          <span className={`font-medium transition-all ${
            action.status === 'completed' 
              ? 'text-gray-700' 
              : 'text-gray-700'
          }`}>
            {action.text}
          </span>
        </div>
        {action.dueDate && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            action.status === 'completed'
              ? 'bg-[#FEC6A1]/20 text-primary' 
              : 'bg-primary/10 text-primary'
          }`}>
            {format(new Date(action.dueDate), 'dd MMM')}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Calendar className="w-4 h-4 text-gray-600" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <DatePicker
              mode="single"
              selected={action.dueDate ? new Date(action.dueDate) : undefined}
              onSelect={(date) => {
                if (date) {
                  handleUpdateActionStatus(action.id, action.status);
                }
              }}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <UserPlus className="w-4 h-4 text-gray-600" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Flag className="w-4 h-4 text-gray-600" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 hover:text-destructive" 
          onClick={() => deleteAction(action.id)}
        >
          <Trash2 className="w-4 h-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50/50 shadow-lg border-0 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      <CardHeader className="pb-2 relative">
        <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Team actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 relative">
        {/* Regular actions */}
        <div className="space-y-4">
          <h3 className="text-base font-medium text-gray-600 flex items-center gap-2">
            Actions from this health check
          </h3>
          
          <div 
            className={`bg-gradient-to-br from-accent to-accent/50 p-4 rounded-xl transition-all ${
              showInput ? 'ring-2 ring-primary/20 shadow-lg' : 'hover:shadow-md cursor-pointer'
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
                  className="flex-1 border-0 bg-white/50 backdrop-blur-sm focus-visible:ring-1 focus-visible:ring-primary/30 h-9 rounded-lg text-gray-700"
                  autoFocus
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-white/50">
                      <Calendar className="w-4 h-4 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DatePicker
                      mode="single"
                      selected={selectedDueDate}
                      onSelect={setSelectedDueDate}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <Button 
                  onClick={handleAddAction}
                  size="icon"
                  className="h-9 w-9 bg-primary/10 hover:bg-primary/20 text-primary"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-600">
                <span className="w-5 h-5 rounded-full border-2 border-gray-400/50 flex items-center justify-center text-gray-400/70">
                  +
                </span>
                Add action...
              </div>
            )}
          </div>

          {regularActions.length === 0 ? (
            <div className="text-gray-500 text-sm py-8 text-center italic">
              No actions yet
            </div>
          ) : (
            <div className="space-y-2">
              {regularActions.map(action => renderActionItem(action))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
