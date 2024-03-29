"use server";
import Answer, { IAnswer } from "@/db/answer.model";
import { connectToDatabase } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/db/question.model";
import { QueryOptions, Types } from "mongoose";
import Interaction from "@/db/interaction.model";
import { defaultPageLimit } from "@/constants";
import User from "@/db/user.model";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();
    const { content, author, path, question } = params;

    const answer = await new Answer({ question, content, author });

    const qO = await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });

    await answer.save();

    await Interaction.create({
      user: author,
      action: "answer",
      question,
      answer,
      tags: qO.tags,
    });
    // Increment author's reputation

    await User.findByIdAndUpdate(author, {
      $inc: { reputation: 10 },
    });

    // console.log(params);
    revalidatePath(path);
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();
    const {
      questionId,
      page = 1,
      pageSize = defaultPageLimit,
      sortBy,
    } = params;
    const sortByFilters: QueryOptions<IAnswer> = {};

    if (!sortBy) {
      sortByFilters.createdAt = -1;
    } else {
      switch (sortBy?.toLowerCase()) {
        case "highestupvotes":
          sortByFilters.upvotes = -1;
          break;
        case "lowestupvotes":
          sortByFilters.downvotes = -1;
          break;
        case "recent":
          sortByFilters.createdAt = -1;
          break;
        case "old":
          sortByFilters.createdAt = 1;
          break;
      }
    }

    const totalAnswers = await Answer.countDocuments({ question: questionId });
    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(sortByFilters);

    return { answers, totalAnswers };
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function handleAnswerVote(params: AnswerVoteParams) {
  try {
    connectToDatabase();
    const { hasdownVoted, hasupVoted, path, answerId, userId } = params;

    const answer = await Answer.findById(answerId);
    // const user = await User.findById(userId);

    // Below is the own solution with aggregation pipelines.
    if (hasupVoted) {
      await Answer.findByIdAndUpdate(answerId, [
        {
          $set: {
            upvotes: {
              $cond: [
                {
                  $in: [new Types.ObjectId(userId), "$upvotes"], // Use $upvotes instead of upvotes
                },
                // When already upVoted remove the Id from the array using filters
                {
                  $filter: {
                    input: "$upvotes",
                    cond: {
                      $not: { $in: [new Types.ObjectId(userId), "$upvotes"] }, // Use $upvotes instead of upvotes
                    },
                  },
                },
                // When not upvoted, concat original array with userId
                { $concatArrays: ["$upvotes", [new Types.ObjectId(userId)]] },
              ],
            },
          },
        },
        // Remove the user Id from Down votes
        {
          $set: {
            downvotes: {
              $filter: {
                input: "$downvotes",
                cond: {
                  $not: {
                    $in: [new Types.ObjectId(userId), "$upvotes"],
                  }, // Use $upvotes instead of upvotes
                },
              },
            },
          },
        },
      ]);
    } else if (hasdownVoted) {
      await Answer.findByIdAndUpdate(answerId, [
        {
          $set: {
            downvotes: {
              $cond: [
                {
                  $in: [new Types.ObjectId(userId), "$downvotes"], // Use $downvotes instead of upvotes
                },
                // When already upVoted remove the Id from the array using filters
                {
                  $filter: {
                    input: "$downvotes",
                    cond: {
                      $not: { $in: [new Types.ObjectId(userId), "$downvotes"] }, // Use $upvotes instead of upvotes
                    },
                  },
                },
                // When not upvoted, concat original array with userId
                { $concatArrays: ["$downvotes", [new Types.ObjectId(userId)]] },
              ],
            },
          },
        },
        // Remove userId from Upvotes
        {
          $set: {
            upvotes: {
              $filter: {
                input: "$upvotes",
                cond: {
                  $not: {
                    $in: [new Types.ObjectId(userId), "$upvotes"],
                  }, // Use $upvotes instead of upvotes
                },
              },
            },
          },
        },
      ]);
    } else {
      return;
    }

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? 1 : -1 },
    });

    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasupVoted ? 10 : -10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectToDatabase();
    const { path, answerId } = params;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    await Question.findByIdAndUpdate(answer.question, {
      $pull: { answers: answer._id },
    });
    await Interaction.deleteMany({ answer: answer._id });
    await Answer.findByIdAndDelete(answer._id);

    revalidatePath(path);
  } catch (error) {
    console.log({ error });
    throw error;
  }
}
