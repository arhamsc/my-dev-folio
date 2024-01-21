import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import RenderTag from "../RenderTag";
import Link from "next/link";
import { getTopInteractedTags } from "@/lib/actions/tag.action";

interface UserCardProps {
  _id: string;
  clerkId: string;
  imgUrl: string;
  name: string;
  username: string;
  tags: {
    _id: string;
    name: string;
  }[];
}

const UserCard = async ({
  _id,
  clerkId,
  imgUrl,
  name,
  tags,
  username,
}: UserCardProps) => {
  const interactedTags = await getTopInteractedTags({ userId: _id });
  return (
    <Link
      href={`/profile/${clerkId}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]">
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8 ">
        <Image
          src={imgUrl}
          width={100}
          height={100}
          alt={username}
          className="rounded-full"
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {name.split(" ").join(" | ")}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">@{username}</p>
        </div>
        <div className="mt-4">
          {tags.length > 0 ? (
            <div className="flex items-center gap-2">
              {tags.map((tag) => (
                <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <RenderTag _id={"0"} name="No Tags" tagClasses="line-clamp-1" />
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
