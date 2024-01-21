"use client";
import { SignUp } from "@clerk/nextjs";
import React from "react";

const page = () => {
  return (
    <div className="flex-center h-screen">
      <SignUp />
    </div>
  );
};

export default page;
