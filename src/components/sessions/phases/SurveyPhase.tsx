
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
  const { participants } = useSession();
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
    // New properties
    displayMode,
    handleDisplayModeChange,
    currentQuestionIndex,
    getCurrentSectionQuestions,
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

  const renderOneQuestion = () => {
    if (!currentQuestion || currentPage === "additional") return null;

    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`question-${currentQuestionIndex}`}
          variants={PAGE_ANIMATION}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={PAGE_ANIMATION.transition}
        >
          <div className="bg-white rounded-2xl px-6 py-6 mb-4 shadow-sm border border-gray-100">
            <SurveyQuestionRow
              key={currentQuestion.id}
              question={currentQuestion}
              value={responses[currentQuestion.id]}
              comment={comments[currentQuestion.id] || ""}
              onValueChange={val => handleResponseChange(currentQuestion.id, val)}
              onCommentChange={val => handleCommentChange(currentQuestion.id, val)}
              disabled={isSubmitted}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    );
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
              {currentPage === "delivery" && "Delivery & Execution"}
              {currentPage === "collaboration" && "Team Collaboration"}
              {currentPage === "additional" && "Additional Questions"}
            </div>
            
            <div className="flex items-center gap-4">
              <DisplayModeSelector 
                currentMode={displayMode} 
                onChange={handleDisplayModeChange} 
              />
              
              <div className="flex gap-2">
                {["delivery", "collaboration", "additional"].map((page) => (
                  <div
                    key={page}
                    className={`w-3 h-3 rounded-full ${
                      currentPage === page ? "bg-orange-500" : "bg-gray-200"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {displayMode === "one-question" && currentPage !== "additional" ? (
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
                    isSubmitted={isSubmitted}
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
                    isSubmitted={isSubmitted}
                  />
                )}

                {currentPage === "additional" && (
                  <AdditionalSectionStep
                    prompt={additionalPrompt}
                    items={additionalItems}
                    onItemChange={handleAdditionalItemChange}
                    addItem={addAdditionalItem}
                    isSubmitted={isSubmitted}
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

      {!isSubmitted && (
        <CardFooter className="flex flex-col gap-4 items-end">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {displayMode === "one-question" && currentPage !== "additional" && (
              <span>
                Question {currentQuestionIndex + 1} of {currentSectionQuestions.length}
              </span>
            )}
          </div>
          
          <SurveyNavigation
            currentPage={currentPage}
            onPrevious={goToPrevPage}
            onNext={goToNextPage}
            isNextDisabled={isNextDisabled()}
            isPreviousDisabled={currentPage === "delivery" && (displayMode !== "one-question" || currentQuestionIndex === 0)}
            isSubmitting={isSubmitting}
            isLastPage={currentPage === "additional"}
          />
        </CardFooter>
      )}
    </Card>
  );
}
