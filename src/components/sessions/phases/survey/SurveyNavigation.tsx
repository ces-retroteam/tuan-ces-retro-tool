
import { Button } from "@/components/ui/button";
import { SurveyPage } from "@/types/survey";
import { SurveyPagination } from "./SurveyPagination";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const pages: SurveyPage[] = ["delivery", "collaboration", "additional"];
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col items-center w-full gap-2 md:gap-4">
      <SurveyPagination currentPage={currentPage} pages={pages} />
      <div className="flex justify-between w-full">
        <Button
          variant="outline"
          size={isMobile ? "sm" : "default"}
          style={{ color: "#222", borderColor: "#E15D2F" }}
          disabled={isPreviousDisabled}
          onClick={onPrevious}
        >
          Previous
        </Button>
        {!isLastPage ? (
          <Button
            size={isMobile ? "sm" : "default"}
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
            size={isMobile ? "sm" : "default"}
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
    </div>
  );
}
