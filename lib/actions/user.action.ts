"use server";

import User from "@/db/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  UpdateUserParams,
} from "./shared.types";
import error from "next/error";
import { revalidatePath } from "next/cache";
import Question from "@/db/question.model";
import path from "path";

export async function getUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();
    const { filter, page = 1, pageSize = 20, searchQuery } = params;
    const users = await User.find({}).sort({createdAt: -1});
    return { users };
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function getUserById(params: any) {
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
