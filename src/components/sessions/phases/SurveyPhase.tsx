import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useSession } from "@/context/SessionContext";
import { Session } from "@/types";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AdditionalSectionStep from "./AdditionalSectionStep";
import CollaborationSectionStep from "./CollaborationSectionStep";
import DeliverySectionStep from "./DeliverySectionStep";
import { useSurvey } from "@/hooks/useSurvey";
import { collaborationQuestions, deliveryQuestions, additionalPrompt } from "@/data/surveyQuestions";
import { SurveyNavigation } from "./survey/SurveyNavigation";
import { DisplayModeSelector } from "./survey/DisplayModeSelector";
import SurveyQuestionRow from "./SurveyQuestionRow";
import { Button } from "@/components/ui/button";
import { Timer } from "@/components/ui/timer";
import { TimerConfig } from "./TimerConfig";
import { SurveyPage } from "@/types/survey";
import { ArrowRight } from "lucide-react";

const PAGE_ANIMATION = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20, transition: { duration: 0.15 } },
  transition: { duration: 0.26, ease: "easeOut" },
};

interface SurveyPhaseProps {
  session: Session;
  isParticipant?: boolean;
  participantId?: string;
}

export default function SurveyPhase({
  session,
  isParticipant = false,
  participantId,
}: SurveyPhaseProps) {
  const { participants, updateSession } = useSession();
  const {
    responses,
    comments,
    name,
    setName,
    isSubmitting,
    isSubmitted,
    additionalItems,
    currentPage,
    handleResponseChange,
    handleCommentChange,
    handleAdditionalItemChange,
    addAdditionalItem,
    goToNextPage,
    goToPrevPage,
    // Display mode properties
    displayMode,
    handleDisplayModeChange,
    currentQuestionIndex,
    getCurrentSectionQuestions,
    // Timer properties
    timers,
    setTimerEnabled,
    setTimerDuration,
    setTimerPaused,
    handleTimerExpire,
  } = useSurvey(isParticipant, session);

  useEffect(() => {
    if (isParticipant && participantId) {
      const participant = participants.find((p) => p.id === participantId);
      if (participant?.responses) {
        const responseObj: Record<string, any> = {};
        const commentObj: Record<string, string> = {};

        participant.responses.forEach((response) => {
          if (response.questionId.startsWith("comment_")) {
            commentObj[response.questionId.replace("comment_", "")] = response.value as string;
          } else {
            responseObj[response.questionId] = response.value;
          }
        });
      }
    }
  }, [isParticipant, participantId, participants]);

  const isDeliveryValid =
    deliveryQuestions
      .filter((q) => q.required)
      .every((q) => responses[q.id] >= 1 && responses[q.id] <= 10) &&
    (session.isAnonymous || name.trim().length > 0);

  const isCollabValid = collaborationQuestions
    .filter((q) => q.required)
    .every((q) => responses[q.id] >= 1 && responses[q.id] <= 10);

  // For one-question mode, determine if current question is complete
  const currentSectionQuestions = getCurrentSectionQuestions();
  const currentQuestion = currentSectionQuestions[currentQuestionIndex];
  const isCurrentQuestionValid = () => {
    if (!currentQuestion) return true;
    return responses[currentQuestion.id] >= 1 && responses[currentQuestion.id] <= 10;
  };

  // Determine if next button should be disabled based on display mode
  const isNextDisabled = () => {
    if (isSubmitted) return true;
    
    if (displayMode === "one-question" && currentPage !== "additional") {
      if (currentQuestion && currentQuestion.required) {
        return !isCurrentQuestionValid();
      }
      return false;
    }
    
    // For grouped and all-questions modes
    if (currentPage === "delivery") {
      return !isDeliveryValid;
    } else if (currentPage === "collaboration") {
      return !isCollabValid;
    }
    
    return false;
  };

  // Add function to move to the next phase
  const moveToPhase = (phase: "welcome" | "survey" | "discuss" | "review" | "close") => {
    if (!isParticipant) {
      updateSession({
        ...session,
        currentPhase: phase,
      });
    }
  };

  // New function to render all questions across all sections
  const renderAllQuestionsMode = () => {
    return (
      <div className="space-y-8">
        {/* Delivery Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Delivery & Execution</h3>
          <div className="space-y-2">
            {deliveryQuestions.map(question => (
              <div key={question.id} className="bg-white rounded-2xl px-6 py-6 mb-4 shadow-sm border border-gray-100">
                <SurveyQuestionRow
                  question={question}
                  value={responses[question.id]}
                  comment={comments[question.id] || ""}
                  onValueChange={val => handleResponseChange(question.id, val)}
                  onCommentChange={val => handleCommentChange(question.id, val)}
                  disabled={isSubmitted || (timers.delivery.enabled && timers.delivery.paused)}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Collaboration Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Team Collaboration</h3>
          <div className="space-y-2">
            {collaborationQuestions.map(question => (
              <div key={question.id} className="bg-white rounded-2xl px-6 py-6 mb-4 shadow-sm border border-gray-100">
                <SurveyQuestionRow
                  question={question}
                  value={responses[question.id]}
                  comment={comments[question.id] || ""}
                  onValueChange={val => handleResponseChange(question.id, val)}
                  onCommentChange={val => handleCommentChange(question.id, val)}
                  disabled={isSubmitted || (timers.collaboration.enabled && timers.collaboration.paused)}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Additional Questions Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Additional Questions</h3>
          <AdditionalSectionStep
            prompt={additionalPrompt}
            items={additionalItems}
            onItemChange={handleAdditionalItemChange}
            addItem={addAdditionalItem}
            isSubmitted={isSubmitted || (timers.additional.enabled && timers.additional.paused)}
          />
        </div>
      </div>
    );
  };

  // Get the current timer based on page
  const getCurrentTimer = () => {
    return timers[currentPage as keyof typeof timers];
  };

  // Handle timer events based on display mode
  const onTimerExpire = () => {
    if (isSubmitted) return;
    
    // Pause the timer
    setTimerPaused(currentPage, true);
    
    // Handle expiration based on display mode
    handleTimerExpire();
  };

  return (
    <Card>
      <CardContent className="space-y-10 pt-6 pb-2">
        <div>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div
              className="text-lg font-bold"
              style={{ fontFamily: "Clarendon, serif" }}
            >
              {displayMode === "all-questions" ? (
                "All Questions"
              ) : (
                <>
                  {currentPage === "delivery" && "Delivery & Execution"}
                  {currentPage === "collaboration" && "Team Collaboration"}
                  {currentPage === "additional" && "Additional Questions"}
                </>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <DisplayModeSelector 
                currentMode={displayMode} 
                onChange={handleDisplayModeChange} 
              />
              
              {!isParticipant && (
                <TimerConfig
                  isEnabled={getCurrentTimer()?.enabled || false}
                  onToggle={(enabled) => setTimerEnabled(currentPage, enabled)}
                  duration={getCurrentTimer()?.duration || 0}
                  onDurationChange={(duration) => setTimerDuration(currentPage, duration)}
                  displayMode={displayMode}
                  currentPage={currentPage}
                  isPaused={getCurrentTimer()?.paused || false}
                />
              )}
            </div>
          </div>

          {/* Timer display for participants */}
          {isParticipant && getCurrentTimer()?.enabled && (
            <div className="mb-4 bg-orange-50 border border-orange-100 p-3 rounded-md flex items-center justify-between">
              <div className="text-sm text-orange-800">
                {displayMode === "one-question" 
                  ? "Time remaining for this question:" 
                  : displayMode === "grouped" 
                    ? `Time remaining for ${currentPage} section:` 
                    : "Time remaining for the survey:"}
              </div>
              <Timer 
                duration={getCurrentTimer().duration}
                onExpire={onTimerExpire}
                autoStart={true}
                isPaused={getCurrentTimer().paused}
                size="lg"
                className="text-orange-800"
              />
            </div>
          )}

          {displayMode === "all-questions" ? (
            // All questions mode - show everything at once
            renderAllQuestionsMode()
          ) : displayMode === "one-question" && currentPage !== "additional" ? (
            // One question per page mode
            renderOneQuestion()
          ) : (
            // Grouped or All questions modes
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentPage}
                variants={PAGE_ANIMATION}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={PAGE_ANIMATION.transition}
              >
                {currentPage === "delivery" && (
                  <DeliverySectionStep
                    questions={deliveryQuestions}
                    responses={responses}
                    comments={comments}
                    onResponseChange={handleResponseChange}
                    onCommentChange={handleCommentChange}
                    isSubmitted={isSubmitted || (timers.delivery.enabled && timers.delivery.paused)}
                    sessionIsAnonymous={session.isAnonymous}
                    name={name}
                    setName={setName}
                  />
                )}

                {currentPage === "collaboration" && (
                  <CollaborationSectionStep
                    questions={collaborationQuestions}
                    responses={responses}
                    comments={comments}
                    onResponseChange={handleResponseChange}
                    onCommentChange={handleCommentChange}
                    isSubmitted={isSubmitted || (timers.collaboration.enabled && timers.collaboration.paused)}
                  />
                )}

                {currentPage === "additional" && (
                  <AdditionalSectionStep
                    prompt={additionalPrompt}
                    items={additionalItems}
                    onItemChange={handleAdditionalItemChange}
                    addItem={addAdditionalItem}
                    isSubmitted={isSubmitted || (timers.additional.enabled && timers.additional.paused)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {isSubmitted && (
            <div className="bg-accent p-4 rounded-lg text-center mt-2">
              <h3 className="text-lg font-medium">Thank You!</h3>
              <p className="text-muted-foreground">
                Your responses have been recorded.
              </p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 items-end">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {displayMode === "one-question" && currentPage !== "additional" && (
            <span>
              Question {currentQuestionIndex + 1} of {currentSectionQuestions.length}
            </span>
          )}
        </div>
        
        {displayMode !== "all-questions" ? (
          <div className="w-full">
            <SurveyNavigation
              currentPage={currentPage}
              onPrevious={goToPrevPage}
              onNext={goToNextPage}
              isNextDisabled={isNextDisabled() || (getCurrentTimer()?.enabled && getCurrentTimer()?.paused)}
              isPreviousDisabled={currentPage === "delivery" && (displayMode !== "one-question" || currentQuestionIndex === 0)}
              isSubmitting={isSubmitting}
              isLastPage={currentPage === "additional"}
            />
            
            {!isParticipant && (
              <div className="mt-6 pt-6 border-t border-gray-200 w-full flex justify-between">
                <div className="text-sm text-gray-500 italic">
                  Facilitator controls:
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => moveToPhase("discuss")}
                    className="bg-white border-[#E15D2F] text-[#E15D2F] hover:bg-[#FEF7CD] hover:text-[#E15D2F]"
                  >
                    Move to Discuss
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => moveToPhase("review")}
                    className="bg-white border-[#E15D2F] text-[#E15D2F] hover:bg-[#FEF7CD] hover:text-[#E15D2F]"
                  >
                    Move to Review
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => moveToPhase("close")}
                    className="bg-white border-[#E15D2F] text-[#E15D2F] hover:bg-[#FEF7CD] hover:text-[#E15D2F]"
                  >
                    Move to Close
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full">
            <Button
              onClick={goToNextPage}
              disabled={isSubmitting || !isDeliveryValid || !isCollabValid || (timers.delivery.enabled && timers.delivery.paused)}
              className="font-bold"
              style={{
                backgroundColor: "#E15D2F",
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                fontFamily: "Inter, Helvetica, Arial, sans-serif",
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit Survey"}
            </Button>
            
            {!isParticipant && (
              <div className="mt-6 pt-6 border-t border-gray-200 w-full flex justify-between">
                <div className="text-sm text-gray-500 italic">
                  Facilitator controls:
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => moveToPhase("discuss")}
                    className="bg-white border-[#E15D2F] text-[#E15D2F] hover:bg-[#FEF7CD] hover:text-[#E15D2F]"
                  >
                    Move to Discuss
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => moveToPhase("review")}
                    className="bg-white border-[#E15D2F] text-[#E15D2F] hover:bg-[#FEF7CD] hover:text-[#E15D2F]"
                  >
                    Move to Review
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => moveToPhase("close")}
                    className="bg-white border-[#E15D2F] text-[#E15D2F] hover:bg-[#FEF7CD] hover:text-[#E15D2F]"
                  >
                    Move to Close
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
