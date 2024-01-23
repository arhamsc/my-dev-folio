import { z } from "zod";

export const questionsSchema = z.object({
  title: z.string().min(5).max(150),
  explanation: z.string().min(100),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});

export const answerSchema = z.object({
  answer: z.string().min(100),
});

export const profileSchema = z.object({
  username: z.string().min(2).max(10),
  name: z.string().min(2).max(50),
  bio: z.string().min(10).max(150),
  location: z.string().min(2).max(50),
  portfolioWebsite: z.string().min(5).max(50),
});
