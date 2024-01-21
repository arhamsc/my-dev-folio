"use client"
import { SignIn } from "@clerk/clerk-react";
import React from "react";

const page = () => {
  return (
    <div className="flex-center h-screen">
      <SignIn />
    </div>
  );
};

export default page;
