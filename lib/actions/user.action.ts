"use server";

import { FilterQuery, QueryOptions } from "mongoose";
import User from "@/db/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question, { IQuestion } from "@/db/question.model";
import Tag from "@/db/tag.model";
import Answer from "@/db/answer.model";
import { clerkClient } from "@clerk/nextjs/server";
import { defaultPageLimit } from "@/constants";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

export async function getUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();
    const {
      filter,
      page = 1,
      pageSize = defaultPageLimit,
      searchQuery,
    } = params;
    const sortQuery: QueryOptions = { joinedAt: -1 };

    switch (filter?.toLowerCase()) {
      case "new_users":
        sortQuery.joinedAt = -1;
        break;
      case "old_users":
        sortQuery.joinedAt = 1;
        break;
      case "top_contributors":
        sortQuery.reputation = -1;
        break;
    }
    const totalUsers = await User.countDocuments();

    const users = await User.find({})
      .or([
        { name: { $regex: new RegExp(searchQuery ?? "", "i") } },
        { username: { $regex: new RegExp(searchQuery ?? "", "i") } },
      ])
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(sortQuery);
    // console.log({ users });
    return { users, totalUsers };
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
    await User.create(userData);
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, path, updateData } = params;
    const nameArray = updateData?.name?.split(" ");

    await clerkClient.users.updateUser(clerkId, {
      username: updateData.username,
      firstName: nameArray?.[0] ?? "",
      lastName: nameArray?.splice(-nameArray.length + 1).join(" ") ?? "",
    });

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

    await Question.find({ author: user._id }).distinct("_id");

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
    const {
      clerkId,
      filter,
      page = 1,
      pageSize = defaultPageLimit,
      searchQuery,
    } = params;
    connectToDatabase();

    const query: FilterQuery<typeof Question> = searchQuery
      ? {
          title: { $regex: new RegExp(searchQuery, "i") },
        }
      : {};

    const questionSortFilter: QueryOptions<IQuestion> = {};

    switch (filter?.toLowerCase()) {
      case "most_recent":
        questionSortFilter.createdAt = -1;
        break;
      case "oldest":
        questionSortFilter.createdAt = 1;
        break;
      case "most_voted":
        questionSortFilter.upvotes = -1;
        break;
      case "most_viewed":
        questionSortFilter.views = -1;
        break;
      case "most_answered":
        questionSortFilter.answers = -1;
        break;
    }

    if (!filter) {
      questionSortFilter.createdAt = -1;
    }

    const unpopulatedUsers = await User.aggregate([
      { $match: { clerkId } },
      {
        $addFields: {
          totalSaved: { $size: "$saved" },
        },
      },
    ]);

    const user = await User.populate(unpopulatedUsers[0], [
      {
        path: "saved",
        match: query,
        model: Question,
        options: {
          sort: questionSortFilter,
          limit: pageSize,
          skip: (page - 1) * pageSize,
        },
        populate: [
          { path: "tags", model: Tag, select: "_id name" },
          { path: "author", model: User, select: "_id clerkId name picture" },
        ],
      },
    ]);

    if (!user) {
      throw new Error("User not found");
    }

    return { user };
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    const { userId } = params;
    connectToDatabase();
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({
      author: user._id,
    });
    const totalAnswers = await Answer.countDocuments({
      author: user._id,
    });

    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
    ]);
    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
    ]);
    const [questionViews] = await Question.aggregate([
      { $match: { author: user._id } },

      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);

    const criteria = [
      {
        type: "QUESTION_COUNT" as BadgeCriteriaType,
        count: totalQuestions,
      },
      {
        type: "ANSWER_COUNT" as BadgeCriteriaType,
        count: totalAnswers,
      },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes ?? 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes ?? 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews ?? 0,
      },
    ];

    const badgeCounts = assignBadges({ criteria });

    return { user, totalQuestions, totalAnswers, badgeCounts, reputation: user.reputation ?? 0};
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = defaultPageLimit } = params;
    const totalQuestions = await Question.countDocuments({ author: userId });
    const questions = await Question.find({ author: userId })
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });
    return { questions, totalQuestions };
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = defaultPageLimit } = params;
    const totalAnswers = await Answer.countDocuments({ author: userId });
    const answers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
      .populate({
        path: "question",
        model: Question,
        select: "_id title",
      });
    return { answers, totalAnswers };
  } catch (error) {
    console.log({ error });
    throw error;
  }
}
