import Profile from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const mongoUser = await getUserById({ userId });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <Profile
        clerkId={userId}
        mongoUserId={JSON.stringify(mongoUser._id)}
        user={{
          bio: mongoUser.bio,
          location: mongoUser.location,
          name: mongoUser.name,
          portfolioWebsite: mongoUser.portfolioWebsite,
          username: mongoUser.username,
        }}
        />
      </div>
    </div>
  );
};

export default Page;
