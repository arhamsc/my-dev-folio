import { getUserQuestions } from "@/lib/actions/user.action";
import QuestionCard from "./cards/QuestionCard";
import { SearchParamsProps } from "@/types";

interface QuestionTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}

const QuestionTab = async ({
  userId,
  searchParams,
  clerkId,
}: QuestionTabProps) => {
  const { questions, totalQuestions } = await getUserQuestions({ userId });
  return (
    <div className="flex flex-col gap-6">
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          _id={question._id}
          answers={question.answers}
          author={question.author}
          createdAt={question.createdAt}
          tags={question.tags}
          title={question.title}
          views={question.views}
          upvotes={question.upvotes}
          clerkId={clerkId}
        />
      ))}
    </div>
  );
};

export default QuestionTab;
