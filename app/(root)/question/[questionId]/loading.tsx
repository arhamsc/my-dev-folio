import { Skeleton } from "@/components/ui/skeleton";

import React from "react";

const Loading = () => {
  return (
    <section className="flex flex-col gap-10">
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <div className="flex items-center justify-start gap-1">
            <Skeleton className="h-[22px] w-[22px] rounded-full" />
            <p className="paragraph-semibold text-dark300_light700">
              <Skeleton className="h-8 w-28" />
            </p>
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-14 w-36" />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full self-start">
          <Skeleton className="h-16 w-full" />
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-36" />
      </div>

      <Skeleton className="h-56 w-full" />

      <div className="mt-8 flex flex-wrap gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>

      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
        <Skeleton key={item} className="h-48 w-full rounded-xl" />
      ))}
    </section>
  );
};

export default Loading;
