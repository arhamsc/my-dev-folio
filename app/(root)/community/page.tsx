import NoResult from "@/components/shared/NoResult";
import UserCard from "@/components/shared/cards/UserCard";
import Filter from "@/components/shared/filters/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { UserFilters } from "@/constants/filters";
import { getUsers } from "@/lib/actions/user.action";
import Link from "next/dist/client/link";
import React from "react";

const Page = async () => {
  const { users } = await getUsers({});
  console.log(users);
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgUrl="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filter
          filter={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="flex"
        />
      </div>
      {users.length <= 0 ? (
        <NoResult
          description="No users are signed up at the moment to show them here."
          link="/sign-up"
          linkTitle="Sign Up"
          title="No Users"
        />
      ) : (
        <div className="mt-12 flex flex-wrap gap-4">
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
        </div>
      )}
    </>
  );
};

export default Page;
