
import { useState } from "react";
import { useSession } from "@/context/SessionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, Plus, Check, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TeamAgreementList() {
  const { actions, addAction, updateAction, deleteAction } = useSession();
  const [newAgreement, setNewAgreement] = useState("");
  const [showInput, setShowInput] = useState(false);

  const agreements = actions.filter(a => a.questionId?.startsWith('agreement_'));

  const handleAddAgreement = () => {
    if (newAgreement.trim()) {
      addAction({
        text: newAgreement,
        sessionId: "current-session",
        priority: "medium",
        status: "open",
        questionId: `agreement_${Date.now()}`
      });
      setNewAgreement("");
      setShowInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddAgreement();
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50/50 shadow-lg border-0 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      <CardHeader className="pb-2 relative">
        <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent flex items-center gap-2">
          <Handshake className="w-6 h-6" />
          Team agreements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 relative">
        <div className="space-y-4">
          <div 
            className={`bg-gradient-to-br from-[#E5DEFF]/50 to-[#E5DEFF]/30 p-4 rounded-xl transition-all ${
              showInput ? 'ring-2 ring-primary/20 shadow-lg' : 'hover:shadow-md cursor-pointer'
            }`}
            onClick={() => !showInput && setShowInput(true)}
          >
            {showInput ? (
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Add team agreement..."
                  value={newAgreement}
                  onChange={(e) => setNewAgreement(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border-0 bg-white/50 backdrop-blur-sm focus-visible:ring-1 focus-visible:ring-primary/30"
                  autoFocus
                />
                <Button 
                  onClick={handleAddAgreement}
                  size="icon"
                  className="h-9 w-9 bg-primary/10 hover:bg-primary/20 text-primary"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-600">
                <span className="w-5 h-5 rounded-full border-2 border-gray-400/50 flex items-center justify-center text-gray-400/70">
                  +
                </span>
                Add agreement...
              </div>
            )}
          </div>

          {agreements.length === 0 && (
            <div className="text-gray-500 text-sm py-8 text-center italic">
              No team agreements yet
            </div>
          )}

          <div className="space-y-2">
            {agreements.map((agreement) => (
              <div 
                key={agreement.id} 
                className={`group relative flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-primary/10 transition-all hover:shadow-sm ${
                  agreement.status === 'completed' ? 'bg-[#E5DEFF]/30' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateAction({
                      ...agreement,
                      status: agreement.status === 'completed' ? 'open' : 'completed'
                    })}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer
                      ${agreement.status === 'completed' 
                        ? 'border-primary bg-primary text-white' 
                        : 'border-gray-300 hover:border-primary/50'
                      }`}
                  >
                    {agreement.status === 'completed' && <Check className="w-3 h-3" />}
                  </button>
                  <span className={`font-medium transition-all ${
                    agreement.status === 'completed' ? 'text-gray-500' : 'text-gray-700'
                  }`}>
                    {agreement.text}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:text-destructive transition-all" 
                  onClick={() => deleteAction(agreement.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
