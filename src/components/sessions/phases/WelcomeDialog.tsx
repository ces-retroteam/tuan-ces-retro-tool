import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Session } from "@/types";
import WelcomePhase from "./WelcomePhase";

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
            <DialogContent className="w-full p-0">
                <WelcomePhase session={session} isParticipant={isParticipant} />
            </DialogContent>
        </Dialog>
    );
}
