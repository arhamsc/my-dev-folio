"use server";

import { ViewQuestionParams } from "./shared.types";
import { connectToDatabase } from "../mongoose";
import Question from "@/db/question.model";
import Interaction from "@/db/interaction.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDatabase();
    const { questionId, userId } = params;

    // Update view count for question
    await Question.findByIdAndUpdate(questionId, {
      $inc: { views: 1 },
    });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      if(existingInteraction) return console.log('User viewed this question');

      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
    }
  } catch (error) {
    console.log({ error });
    throw error;
  }
}
