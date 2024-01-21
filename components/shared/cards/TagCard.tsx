import Link from "next/link";
import React from "react";

interface TagCardProps {
  _id: string;
  name: string;
  description: string;
  noOfQuestion: number;
}

const TagCard = ({ _id, description, name, noOfQuestion }: TagCardProps) => {
  return (
    <Link href={`/tags/${_id}`} className="shadow-light100_darknone">
      <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
        <div className="background-light800_dark400 w-fit px-5 py-1.5">
          <p className="paragraph-semibold text-dark300_light900 capitalize">
            {name}
          </p>
        </div>
        <p className="small-regular text-dark500_light700 mt-4">
          {description}
        </p>
        <p className="small-medium text-dark400_light500 mt-3.5">
          <span className="body-semibold primary-text-gradient mr-2.5">
            {noOfQuestion}+
          </span>{" "}
          Questions
        </p>
      </article>
    </Link>
  );
};

export default TagCard;
