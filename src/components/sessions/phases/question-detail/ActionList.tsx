
import { Question } from "@/types";

export function ActionList({ actions }: { actions: Question["actions"] }) {
  return (
    <div className="space-y-2">
      {actions && actions.map((action) => (
        <div key={action.id} className="flex items-start gap-2">
          <input 
            type="checkbox" 
            checked={action.completed} 
            readOnly 
            className="mt-1"
          />
          <span className="text-sm">{action.description}</span>
        </div>
      ))}
    </div>
  );
}
