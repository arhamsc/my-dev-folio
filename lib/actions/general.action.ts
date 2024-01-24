"use server";

import Answer from "@/db/answer.model";
import Question from "@/db/question.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import User from "@/db/user.model";
import Tag from "@/db/tag.model";

const SearchableTypes = ["question", "answer", "user", "tag"];
interface SearchResults {
  title: string;
  type: string;
  id: string;
}

export async function globalSearch(params: SearchParams) {
  try {
    await connectToDatabase();

    const { query, type } = params;
    const regex = { $regex: query, $options: "i" };
    let results: SearchResults[] = [];
    const modelsAndType = [
      { model: Question, searchField: "title", type: "question" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: User, searchField: "name", type: "user" },
      { model: Tag, searchField: "name", type: "tag" },
    ];

    const typeLower = type?.toLowerCase();

    if(!typeLower || !SearchableTypes.includes(typeLower)) {
      // Search all

      for (const modelInfo of modelsAndType) {
        const queryResults = await modelInfo.model.find({
          [modelInfo.searchField]: regex,
        }).limit(8);

        results = results.concat(queryResults.map((r) => ({
          title: modelInfo.type === "answer" ?  `Answers containing ${query}` : r[modelInfo.searchField],
          type: modelInfo.type,
          id: modelInfo.type === "user" ? r.clerkId : modelInfo.type === "answer" ? r.question : r._id,
        })));
      }
    } else {
      // Search specific type
      const modelInfo = modelsAndType.find((m) => m.type === typeLower);
      if(!modelInfo) {
        throw new Error('Invalid search type');
      }

      const queryResults = await modelInfo.model.find({
        [modelInfo.searchField]: regex,
      }).limit(8);

      results = queryResults.map((r) => ({
        title: typeLower === "answer" ?  `Answers containing ${query}` : r[modelInfo.searchField],
        type: modelInfo.type,
        id: typeLower === "user" ? r.clerkId : type === "answer" ? r.question : r._id,
      }));
    }

    return JSON.stringify(results);
  } catch (error) {
    console.log({ error });
    throw error;
  }
}
