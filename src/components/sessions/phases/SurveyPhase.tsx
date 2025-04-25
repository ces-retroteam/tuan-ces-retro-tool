import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useSession } from "@/context/SessionContext";
import { Session } from "@/types";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AdditionalSectionStep from "./AdditionalSectionStep";
import CollaborationSectionStep from "./CollaborationSectionStep";
import DeliverySectionStep from "./DeliverySectionStep";
import { useSurvey } from "@/hooks/useSurvey";
import { collaborationQuestions, deliveryQuestions } from "@/data/surveyQuestions";
import { SurveyNavigation } from "./survey/SurveyNavigation";

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
    setCurrentPage,
    handleResponseChange,
    handleCommentChange,
    handleAdditionalItemChange,
    addAdditionalItem,
    handleSubmit,
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

        setResponses(responseObj);
        setComments(commentObj);
        setIsSubmitted(true);
      }
    }
  }, [isParticipant, participantId, participants]);

  const isDeliveryValid =
    deliveryQuestions
      .filter((q) => q.required)
      .every((q) => [1, 2, 3, 4, 5].includes(responses[q.id])) &&
    (session.isAnonymous || name.trim().length > 0);

  const isCollabValid = collaborationQuestions
    .filter((q) => q.required)
    .every((q) => [1, 2, 3, 4, 5].includes(responses[q.id]));

  const goToNextPage = () => {
    if (currentPage === "delivery") setCurrentPage("collaboration");
    else if (currentPage === "collaboration") setCurrentPage("additional");
    else if (currentPage === "additional") handleSubmit();
  };

  const goToPrevPage = () => {
    if (currentPage === "collaboration") setCurrentPage("delivery");
    else if (currentPage === "additional") setCurrentPage("collaboration");
  };

  if (!isParticipant) {
    return (
      <>
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
        <CollaborationSectionStep
          questions={collaborationQuestions}
          responses={responses}
          comments={comments}
          onResponseChange={handleResponseChange}
          onCommentChange={handleCommentChange}
          isSubmitted={isSubmitted}
        />
        <AdditionalSectionStep
          prompt={additionalPrompt}
          items={additionalItems}
          onItemChange={handleAdditionalItemChange}
          addItem={addAdditionalItem}
          isSubmitted={isSubmitted}
        />
      </>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-10 pt-6 pb-2">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div
              className="text-lg font-bold"
              style={{ fontFamily: "Clarendon, serif" }}
            >
              {currentPage === "delivery" && "Delivery & Execution"}
              {currentPage === "collaboration" && "Team Collaboration"}
              {currentPage === "additional" && "Additional Questions"}
            </div>
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
          <SurveyNavigation
            currentPage={currentPage}
            onPrevious={goToPrevPage}
            onNext={goToNextPage}
            isNextDisabled={
              (currentPage === "delivery" && !isDeliveryValid) ||
              (currentPage === "collaboration" && !isCollabValid)
            }
            isPreviousDisabled={currentPage === "delivery"}
            isSubmitting={isSubmitting}
            isLastPage={currentPage === "additional"}
          />
        </CardFooter>
      )}
    </Card>
  );
}
