import Answers from "@/components/forms/Answers";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";
import { defaultPageLimit } from "@/constants";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { formatNumberWithExtension, getTimestamp } from "@/lib/utils";
import { CommonPageProps } from "@/types";
import { SignedIn, auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface QuestionDetailPageProps extends CommonPageProps {
  params: {
    questionId: string;
  };
}

const Page = async ({
  params: { questionId },
  searchParams: { filter, page, pageLimit = defaultPageLimit.toString() },
}: QuestionDetailPageProps) => {
  const { question } = await getQuestionById({ questionId });
  const { userId: clerkId } = auth();

  let mongoUser;

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }

  // return <Loading/>

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${question.author.clerkId}`}
            className="flex items-center justify-start gap-1">
            <Image
              src={question.author.picture}
              alt="user"
              height={22}
              width={22}
              className="rounded-full"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {question.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <SignedIn>
              <Votes
                type="question"
                itemId={JSON.stringify(question._id)}
                userId={JSON.stringify(mongoUser?._id)}
                currentDownvotes={question.downvotes.length}
                currentUpvotes={question.upvotes.length}
                userUpVoted={question.upvotes.includes(mongoUser?._id)}
                userDownVoted={question.downvotes.includes(mongoUser?._id)}
                userSaved={mongoUser?.saved.includes(question._id)}
              />
            </SignedIn>
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full self-start">
          {question.title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimestamp(question.createdAt)}`}
          title=""
          textStyle="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="Message"
          value={formatNumberWithExtension(question.answers.length)}
          title=" Answers"
          textStyle="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="views"
          value={formatNumberWithExtension(question.views)}
          title=" Views"
          textStyle="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={question.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {question.tags.map((tag: { _id: string; name: string }) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>

      <AllAnswers
        questionId={question._id}
        userId={JSON.stringify(mongoUser?._id)}
        filter={filter}
        page={+(page ?? 1)}
        pageLimit={+pageLimit}
      />

      <Answers
        question={question.content}
        questionId={JSON.stringify(question._id)}
        authorId={JSON.stringify(mongoUser?._id)}
      />
    </>
  );
};

export default Page;
