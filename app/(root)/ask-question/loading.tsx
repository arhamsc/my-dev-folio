import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <section className="flex flex-col gap-5">
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <section className="mt-12 flex flex-wrap gap-8">
        {[1, 2, 3].map((item) => (
          <Skeleton
            key={item}
            className={` w-full rounded-xl ${
              item === 2 ? "h-[26rem]" : "h-24"
            }`}
          />
        ))}
      </section>
      <Skeleton className="h-14 w-40" />
    </section>
  );
};

export default Loading;
