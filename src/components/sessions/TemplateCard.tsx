
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Template } from "@/types";

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
}

export default function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle>{template.name}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{template.questions.length} questions</p>
        <ul className="text-sm list-disc list-inside space-y-1">
          {template.questions.slice(0, 3).map((question) => (
            <li key={question.id} className="truncate">
              {question.text}
            </li>
          ))}
          {template.questions.length > 3 && (
            <li className="text-muted-foreground">
              ...and {template.questions.length - 3} more
            </li>
          )}
        </ul>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onSelect(template)} className="w-full">Select Template</Button>
      </CardFooter>
    </Card>
  );
}
