"use server";

import User from "@/db/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/db/tag.model";

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
