
import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import WelcomePhase from "./WelcomePhase";
import { Session } from "@/types";

interface WelcomeDialogProps {
  session: Session;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isParticipant: boolean;
}

export default function WelcomeDialog({ session, open, onOpenChange, isParticipant }: WelcomeDialogProps) {
  // Reuse WelcomePhase's UI for dialog content.
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full p-0 md:max-w-xl">
        <WelcomePhase 
          session={session} 
          isParticipant={isParticipant} 
        />
      </DialogContent>
    </Dialog>
  );
}
