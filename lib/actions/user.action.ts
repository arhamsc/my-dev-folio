"use server";

import { FilterQuery } from "mongoose";
import User from "@/db/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  UpdateUserParams,
} from "./shared.types";
import error from "next/error";
import { revalidatePath } from "next/cache";
import Question from "@/db/question.model";
import path from "path";
import Tag from "@/db/tag.model";

export async function getUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();
    const { filter, page = 1, pageSize = 20, searchQuery } = params;
    const users = await User.find({}).sort({ createdAt: -1 });
    return { users };
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function getUserById(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    // console.log({user});

    return user;
  } catch (e) {
    console.log({ e });
    throw e;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();
    const newUser = await User.create(userData);
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, path, updateData } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;
    const user = await User.findOne(
      { clerkId },
      {
        new: true,
      }
    );

    if (!user) {
      throw new Error("User not found");
    }

    const userQuestionIds = await Question.find({ author: user._id }).distinct(
      "_id"
    );

    // delete user questions
    await Question.deleteMany({ author: user._id });

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    const { clerkId, filter, page, pageSize, searchQuery } = params;
    connectToDatabase();
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};
    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      model: Question,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });
    // const questions = await Question.find({
    //   _id: { $in: user.saved },

    // })
    //   .populate({
    //     path: "tags",
    //     model: Tag,
    //     select: "_id name",
    //   })
    //   .populate({
    //     path: "author",
    //     model: User,
    //     select: "_id clerkId name picture",
    //   })
    //   .sort({ createdAt: -1 });
    if (!user) {
      throw new Error("User not found");
    }
    
    return { questions: user.saved };
  } catch (error) {
    console.log({ error });
    throw error;
  }
}
