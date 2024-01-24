import { Skeleton } from "@/components/ui/skeleton";

import React from "react";

const Loading = () => {
  return (
    <section className="flex w-full flex-col gap-10">
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Skeleton className="h-[140px] w-[140px] rounded-full" />

          <div className="mt-3 flex flex-col gap-5">
            <h2 className="h2-bold text-dark100_light900">
              <Skeleton className="h-10 w-36" />
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              <Skeleton className="h-10 w-36" />
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-8 w-36" />
            </div>
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <Skeleton className="h-14 w-36" />
        </div>
      </div>

      <div className="flex w-full flex-wrap gap-5">
        <Skeleton className="h-28 w-52" />
        <Skeleton className="h-28 w-52" />
        <Skeleton className="h-28 w-52" />
        <Skeleton className="h-28 w-52" />
      </div>
      <div className="mt-10 grow gap-10">
        <Skeleton className="h-56 w-full" />
      </div>
    </section>
  );
};

export default Loading;
