
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/context/SessionContext";
import { Template } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface CreateSessionFormProps {
  template: Template;
  onBack: () => void;
}

export default function CreateSessionForm({ template, onBack }: CreateSessionFormProps) {
  const navigate = useNavigate();
  const { createSession } = useSession();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newSession = createSession({
        name,
        description,
        template,
        facilitatorId: 'user-1', // In a real app, this would be the logged-in user's ID
        isAnonymous
      });
      
      navigate(`/session/${newSession.id}`);
    } catch (error) {
      console.error("Error creating session:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Session</CardTitle>
        <CardDescription>
          Using template: {template.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Session Name</Label>
            <Input
              id="name"
              placeholder="E.g., Q2 Team Health Check"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this session's purpose"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
            <Label htmlFor="anonymous">Enable anonymous responses</Label>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting || !name}>
              {isSubmitting ? "Creating..." : "Create Session"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
