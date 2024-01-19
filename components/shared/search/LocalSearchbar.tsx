"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

type LocalSearchbarProps = {
  route: string;
  iconPosition: string;
  imgUrl: string;
  placeholder: string;
  otherClasses?: string;
};

const LocalSeachbar = ({
  iconPosition,
  imgUrl,
  placeholder,
  route,
  otherClasses,
}: LocalSearchbarProps) => {
  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}>
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        {iconPosition === "left" && (
          <Image
            src={imgUrl}
            alt="search icon"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        )}
        <Input
          type="text"
          placeholder={placeholder}
          value={""}
          onChange={() => {}}
          className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none"
        />

        {iconPosition === "right" && (
          <Image
            src={imgUrl}
            alt="search icon"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default LocalSeachbar;
