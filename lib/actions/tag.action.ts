"use server";

import User from "@/db/user.model";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/db/tag.model";
import { FilterQuery } from "mongoose";
import Question from "@/db/question.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    await connectToDatabase();
    const { userId, limit = 3 } = params;
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    return ["tag1", "tag2", "tag3"];
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    await connectToDatabase();
    const { filter, page, pageSize, searchQuery } = params;
    const tags = await Tag.find({});

    // if (!user) throw new Error("User not found");

    return { tags };
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectToDatabase();

    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };
    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      model: Question,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) throw new Error("Tag not found");

    return { tag };
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function getHotTags() {
  try {
    // const {} = params;
    connectToDatabase();

    const tags = await Tag.aggregate([
      {
        $project: {
          name: 1,
          createdOn: 1,
          totalQuestions: { $size: "$questions" },
          totalFollowers: { $size: "$followers" },
        },
      },
      {
        $sort: {
          totalQuestions: -1,
          totalFollowers: -1,
          createdOn: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    return { tags };
  } catch (error) {
    console.log({ error });
    throw error;
  }
}
