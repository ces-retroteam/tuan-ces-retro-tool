
import React from "react";
import { Comment, Participant } from "@/types";

// Maps participantId to participant name for easy display
function getParticipantName(participants: Participant[], participantId: string) {
  const p = participants.find((x) => x.id === participantId);
  return p ? p.name : "Anonymous";
}

export default function CommentList({
  comments,
  participants,
}: {
  comments: Comment[];
  participants: Participant[];
}) {
  if (!comments.length) {
    return <div className="text-gray-400 text-sm">No comments for this topic.</div>;
  }
  return (
    <ul className="space-y-2 px-1">
      {comments.map((c) => (
        <li key={c.id} className="bg-gray-50 p-2 rounded">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-xs text-indigo-700">{getParticipantName(participants, c.participantId)}</span>
            <span className="text-[11px] text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
          </div>
          <div className="pl-1 text-gray-700">{c.content}</div>
        </li>
      ))}
    </ul>
  );
}
