import React from "react";
import Filter from "./filters/Filter";
import { AnswerFilters } from "@/constants/filters";
import { getAnswers } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";
import { SignedIn } from "@clerk/nextjs";

interface AllAnswersProps {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: string;
  pageLimit?: number;
}

const AllAnswers = async ({
  questionId,
  totalAnswers,
  userId,
  page,
  filter,
  pageLimit,
}: AllAnswersProps) => {
  const { answers } = await getAnswers({ questionId, sortBy: filter });
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
        <Filter filter={AnswerFilters} />
      </div>

      <div>
        {answers.map((answer) => (
          <article
            key={answer._id}
            className="light-border w-full border-b py-10">
            <div className="flex items-center justify-between">
              <div className="mb-8 flex w-full flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className="flex flex-1 items-start gap-1 sm:items-center">
                  <Image
                    src={answer.author.picture}
                    width={18}
                    height={18}
                    alt="profile"
                    className="rounded-full object-cover max-sm:mt-0.5"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">
                      {answer.author.name}
                    </p>{" "}
                    <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
                      answered {getTimestamp(answer.createdAt)}{" "}
                    </p>
                  </div>
                </Link>
                <div className="flex justify-end">
                  <SignedIn>
                    <Votes
                      currentDownvotes={answer.downvotes.length}
                      currentUpvotes={answer.upvotes.length}
                      itemId={JSON.stringify(answer._id)}
                      type="answer"
                      userDownVoted={
                        userId
                          ? answer.downvotes.includes(JSON.parse(userId))
                          : false
                      }
                      userUpVoted={
                        userId
                          ? answer.upvotes.includes(JSON.parse(userId))
                          : false
                      }
                      userId={userId}
                    />
                  </SignedIn>
                </div>
              </div>
            </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
    </div>
  );
};

export default AllAnswers;
