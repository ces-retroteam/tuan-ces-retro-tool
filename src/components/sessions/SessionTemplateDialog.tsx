
import { useState } from "react";
import { Template } from "@/types";
import { templates } from "@/data/templates";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSession } from "@/context/SessionContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, Eye } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function SessionTemplateDialog({ open, onOpenChange }: Props) {
  const [step, setStep] = useState<"choose" | "form">("choose");
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0]);
  const [sessionName, setSessionName] = useState("");
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createSession } = useSession();
  const navigate = useNavigate();

  // For preview modal state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const handleContinue = () => setStep("form");
  const handleBack = () => setStep("choose");

  const handleCreate = () => {
    setIsSubmitting(true);
    const newSession = createSession({
      name: sessionName,
      description: "",
      template: selectedTemplate,
      facilitatorId: "user-1",
      isAnonymous: true,
      dueDate: format(dueDate, "yyyy-MM-dd"),
    } as any);
    setIsSubmitting(false);
    onOpenChange(false);
    setTimeout(() => {
      navigate(`/session/${newSession.id}`);
    }, 200);
  };

  // Open the preview dialog and set the preview template
  const handlePreview = (tpl: Template) => {
    setPreviewTemplate(tpl);
    setPreviewOpen(true);
  };

  return (
    <>
      {/* Main Dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>
              {step === "choose" ? "Select a template" : "Create Session"}
            </DialogTitle>
          </DialogHeader>
          {step === "choose" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                {templates.map((tpl) => (
                  <Card
                    key={tpl.id}
                    className={`cursor-pointer border-2 relative ${
                      selectedTemplate.id === tpl.id
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedTemplate(tpl)}
                    tabIndex={0}
                    aria-selected={selectedTemplate.id === tpl.id}
                  >
                    {/* Eye icon button top-right, does NOT trigger card select */}
                    <button
                      type="button"
                      className="absolute right-3 top-3 bg-white rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary z-10"
                      onClick={e => {
                        e.stopPropagation();
                        handlePreview(tpl);
                      }}
                      aria-label={`Preview template ${tpl.name}`}
                    >
                      <Eye className="w-5 h-5 text-gray-700 hover:text-primary" />
                    </button>
                    <CardHeader>
                      <CardTitle className="text-base">{tpl.name}</CardTitle>
                      <CardDescription>{tpl.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
              <DialogFooter>
                <Button
                  className="w-full"
                  disabled={!selectedTemplate}
                  onClick={handleContinue}
                >
                  Continue
                </Button>
              </DialogFooter>
            </div>
          )}
          {step === "form" && (
            <form
              className="space-y-4"
              onSubmit={e => {
                e.preventDefault();
                handleCreate();
              }}
            >
              <div className="space-y-2">
                <label className="block text-sm font-medium">Session Title</label>
                <Input
                  value={sessionName}
                  onChange={e => setSessionName(e.target.value)}
                  placeholder="Team Health Check"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Due Date</label>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                      {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={d => {
                        setDueDate(d ?? new Date());
                        setDatePickerOpen(false);
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <DialogFooter className="pt-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !sessionName}
                  className="bg-primary text-primary-foreground"
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>
              {previewTemplate ? previewTemplate.name : "Template Preview"}
            </DialogTitle>
            {previewTemplate?.description && (
              <DialogDescription className="mb-2">
                {previewTemplate.description}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Questions</h4>
            <ul className="space-y-1">
              {previewTemplate?.questions.map((q, idx) => (
                <li key={q.id} className="pl-1">
                  <span className="font-semibold text-gray-900">{idx + 1}.</span>{" "}
                  <span className="text-gray-900">{q.text}</span>{" "}
                  <span className="text-xs text-gray-500 ml-2">[{q.type}]</span>
                </li>
              ))}
            </ul>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
