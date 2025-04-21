
import { useState } from 'react';
import { useSession } from '@/context/SessionContext';
import { Session, Comment, Action } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

interface ClosePhaseProps {
  session: Session;
  isParticipant?: boolean;
}

export default function ClosePhase({ session, isParticipant = false }: ClosePhaseProps) {
  const navigate = useNavigate();
  const { comments, actions, addAction } = useSession();
  const [newAction, setNewAction] = useState({ text: '', assignee: '', priority: 'medium', questionId: '' });
  
  const sessionComments = comments.filter(c => c.sessionId === session.id);
  const sessionActions = actions.filter(a => a.sessionId === session.id);
  
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
  
  const handleAddAction = () => {
    if (newAction.text) {
      addAction({
        sessionId: session.id,
        questionId: newAction.questionId || undefined,
        text: newAction.text,
        assignee: newAction.assignee || undefined,
        priority: newAction.priority as 'low' | 'medium' | 'high',
        status: 'open',
      });
      
      setNewAction({ text: '', assignee: '', priority: 'medium', questionId: '' });
      toast.success("Action item added successfully!");
    }
  };
  
  const handleFinish = () => {
    navigate('/');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Summary</CardTitle>
        <CardDescription>
          Review key insights and action items from this session.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Key Insights</h3>
          <div className="space-y-4">
            {sessionComments.length > 0 ? (
              sessionComments.map((comment) => {
                const question = session.template.questions.find(q => q.id === comment.questionId);
                
                return (
                  <Card key={comment.id} className="border">
                    <CardContent className="p-4">
                      <div className="mb-2">
                        <span className="text-xs text-muted-foreground">Regarding:</span>
                        <p className="font-medium">{question?.text || 'General'}</p>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          From: {comment.userName || 'Anonymous'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground italic">No comments were added during this session.</p>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Action Items</h3>
          <div className="space-y-4">
            {sessionActions.length > 0 ? (
              sessionActions.map((action) => {
                const question = action.questionId ? 
                  session.template.questions.find(q => q.id === action.questionId) : null;
                
                return (
                  <Card key={action.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{action.text}</p>
                          {question && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Related to: {question.text}
                            </p>
                          )}
                        </div>
                        <Badge 
                          variant="outline"
                          className={getPriorityColor(action.priority)}
                        >
                          {action.priority}
                        </Badge>
                      </div>
                      {action.assignee && (
                        <div className="mt-2 text-sm">
                          <span className="text-muted-foreground">Assignee:</span> {action.assignee}
                        </div>
                      )}
                      {action.dueDate && (
                        <div className="mt-1 text-sm">
                          <span className="text-muted-foreground">Due:</span> {new Date(action.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground italic">No action items have been added yet.</p>
            )}
          </div>
          
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
                          <SelectItem value="none">None</SelectItem>
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
                    <Button onClick={handleAddAction} disabled={!newAction.text}>
                      Add Action
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleFinish}>
          {isParticipant ? "Return Home" : "Finish Session"}
        </Button>
      </CardFooter>
    </Card>
  );
}
