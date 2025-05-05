
import { Session, Action } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ActionItemsListProps {
  actions: Action[];
  session: Session;
  isParticipant: boolean;
  onAddAction: () => void;
  newAction: {
    text: string;
    assignee: string;
    priority: string;
    questionId: string;
  };
  setNewAction: React.Dispatch<React.SetStateAction<{
    text: string;
    assignee: string;
    priority: string;
    questionId: string;
  }>>;
}

export default function ActionItemsList({ 
  actions, 
  session, 
  isParticipant, 
  onAddAction, 
  newAction, 
  setNewAction 
}: ActionItemsListProps) {
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-destructive border-destructive';
      case 'medium':
        return 'text-amber-600 border-amber-600';
      default:
        return 'text-green-600 border-green-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {actions.length > 0 ? (
          <div className="space-y-3">
            {actions.map((action) => {
              const question = action.questionId ? 
                session.template.questions.find(q => q.id === action.questionId) : null;
              
              return (
                <Card key={action.id} className="border rounded-md">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3 items-center">
                        <div className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs">✓</span>
                        </div>
                        <div>
                          <p className="font-medium">{action.text}</p>
                          {action.assignee && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Assigned to: {action.assignee}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge 
                        variant="outline"
                        className={getPriorityColor(action.priority)}
                      >
                        {action.priority}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No action items have been added yet.</p>
        )}
        
        {!isParticipant && (
          <Card className="border mt-4 bg-accent">
            <CardContent className="p-4">
              <h4 className="text-md font-medium mb-2">Add New Action Item</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="action-text">Action Description</Label>
                  <Input
                    id="action-text"
                    placeholder="What needs to be done?"
                    value={newAction.text}
                    onChange={(e) => setNewAction({...newAction, text: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="assignee">Assignee (Optional)</Label>
                    <Input
                      id="assignee"
                      placeholder="Who is responsible?"
                      value={newAction.assignee}
                      onChange={(e) => setNewAction({...newAction, assignee: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={newAction.priority} 
                      onValueChange={(value) => setNewAction({...newAction, priority: value})}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="related-question">Related Question (Optional)</Label>
                    <Select 
                      value={newAction.questionId} 
                      onValueChange={(value) => setNewAction({...newAction, questionId: value})}
                    >
                      <SelectTrigger id="related-question">
                        <SelectValue placeholder="Select Question" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {session.template.questions.map((q) => (
                          <SelectItem key={q.id} value={q.id}>
                            {q.text.substring(0, 30)}...
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end mt-2">
                  <Button onClick={onAddAction} disabled={!newAction.text}>
                    Add Action
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
