"use server";

import User from "@/db/user.model";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/db/tag.model";
import { FilterQuery, QueryOptions, Types } from "mongoose";
import Question from "@/db/question.model";
import { defaultPageLimit } from "@/constants";

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
    const {
      filter,
      page = 1,
      pageSize = defaultPageLimit,
      searchQuery,
    } = params;
    const sortFilter: QueryOptions<ITag> = {};

    // TODO: When filter is active then, make sure the count is also filtered number of total docs
    const totalTags = await Tag.countDocuments();

    if (!filter) {
      sortFilter.createdOn = -1;
    } else {
      switch (filter?.toLowerCase()) {
        case "popular":
          sortFilter.questions = -1;
          break;
        case "recent":
          sortFilter.createdOn = -1;
          break;
        case "name":
          sortFilter.name = 1;
          break;
        case "old":
          sortFilter.createdOn = 1;
          break;
      }
    }

    const tags = await Tag.find({
      $or: [
        { name: { $regex: new RegExp(searchQuery ?? "", "i") } },
        { description: { $regex: new RegExp(searchQuery ?? "", "i") } },
      ],
    })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(sortFilter);

    // if (!user) throw new Error("User not found");

    return { tags, totalTags };
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectToDatabase();

    const {
      tagId,
      page = 1,
      pageSize = defaultPageLimit,
      searchQuery,
    } = params;

    const tagFilter: FilterQuery<ITag> = { _id: new Types.ObjectId(tagId) };
    const unpopulatedTags = await Tag.aggregate([
      { $match: tagFilter },
      { $addFields: { totalQuestions: { $size: "$questions" } } },
    ]);

    const tag = await Tag.populate(unpopulatedTags[0], [
      {
        path: "questions",
        match: searchQuery
          ? { title: { $regex: searchQuery, $options: "i" } }
          : {},
        model: Question,
        options: {
          sort: { createdAt: -1 },
          limit: pageSize,
          skip: (page - 1) * pageSize,
        },
        populate: [
          { path: "tags", model: Tag, select: "_id name" },
          { path: "author", model: User, select: "_id clerkId name picture" },
        ],
      },
    ]);

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
