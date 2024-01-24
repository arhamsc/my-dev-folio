"use server";

import Question, { IQuestion } from "@/db/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/db/tag.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
  ToggleSaveQuestionParams,
} from "./shared.types";
import User from "@/db/user.model";
import { revalidatePath } from "next/cache";
import { FilterQuery, PipelineStage, QueryOptions, Types } from "mongoose";
import Answer from "@/db/answer.model";
import Interaction from "@/db/interaction.model";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    const { filter, page = 1, pageSize = 10, searchQuery } = params;
    connectToDatabase();

    let pipeline: PipelineStage[] = [];

    if (searchQuery) {
      pipeline = [
        ...pipeline,
        {
          $match: {
            $or: [
              { title: { $regex: new RegExp(searchQuery ?? "", "i") } },
              { content: { $regex: new RegExp(searchQuery ?? "", "i") } },
            ],
          },
        },
      ];
    }
    pipeline = [...pipeline, { $sort: { createdAt: -1 } }];

    switch (filter?.toLowerCase()) {
      case "newest":
        pipeline = [...pipeline, { $sort: { createdAt: -1 } }];
        break;
      case "unanswered":
        pipeline = [
          ...pipeline,
          { $match: { $expr: { $lt: [{ $size: "$answers" }, 1] } } },
        ];
        break;
      case "frequent":
        pipeline = [...pipeline, { $sort: { views: -1 } }];
        break;
      case "recommended":
        break;
    }

    const unpopulatedQuestions = await Question.aggregate(pipeline)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const questions = await Question.populate(unpopulatedQuestions, [
      { path: "author", model: User, select: "_id name picture username" },
      { path: "tags", model: Tag, select: "_id name" },
    ]);

    return { questions };
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    // const {} = params;
    connectToDatabase();
    const { questionId } = params;
    const question = await Question.findById(questionId)
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

    return { question };
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase();
    const { title, content, tags, author, path } = params;

    const question = await new Question({ title, content, author });
    const tagDocuments = [];

    for (const tag of tags) {
      // console.log({question});
      // return;
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag._id);
      question.tags.push(existingTag._id);
    }
    await question.save();

    // Increment author's reputation

    // console.log(params);
    revalidatePath(path);
  } catch (error) {}
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();
    const { title, content, path, questionId } = params;
    const question = await Question.findById(questionId);
    if (!question) {
      throw new Error("Question not found");
    }
    await Question.findByIdAndUpdate(questionId, {
      title,
      content,
    });

    // Increment author's reputation

    // console.log(params);
    revalidatePath(path);
  } catch (error) {}
}

export async function handleQuestionVote(params: QuestionVoteParams) {
  try {
    connectToDatabase();
    const { hasdownVoted, hasupVoted, path, questionId, userId } = params;

    // const question = await Question.findById(questionId);
    // const user = await User.findById(userId);

    // Below is the own solution with aggregation pipelines.
    if (hasupVoted) {
      //  console.log({ questionId, userId });
      //  return;
      await Question.findByIdAndUpdate(questionId, [
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
                // When not upvoted, concat orignal array with userId
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
      await Question.findByIdAndUpdate(questionId, [
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
                // When not upvoted, concat orignal array with userId
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

    revalidatePath(path);
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function handleQuestionSave(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();
    const { path, questionId, userId } = params;

    await User.findByIdAndUpdate(userId, [
      {
        $set: {
          saved: {
            $cond: [
              {
                $in: [new Types.ObjectId(questionId), "$saved"],
              },

              {
                $filter: {
                  input: "$saved",
                  cond: {
                    $not: { $in: [new Types.ObjectId(questionId), "$saved"] },
                  },
                },
              },
              { $concatArrays: ["$saved", [new Types.ObjectId(questionId)]] },
            ],
          },
        },
      },
    ]);

    revalidatePath(path);
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();
    const { path, questionId } = params;
    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });

    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );
    console.log({ questionId });
    revalidatePath(path);
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function getHotQuestions() {
  try {
    // const {} = params;
    connectToDatabase();

    const questions = await Question.aggregate([
      {
        $project: {
          title: 1,
          upvotes: 1,
          views: 1,
          createdAt: 1,
          length: { $size: "$answers" },
        },
      },
      {
        $sort: {
          upvotes: -1,
          views: -1,
          length: -1,
          createdAt: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    // const questions = await Question.find({})
    //   .sort({ upvotes: -1, views: -1 })
    //   .select("_id title")
    //   .populate({ path: "author", model: User })
    //   .sort({ createdAt: -1 });

    return { questions };
  } catch (error) {
    console.log({ error });
    throw error;
  }
}
