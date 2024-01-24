import MyPagination from "@/components/shared/MyPagination";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/shared/cards/QuestionCard";
import Filter from "@/components/shared/filters/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { defaultPageLimit } from "@/constants";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { CommonPageProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const Home = async ({
  searchParams: { q, filter, page, pageLimit = defaultPageLimit.toString() },
}: CommonPageProps) => {
  const { userId: clerkId } = auth();

  if (!clerkId) redirect("/sign-in");

  const {
    user: { saved, totalSaved },
  } = await getSavedQuestions({
    clerkId,
    searchQuery: q,
    filter,
    page: +(page ?? 1),
    pageSize: +pageLimit,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/collection"
          iconPosition="left"
          imgUrl="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filter
          filter={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="flex"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {saved.length > 0 ? (
          saved.map((question: any) => (
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
            title="You haven't saved any questions yet!"
            description="Saved questions will appear here."
            link="/"
            linkTitle="Go to Home"
          />
        )}
      </div>
      <div className="mt-4">
        <MyPagination maxPages={Math.round(totalSaved / +pageLimit)} />
      </div>
    </>
  );
};

export default Home;
