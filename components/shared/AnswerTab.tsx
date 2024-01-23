import { getUserAnswers } from "@/lib/actions/user.action";
import React from "react";
import { SearchParamsProps } from "@/types";
import AnswerCard from "./cards/AnswerCard";

interface AnswerTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}
const AnswerTab = async ({ userId, searchParams, clerkId }: AnswerTabProps) => {
  const { answers } = await getUserAnswers({ userId });
  return (
    <div className="flex flex-col gap-6">
      {answers.map((answer: any) => {
        // const question = answer.question;
        return (
          <AnswerCard
            key={answer.id}
            _id={answer._id}
            author={answer.author}
            createdAt={answer.createdAt}
            question={answer.question}
            upvotes={answer.upvotes}
            clerkId={clerkId}
          />
        );
      })}
    </div>
  );
};

export default AnswerTab;
