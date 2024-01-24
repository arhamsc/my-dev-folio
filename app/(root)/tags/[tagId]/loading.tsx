import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <section className="flex flex-col gap-5">
      <h1 className="h1-bold text-dark100_light900">
        <Skeleton className="h-14 w-48" />
      </h1>

      <Skeleton className="h-14 w-full" />

       <div className="flex flex-col gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <Skeleton key={item} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    </section>
  );
};

export default Loading;
