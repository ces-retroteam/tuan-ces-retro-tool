
import { Button } from "@/components/ui/button";
import { SurveyPage } from "@/hooks/useSurvey";

interface SurveyNavigationProps {
  currentPage: SurveyPage;
  onPrevious: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
  isPreviousDisabled: boolean;
  isSubmitting?: boolean;
  isLastPage?: boolean;
}

export function SurveyNavigation({
  currentPage,
  onPrevious,
  onNext,
  isNextDisabled,
  isPreviousDisabled,
  isSubmitting,
  isLastPage,
}: SurveyNavigationProps) {
  return (
    <div className="flex justify-between w-full">
      <Button
        variant="outline"
        style={{ color: "#222", borderColor: "#E15D2F" }}
        disabled={isPreviousDisabled}
        onClick={onPrevious}
      >
        Previous
      </Button>
      {!isLastPage ? (
        <Button
          style={{
            backgroundColor: "#E15D2F",
            color: "#fff",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            fontFamily: "Inter, Helvetica, Arial, sans-serif",
          }}
          onClick={onNext}
          disabled={isNextDisabled}
        >
          Next
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={isSubmitting || isNextDisabled}
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
      )}
    </div>
  );
}
