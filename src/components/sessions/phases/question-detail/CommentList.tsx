
import { Question } from "@/types";

export function CommentList({ comments }: { comments: Question["comments"] }) {
  return (
    <div className="space-y-2 max-h-[200px] overflow-y-auto">
      {comments && comments.map((comment) => (
        <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
          <p className="text-sm font-medium">{comment.author}</p>
          <p className="text-sm text-muted-foreground">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}
