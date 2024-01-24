import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <section className="mt-12 flex flex-wrap gap-4">
        {[1, 2].map((item) => (
          <Skeleton
            key={item}
            className={` w-full rounded-xl ${item === 2 ? "h-[20rem]" : "h-20"}`}
          />
        ))}
      </section>
    </section>
  );
};

export default Loading;
