import Link from "next/link";
import React from "react";
import Metric from "../Metric";
import { formatNumberWithExtension, getTimestamp } from "@/lib/utils";

type AnswerCardProps = {
  _id: string;
  author: { _id: string; name: string; picture: string };
  upvotes: Array<object>[];
  question: { _id: string; title: string };
  createdAt: Date;
  clerkId?: string;
};

const AnswerCard = ({
  _id,
  author,
  createdAt,
  upvotes,
  clerkId,
  question,
}: AnswerCardProps) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <Link href={`/question/${question._id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {question.title}
            </h3>
          </Link>
        </div>
        {/* If signed in , add edit/delete actions */}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="user"
          value={author.name}
          title={` - asked ${getTimestamp(createdAt)}`}
          href={`/profile/${author._id}`}
          textStyle="body-medium text-dark400_light700"
          isAuthor
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="Upvotes"
          value={formatNumberWithExtension(upvotes.length)}
          title=" Votes"
          textStyle="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default AnswerCard;
