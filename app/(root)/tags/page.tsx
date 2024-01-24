import NoResult from "@/components/shared/NoResult";
import TagCard from "@/components/shared/cards/TagCard";
import UserCard from "@/components/shared/cards/UserCard";
import Filter from "@/components/shared/filters/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { UserFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import { getUsers } from "@/lib/actions/user.action";
import { CommonPageProps } from "@/types";
import React from "react";

const Page = async ({ searchParams: { q } }: CommonPageProps) => {
  const { tags } = await getAllTags({ searchQuery: q });
  // console.log(users);
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/tags"
          iconPosition="left"
          imgUrl="/assets/icons/search.svg"
          placeholder="Search for tags"
          otherClasses="flex-1"
        />

        <Filter
          filter={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="flex"
        />
      </div>
      <section className="mt-12 gap-4 sm:flex sm:flex-wrap">
        {tags.length <= 0 ? (
          <NoResult
            description="No tags to show here."
            link="/ask-question"
            linkTitle="Ask a Question"
            title="No Tags"
          />
        ) : (
          <>
            {tags.map((tag) => (
              <TagCard
                key={tag._id}
                _id={tag._id}
                name={tag.name}
                description={tag.description ?? "No Description"}
                noOfQuestion={tag.questions.length}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
};

export default Page;
