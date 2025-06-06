
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/context/SessionContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, Eye, X } from "lucide-react";
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
  
  // Options state
  const [oneByOne, setOneByOne] = useState(false);
  const [sectionBySection, setSectionBySection] = useState(true);
  const [allOnOnePage, setAllOnOnePage] = useState(false);
  const [allowMoveToNext, setAllowMoveToNext] = useState(false);
  
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

  // Handle display mode changes
  const handleDisplayModeChange = (mode: string, value: boolean) => {
    if (mode === 'oneByOne') {
      setOneByOne(value);
      if (value) {
        setSectionBySection(false);
        setAllOnOnePage(false);
      }
    } else if (mode === 'sectionBySection') {
      setSectionBySection(value);
      if (value) {
        setOneByOne(false);
        setAllOnOnePage(false);
      }
    } else if (mode === 'allOnOnePage') {
      setAllOnOnePage(value);
      if (value) {
        setOneByOne(false);
        setSectionBySection(false);
      }
    }
  };

  return (
    <>
      {/* Main Dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-hidden p-0">
          <div className="flex items-center justify-between p-6 border-b">
            <DialogTitle className="text-xl font-semibold text-textPrimary">Create Session</DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {step === "choose" && (
            <div className="p-6 space-y-4">
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
              <DialogFooter className="pt-4">
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
            <div className="flex-1 overflow-hidden">
              <Tabs defaultValue="general" className="h-full flex flex-col">
                <div className="px-6">
                  <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 h-auto">
                    <TabsTrigger 
                      value="general" 
                      className="text-darkBlue border-b-2 border-transparent data-[state=active]:border-darkBlue data-[state=active]:bg-transparent rounded-none px-4 py-3 font-medium"
                    >
                      GENERAL
                    </TabsTrigger>
                    <TabsTrigger 
                      value="options"
                      className="text-gray-600 border-b-2 border-transparent data-[state=active]:border-darkBlue data-[state=active]:bg-transparent data-[state=active]:text-darkBlue rounded-none px-4 py-3 font-medium"
                    >
                      OPTIONS
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="general" className="p-6 space-y-6 mt-0">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-textPrimary">Session Title</label>
                      <Input
                        value={sessionName}
                        onChange={e => setSessionName(e.target.value)}
                        placeholder="Team Health Check"
                        className="h-12"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-textPrimary">Due Date</label>
                      <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal h-12"
                            type="button"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                            {dueDate ? format(dueDate, "MMMM dd, yyyy") : <span>Pick a date</span>}
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
                  </TabsContent>
                  
                  <TabsContent value="options" className="p-6 space-y-6 mt-0">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-textPrimary mb-4">Display Mode</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <span className="text-textPrimary">One by one</span>
                            <Switch 
                              checked={oneByOne} 
                              onCheckedChange={(checked) => handleDisplayModeChange('oneByOne', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 border-darkBlue/20">
                            <span className="text-textPrimary">Section by section</span>
                            <Switch 
                              checked={sectionBySection} 
                              onCheckedChange={(checked) => handleDisplayModeChange('sectionBySection', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <span className="text-textPrimary">All on one page</span>
                            <Switch 
                              checked={allOnOnePage} 
                              onCheckedChange={(checked) => handleDisplayModeChange('allOnOnePage', checked)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-textPrimary mb-4">Move to next question</h3>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <span className="text-textPrimary">Allow participants to move to next question</span>
                          <Switch 
                            checked={allowMoveToNext} 
                            onCheckedChange={setAllowMoveToNext}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
                
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleBack}
                      disabled={isSubmitting}
                      className="px-8"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCreate}
                      disabled={isSubmitting || !sessionName}
                      className="bg-darkBlue hover:bg-navy text-white px-8"
                    >
                      {isSubmitting ? "Creating..." : "Create"}
                    </Button>
                  </div>
                </div>
              </Tabs>
            </div>
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
