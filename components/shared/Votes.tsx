"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { formatNumberWithExtension } from "@/lib/utils";
import {
  handleQuestionSave,
  handleQuestionVote,
} from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";
import { handleAnswerVote } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import { undefined } from "zod";

interface VotesProps {
  type: "question" | "answer";
  itemId: string;
  currentUpvotes: number;
  currentDownvotes: number;
  userUpVoted: boolean;
  userDownVoted: boolean;
  userId: string;
  userSaved?: boolean;
}

const Votes = ({
  currentDownvotes,
  currentUpvotes,
  itemId,
  type,
  userDownVoted,
  userUpVoted,
  userId,
  userSaved,
}: VotesProps) => {
  const path = usePathname();
  const router = useRouter();
  const handleSave = async () => {
    await handleQuestionSave({
      path,
      questionId: JSON.parse(itemId),
      userId: JSON.parse(userId),
    });
  };

  const handleVote = async (action: string) => {
    if (type === "question") {
      await handleQuestionVote({
        hasdownVoted: action === "downvote",
        hasupVoted: action === "upvote",
        path,
        questionId: JSON.parse(itemId),
        userId: JSON.parse(userId),
      });
    } else if (type === "answer") {
      await handleAnswerVote({
        hasdownVoted: action === "downvote",
        hasupVoted: action === "upvote",
        path,
        answerId: JSON.parse(itemId),
        userId: JSON.parse(userId),
      });
    }
  };

  useEffect(() => {
    if (type === "question")
      viewQuestion({
        questionId: JSON.parse(itemId),
        userId: userId ? JSON.parse(userId) : undefined,
      });
  }, [itemId, router, userId, path, type]);
  return (
    <div className="flex-center gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              userUpVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote("upvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumberWithExtension(currentUpvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              userDownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            className="cursor-pointer"
            alt="downvote"
            onClick={() => handleVote("downvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumberWithExtension(currentDownvotes)}
            </p>
          </div>
        </div>
      </div>

      {type === "question" ? (
        <Image
          src={
            userSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={18}
          height={18}
          alt="bookmark"
          className="cursor-pointer"
          onClick={() => handleSave()}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Votes;
