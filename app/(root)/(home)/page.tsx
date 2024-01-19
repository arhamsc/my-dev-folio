import HomeFilters from "@/components/home/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/shared/cards/QuestionCard";
import Filter from "@/components/shared/filters/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";
import React from "react";

const questions = [
  {
    _id: "1",
    title: "How to implement a basic authentication system in Node.js?",
    tags: [
      { _id: "tag1", name: "Node.js" },
      { _id: "tag2", name: "Authentication" },
    ],
    author: { _id: "author1", name: "John Doe", picture: "/assets/icons/avatar.svg" },
    upvotes: 25000000000,
    views: 150,
    answers: [],
    createdAt: new Date("2024-01-13T12:00:00"),
  },
  {
    _id: "2",
    title: "Best practices for optimizing React component performance?",
    tags: [
      { _id: "tag3", name: "React" },
      { _id: "tag4", name: "Performance" },
    ],
    author: { _id: "author2", name: "Jane Smith", picture: "/assets/icons/avatar.svg" },
    upvotes: 32,
    views: 220,
    answers: [],
    createdAt: new Date("2024-01-15T09:30:00"),
  },
  {
    _id: "3",
    title: "What are the key differences between REST and GraphQL APIs?",
    tags: [
      { _id: "tag5", name: "APIs" },
      { _id: "tag6", name: "GraphQL" },
    ],
    author: { _id: "author3", name: "Alex Johnson", picture: "/assets/icons/avatar.svg" },
    upvotes: 18,
    views: 120,
    answers: [],
    createdAt: new Date("2024-01-16T15:45:00"),
  },
  {
    _id: "4",
    title: "Tips for designing a responsive and user-friendly UI in Angular?",
    tags: [
      { _id: "tag7", name: "Angular" },
      { _id: "tag8", name: "UI Design" },
    ],
    author: { _id: "author4", name: "Chris Wilson", picture: "/assets/icons/avatar.svg" },
    upvotes: 15,
    views: 180,
    answers: [],
    createdAt: new Date("2024-01-19T08:15:00"),
  },
];


const Home = () => {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light500">All Questions</h1>

        <Link href={"/ask-question"} className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] p-4 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgUrl="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filter
          filter={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => <QuestionCard key={question._id}
          _id={question._id}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
          />)
        ) : (
          <NoResult
            title="There are no questions to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default Home;
