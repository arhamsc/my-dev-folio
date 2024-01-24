"use client";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface EditDeleteActionsProps {
  itemId: string;
  clerkId?: string;
  authorClerkId: string;
  type: "question" | "answer";
}

const EditDeleteActions = ({
  authorClerkId,
  clerkId,
  itemId,
  type,
}: EditDeleteActionsProps) => {
  const path = usePathname();
  const handleDelete = async (itemId: string) => {
    if (type === "question") {
      deleteQuestion({ questionId: JSON.parse(itemId), path });
    } else if (type === "answer") {
      deleteAnswer({ answerId: JSON.parse(itemId), path });
    }
  };
  return (
    <SignedIn>
      {authorClerkId === clerkId && (
        <div className="flex items-center justify-end gap-3">
          {type === "question" ? (
            <Link href={`/${type}/${JSON.parse(itemId)}/edit`}>
              <Image
                src={"/assets/icons/edit.svg"}
                alt="Edit"
                height={18}
                width={18}
              />
            </Link>
          ) : (
            <></>
          )}
          <Image
            src={"/assets/icons/trash.svg"}
            alt="Edit"
            height={18}
            width={18}
            onClick={() => handleDelete(itemId)}
            className="cursor-pointer"
          />
        </div>
      )}
    </SignedIn>
  );
};

export default EditDeleteActions;
