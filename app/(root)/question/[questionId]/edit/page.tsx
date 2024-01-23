import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: { questionId: string };
}

const Page = async ({ params }: PageProps) => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const mongoUser = await getUserById({ userId });

  if (!params.questionId) redirect("/ask-question");

  const { question } = await getQuestionById({ questionId: params.questionId });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <Question
          mongoUserId={JSON.stringify(mongoUser._id)}
          type="edit"
          questionDetails={{
            title: question.title,
            _id: JSON.stringify(question._id),
            tags: question.tags.map((tag: any) => tag.name),
            content: question.content,
          }}
        />
      </div>
    </div>
  );
};

export default Page;
