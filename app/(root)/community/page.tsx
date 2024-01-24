import MyPagination from "@/components/shared/MyPagination";
import NoResult from "@/components/shared/NoResult";
import UserCard from "@/components/shared/cards/UserCard";
import Filter from "@/components/shared/filters/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { defaultPageLimit } from "@/constants";
import { UserFilters } from "@/constants/filters";
import { getUsers } from "@/lib/actions/user.action";
import { CommonPageProps } from "@/types";
import React from "react";

const Page = async ({
  searchParams: { q, filter, page, pageLimit = defaultPageLimit.toString() },
}: CommonPageProps) => {
  const { users, totalUsers } = await getUsers({
    searchQuery: q,
    filter,
    page: +(page ?? 1),
    pageSize: +pageLimit,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/community"
          iconPosition="left"
          imgUrl="/assets/icons/search.svg"
          placeholder="Search for users"
          otherClasses="flex-1"
        />

        <Filter
          filter={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="flex"
        />
      </div>
      <section className="mt-12 gap-4 sm:flex sm:flex-wrap">
        {users.length <= 0 ? (
          <NoResult
            description="No users are signed up at the moment to show them here."
            link="/"
            linkTitle="Go Home"
            title="No Users"
          />
        ) : (
          <>
            {users.map((user) => (
              <UserCard
                key={user._id}
                _id={user._id}
                clerkId={user.clerkId}
                imgUrl={user.picture}
                name={user.name}
                tags={[
                  {
                    _id: "0",
                    name: "Sample 1",
                  },
                  {
                    _id: "1",
                    name: "Sample 2",
                  },
                ]}
                username={user.username}
              />
            ))}
          </>
        )}
      </section>
      <div className="mt-4">
        <MyPagination maxPages={Math.round(totalUsers / +pageLimit)} />
      </div>
    </>
  );
};

export default Page;
