import MyPagination from "@/components/shared/MyPagination";
import NoResult from "@/components/shared/NoResult";
import TagCard from "@/components/shared/cards/TagCard";
import Filter from "@/components/shared/filters/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { defaultPageLimit } from "@/constants";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import { CommonPageProps } from "@/types";
import React from "react";

const Page = async ({
  searchParams: { q, filter, page, pageLimit = defaultPageLimit.toString() },
}: CommonPageProps) => {
  const { tags, totalTags } = await getAllTags({
    searchQuery: q,
    filter,
    page: +(page ?? 1),
    pageSize: +pageLimit,
  });

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
          filter={TagFilters}
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
      <div className="mt-4">
        <MyPagination maxPages={Math.round(totalTags / +pageLimit)} />
      </div>
    </>
  );
};

export default Page;
