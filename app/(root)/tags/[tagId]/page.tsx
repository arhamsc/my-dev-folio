import QuestionCard from "@/components/shared/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { getQuestionsByTagId } from "@/lib/actions/tag.action";
import { redirect } from "next/navigation";
import result from "postcss/lib/result";

interface TagsPageProps {
  params: {
    tagId: string;
  };
  searchParams: {
    q: string;
  };
}

const Page = async ({
  params: { tagId },
  searchParams: { q },
}: TagsPageProps) => {
  if (!tagId) redirect("/tags");
  const { tag } = await getQuestionsByTagId({ tagId, page: 1, searchQuery: q });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900 capitalize">{tag.name}</h1>

      <LocalSearchbar
        route={`/tags/${tagId}`}
        iconPosition="left"
        imgUrl="/assets/icons/search.svg"
        placeholder="Search Tag Questions"
        otherClasses="flex-1 mt-6"
      />

      <div className="mt-10 flex w-full flex-col gap-6">
        {tag.questions.length > 0 ? (
          tag.questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There are no questions to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default Page;
