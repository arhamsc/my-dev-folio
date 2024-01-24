"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formUrlQuery } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface MyPaginationProps {
  maxPages: number;
}

const MyPagination = ({ maxPages }: MyPaginationProps) => {
  const searchParams = useSearchParams();
  const currentPage = +(searchParams.get("page") || 1);

  const nextPageUrl = formUrlQuery({
    params: searchParams.toString(),
    key: "page",
    value:
      currentPage >= maxPages
        ? maxPages.toString()
        : (currentPage + 1).toString(),
  });

  const previousPageUrl = formUrlQuery({
    params: searchParams.toString(),
    key: "page",
    value: currentPage <= 1 ? "1" : (currentPage - 1).toString(),
  });

  return (
    <Pagination>
      <PaginationContent>
        {currentPage !== 1 && (
          <PaginationItem className="light-border-2 btn flex h-9 min-h-[36px] items-center justify-center gap-2 rounded-md border bg-slate-900 px-1 text-sm font-medium text-slate-50 shadow transition-colors hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 dark:focus-visible:ring-slate-300">
            <PaginationPrevious
              className="body-medium text-dark200_light800"
              href={previousPageUrl}
            />
          </PaginationItem>
        )}
        <PaginationItem className="flex items-center justify-center rounded-md bg-primary-500 p-0">
          <PaginationLink href="#" className="body-semibold text-light-900">
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        {currentPage !== maxPages && (
          <PaginationItem className="light-border-2 btn flex h-9 min-h-[36px] items-center justify-center gap-2 rounded-md border bg-slate-900 px-1 text-sm font-medium text-slate-50 shadow transition-colors hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 dark:focus-visible:ring-slate-300">
            <PaginationNext
              className="body-medium text-dark200_light800"
              href={nextPageUrl}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default MyPagination;
