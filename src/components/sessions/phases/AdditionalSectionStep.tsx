
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface AdditionalSectionStepProps {
  prompt: string;
  items: string[];
  onItemChange: (index: number, value: string) => void;
  addItem: () => void;
  isSubmitted: boolean;
}

export default function AdditionalSectionStep({
  prompt,
  items,
  onItemChange,
  addItem,
  isSubmitted,
}: AdditionalSectionStepProps) {
  return (
    <div className="bg-white rounded-2xl px-6 py-6 mb-4 shadow-sm border border-gray-100">
      <h2
        className="font-bold text-[1.35rem] text-[#222] mb-2"
        style={{ fontFamily: "Clarendon, serif" }}
      >
        Additional Questions
      </h2>
      <Label className="text-base text-[#222] font-semibold flex gap-2 mb-3">
        {prompt}
      </Label>
      {!isSubmitted && (
        <div className="flex justify-end mb-4">
          <Button
            variant="default"
            size="sm"
            onClick={addItem}
            className="bg-[#E15D2F] text-white px-3 py-1.5 uppercase tracking-wide font-semibold"
          >
            <Plus size={14} />
            <span className="ml-1">Add</span>
          </Button>
        </div>
      )}
      <div className="space-y-3">
        {items.map((item, index) => (
          <Input
            key={index}
            type="text"
            placeholder={`Challenge ${index + 1}`}
            value={item}
            onChange={(e) => onItemChange(index, e.target.value)}
            disabled={isSubmitted}
            className="bg-[#F7F7F7] border border-gray-200 text-[#222] px-4 py-2 rounded-lg"
            style={{ fontFamily: "Inter, Helvetica, Arial, sans-serif" }}
          />
        ))}
      </div>
    </div>
  );
}

