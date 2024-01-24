"use client";

import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { SignedIn, SignedOut, useAuth, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const LeftSidebar = () => {
  const pathName = usePathname();
  const { signOut } = useClerk();
  const { userId } = useAuth();
  const router = useRouter();
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 float-left flex h-screen w-fit flex-col items-center justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="w-full">
        {sidebarLinks.map((item) => {
          const isActive =
            (pathName.includes(item.route) && item.route.length > 1) ||
            pathName === item.route;
          if (item.route === "/profile") {
            if (userId) {
              item.route = `/profile/${userId}`;
            } else {
              return null;
            }
          }
          return (
            <Link
              key={item.route}
              href={item.route}
              className={`${
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-dark300_light900 "
              } flex items-center justify-start gap-4 bg-transparent p-4`}>
              <Image
                src={item.imgURL}
                alt={item.label}
                height={20}
                width={20}
                className={`${isActive ? "" : "invert-colors"}`}
              />
              <p
                className={`${
                  isActive ? "base-bold" : "base-medium"
                } max-lg:hidden`}>
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="flex w-full flex-col gap-3">
        <SignedOut>
          <Link href={"/sign-in"}>
            <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3">
              <Image
                src={"assets/icons/account.svg"}
                width={20}
                height={20}
                alt="login"
                className="invert-colors lg:hidden"
              />
              <span className="primary-text-gradient max-lg:hidden">
                Log In
              </span>
            </Button>
          </Link>
        </SignedOut>

        <SignedOut>
          <Link href={"/sign-up"}>
            <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3">
              <Image
                src={"assets/icons/sign-up.svg"}
                width={20}
                height={20}
                alt="signUp"
                className="invert-colors lg:hidden"
              />
              <span className="max-lg:hidden">Sign Up</span>
            </Button>
          </Link>
        </SignedOut>
        <SignedIn>
          {/* <Link href={"/"}> */}
          <Button
            className="small-medium light-border-2 text-dark400_light900 flex-start flex min-h-[41px] w-full gap-4 rounded-lg px-4 py-3"
            onClick={() => signOut(() => router.push("/"))}>
            <Image
              src={"assets/icons/logout.svg"}
              width={20}
              height={20}
              alt="logout_icon"
            />
            <span className="max-lg:hidden">Log Out</span>
          </Button>
          {/* </Link> */}
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSidebar;
