
import React from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const TAGS = [
  { value: "TBD", label: "TBD", color: "bg-gray-300 text-gray-700" }, // default
  { value: "team_collaboration", label: "Team Collaboration", color: "bg-violet-200 text-violet-800" },
  { value: "sprint_goal_confidence", label: "Sprint Goal Confidence", color: "bg-orange-200 text-orange-700" },
  { value: "work_life_balance", label: "Work-Life Balance", color: "bg-yellow-100 text-yellow-700" },
  { value: "technical_practices", label: "Technical Practices", color: "bg-green-100 text-green-800" },
  { value: "team_morale", label: "Team Morale", color: "bg-pink-100 text-pink-700" },
];

export type ChallengeTag = typeof TAGS[number]["value"];

interface TagDropdownProps {
  value: ChallengeTag;
  onChange: (value: ChallengeTag) => void;
}

export default function TagDropdown({ value, onChange }: TagDropdownProps) {
  // Find color class for selected value
  const tagObj = TAGS.find(t => t.value === value) || TAGS[0];
  
  // Function to truncate long tag names
  const truncateText = (text: string, maxLength: number = 15) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[170px] h-8 px-2 focus:ring-2 focus:ring-violet-400 bg-white shadow border">
        <SelectValue>
          <Badge className={tagObj.color + " px-2 py-1 max-w-full truncate"}>
            {truncateText(tagObj.label)}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {TAGS.map((tag) => (
          <SelectItem
            key={tag.value}
            value={tag.value}
            className="flex items-center gap-2"
          >
            <span className={"rounded px-2 py-1 text-xs font-medium " + tag.color}>
              {tag.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

