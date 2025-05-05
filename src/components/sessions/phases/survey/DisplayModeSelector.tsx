
import { Button } from "@/components/ui/button";
import { SurveyDisplayMode } from "@/types/survey";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DisplayModeSelectorProps {
  currentMode: SurveyDisplayMode;
  onChange: (mode: SurveyDisplayMode) => void;
}

export function DisplayModeSelector({ currentMode, onChange }: DisplayModeSelectorProps) {
  const displayModeLabels: Record<SurveyDisplayMode, string> = {
    "one-question": "One question per page",
    "grouped": "Group of questions per page",
    "all-questions": "All questions on one page",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto flex justify-between items-center gap-2">
          <span>Display mode: {displayModeLabels[currentMode]}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={currentMode} onValueChange={(value) => onChange(value as SurveyDisplayMode)}>
          <DropdownMenuRadioItem value="one-question">One question per page</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="grouped">Group of questions per page</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="all-questions">All questions on one page</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
