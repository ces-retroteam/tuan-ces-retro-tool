
import { SurveyPage } from "@/types/survey";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";

interface SurveyPaginationProps {
  currentPage: SurveyPage;
  pages: SurveyPage[];
}

export function SurveyPagination({ currentPage, pages }: SurveyPaginationProps) {
  return (
    <Pagination className="mx-0">
      <PaginationContent className="gap-1">
        {pages.map((page) => (
          <PaginationItem key={page}>
            <div
              className={`w-2 h-2 rounded-full ${
                currentPage === page ? "bg-orange-500" : "bg-gray-200"
              }`}
              aria-label={`Page ${page}`}
            ></div>
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  );
}
