import { Skeleton } from "@/components/ui/skeleton";

import React from "react";

const Loading = () => {
  
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9 flex flex-col gap-10">
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton
            key={item}
            className={` w-full rounded-xl ${item === 5 ? "h-40" : "h-20"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Loading;
