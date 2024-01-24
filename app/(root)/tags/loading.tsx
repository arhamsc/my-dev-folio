import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <section className="flex flex-col gap-5">
      <h1 className="h1-bold text-dark100_light900">
        <Skeleton className="h-14 w-48" />
      </h1>

      <div className="flex gap-5">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-28" />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <Skeleton
            key={item}
            className="h-60 w-full rounded-2xl sm:w-[260px]"
          />
        ))}
      </section>
    </section>
  );
};

export default Loading;
