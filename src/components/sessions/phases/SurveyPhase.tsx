
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
import { Progress } from "@/components/ui/progress";

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

  const currentSectionQuestions = getCurrentSectionQuestions();
  const currentQuestion = currentSectionQuestions[currentQuestionIndex];
  
  const isCurrentQuestionValid = () => {
    if (!currentQuestion) return true;
    return responses[currentQuestion.id] >= 1 && responses[currentQuestion.id] <= 10;
  };

  const isNextDisabled = () => {
    if (isSubmitted) return true;
    
    if (displayMode === "one-question" && currentPage !== "additional") {
      if (currentQuestion && currentQuestion.required) {
        return !isCurrentQuestionValid();
      }
      return false;
    }
    
    if (currentPage === "delivery") {
      return !isDeliveryValid;
    } else if (currentPage === "collaboration") {
      return !isCollabValid;
    }
    
    return false;
  };

  const getProgressPercentage = () => {
    if (displayMode === "all-questions") {
      const totalQuestions = deliveryQuestions.length + collaborationQuestions.length;
      const answeredQuestions = [...deliveryQuestions, ...collaborationQuestions]
        .filter(q => responses[q.id] >= 1 && responses[q.id] <= 10).length;
      return (answeredQuestions / totalQuestions) * 100;
    }
    
    if (displayMode === "one-question") {
      const totalQuestions = currentSectionQuestions.length;
      return ((currentQuestionIndex + 1) / totalQuestions) * 100;
    }
    
    // For grouped mode
    const pageOrder = ["delivery", "collaboration", "additional"];
    const currentIndex = pageOrder.indexOf(currentPage);
    return ((currentIndex + 1) / pageOrder.length) * 100;
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
          <SurveyQuestionRow
            key={currentQuestion.id}
            question={currentQuestion}
            value={responses[currentQuestion.id]}
            comment={comments[currentQuestion.id] || ""}
            onValueChange={val => handleResponseChange(currentQuestion.id, val)}
            onCommentChange={val => handleCommentChange(currentQuestion.id, val)}
            disabled={isSubmitted}
          />
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderAllQuestionsMode = () => {
    return (
      <div className="space-y-8">
        {/* Name Input for non-anonymous sessions */}
        {!session.isAnonymous && !isSubmitted && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <label htmlFor="name" className="block text-sm font-semibold text-primary-900 mb-3">
              Your Name *
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-primary-900 placeholder-gray-500 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 focus:bg-white transition-all"
            />
          </div>
        )}

        {/* Delivery Section */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-primary-900 mb-2">Delivery & Execution</h2>
            <p className="text-sm text-primary-700">Rate your team's performance in delivering results</p>
          </div>
          
          <div className="space-y-4">
            {deliveryQuestions.map(question => (
              <SurveyQuestionRow
                key={question.id}
                question={question}
                value={responses[question.id]}
                comment={comments[question.id] || ""}
                onValueChange={val => handleResponseChange(question.id, val)}
                onCommentChange={val => handleCommentChange(question.id, val)}
                disabled={isSubmitted || (timers.delivery.enabled && timers.delivery.paused)}
              />
            ))}
          </div>
        </div>
        
        {/* Collaboration Section */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-primary-900 mb-2">Team Collaboration</h2>
            <p className="text-sm text-primary-700">Evaluate how well your team works together</p>
          </div>
          
          <div className="space-y-4">
            {collaborationQuestions.map(question => (
              <SurveyQuestionRow
                key={question.id}
                question={question}
                value={responses[question.id]}
                comment={comments[question.id] || ""}
                onValueChange={val => handleResponseChange(question.id, val)}
                onCommentChange={val => handleCommentChange(question.id, val)}
                disabled={isSubmitted || (timers.collaboration.enabled && timers.collaboration.paused)}
              />
            ))}
          </div>
        </div>
        
        {/* Additional Questions Section */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-primary-900 mb-2">Additional Questions</h2>
            <p className="text-sm text-primary-700">Share any additional feedback or suggestions</p>
          </div>
          
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

  const getCurrentTimer = () => {
    return timers[currentPage as keyof typeof timers];
  };

  const onTimerExpire = () => {
    if (isSubmitted) return;
    setTimerPaused(currentPage, true);
    handleTimerExpire();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary-900 mb-2">
                {displayMode === "all-questions" ? (
                  "Team Pulse Survey"
                ) : (
                  <>
                    {currentPage === "delivery" && "Delivery & Execution"}
                    {currentPage === "collaboration" && "Team Collaboration"}
                    {currentPage === "additional" && "Additional Questions"}
                  </>
                )}
              </h1>
              <p className="text-gray-600">Share your honest feedback to help improve team performance</p>
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

          {/* Progress Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-bold text-primary-600">{Math.round(getProgressPercentage())}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>

          {/* Timer display for participants */}
          {isParticipant && getCurrentTimer()?.enabled && (
            <div className="mt-6 bg-orange-50 border border-orange-200 p-4 rounded-lg flex items-center justify-between">
              <div className="text-sm text-orange-800 font-medium">
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
                className="text-orange-800 font-bold"
              />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {displayMode === "all-questions" ? (
            renderAllQuestionsMode()
          ) : displayMode === "one-question" && currentPage !== "additional" ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              {renderOneQuestion()}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
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
            </div>
          )}

          {isSubmitted && (
            <div className="bg-green-50 border border-green-200 p-8 rounded-xl text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Thank You!</h3>
              <p className="text-green-700">
                Your responses have been recorded successfully. Your feedback helps improve team performance.
              </p>
            </div>
          )}

          {/* Navigation Footer */}
          {!isSubmitted && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {displayMode === "one-question" && currentPage !== "additional" && (
                <div className="text-center mb-6">
                  <span className="text-sm text-gray-600">
                    Question <span className="font-semibold text-primary-600">{currentQuestionIndex + 1}</span> of <span className="font-semibold">{currentSectionQuestions.length}</span>
                  </span>
                </div>
              )}
              
              {displayMode !== "all-questions" ? (
                <SurveyNavigation
                  currentPage={currentPage}
                  onPrevious={goToPrevPage}
                  onNext={goToNextPage}
                  isNextDisabled={isNextDisabled() || (getCurrentTimer()?.enabled && getCurrentTimer()?.paused)}
                  isPreviousDisabled={currentPage === "delivery" && (displayMode !== "one-question" || currentQuestionIndex === 0)}
                  isSubmitting={isSubmitting}
                  isLastPage={currentPage === "additional"}
                />
              ) : (
                <div className="flex justify-end">
                  <Button
                    onClick={goToNextPage}
                    disabled={isSubmitting || !isDeliveryValid || !isCollabValid || (timers.delivery.enabled && timers.delivery.paused)}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-lg text-lg"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Survey"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
