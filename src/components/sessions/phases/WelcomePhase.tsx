import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/context/SessionContext";
import { Session } from "@/types";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

interface WelcomePhaseProps {
    session: Session;
    isParticipant?: boolean;
    onBeginSurvey?: () => void;
}

export default function WelcomePhase({ session, isParticipant = false, onBeginSurvey }: WelcomePhaseProps) {
    const { updateSession } = useSession();
    const [copying, setCopying] = useState(false);

    const sessionLink = `${window.location.origin}/join/${session.id}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(sessionLink);
        setCopying(true);

        setTimeout(() => {
            setCopying(false);
        }, 2000);
    };

    const handleNext = () => {
        if (!isParticipant && onBeginSurvey) {
            onBeginSurvey();
        }
    };

    return (
        <Card className="">
            <CardHeader>
                <CardTitle className="text-2xl">Welcome to {session.name}</CardTitle>
                <CardDescription>{session.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium mb-2">About This Session</h3>
                    <p className="text-muted-foreground">
                        This session uses the <strong>{session.template.name}</strong> template to gather feedback about
                        your team's health and dynamics.
                    </p>
                </div>

                {!isParticipant && (
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-accent p-6 rounded-lg">
                        <div className="flex flex-col items-center">
                            <span className="text-sm text-muted-foreground mb-2">Scan to Join</span>
                            <QRCodeSVG
                                value={sessionLink}
                                size={230}
                                bgColor="#fff"
                                fgColor="#E15D2F"
                                includeMargin={true}
                                style={{
                                    borderRadius: 16,
                                    border: "2px solid #eee",
                                    background: "#fff",
                                    width: 230,
                                    height: 230,
                                }}
                            />
                        </div>
                        <div className="flex-1 w-full flex flex-col justify-center">
                            <h3 className="text-lg font-medium mb-2">Share With Your Team</h3>
                            <p className="text-sm mb-4">Invite participants by sharing this link:</p>
                            <div className="flex items-center space-x-3">
                                <div className="bg-background p-2 rounded border flex-1 truncate text-sm">
                                    {sessionLink}
                                </div>
                                <Button onClick={handleCopyLink} variant="secondary" size="sm">
                                    {copying ? "Copied!" : "Copy"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
