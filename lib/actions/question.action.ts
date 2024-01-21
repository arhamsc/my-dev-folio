"use server";

import Question from "@/db/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/db/tag.model";
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
} from "./shared.types";
import User from "@/db/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    // const {} = params;
    connectToDatabase();

    const questions = await Question.find({})
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });

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
