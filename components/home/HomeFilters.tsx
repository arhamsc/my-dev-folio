"use client";
import { HomePageFilters } from "@/constants/filters";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

const HomeFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("filter");

  const [filter, setFilter] = useState<(typeof HomePageFilters)[0]>({
    name: query || "",
    value: query || "",
  });

  //* Did not used useEffect() here because there is another component that changes the URL so even this component will re-render and change the url again.

  const handleFilterClick = (f: (typeof HomePageFilters)[0]) => {
    if (f.value !== filter.value) {
      setFilter(f);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: f.value,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setFilter({
        name: "",
        value: "",
      });
      if (pathname === "/") {
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keys: ["filter"],
        });
        router.push(newUrl, { scroll: false });
      }
    }
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((f) => (
        <Button
          key={f.value}
          onClick={() => {
            handleFilterClick(f);
          }}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            filter.value === f.value
              ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:hover:bg-dark-400/70"
              : "bg-light-800 text-light-500  hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300/80"
          }`}>
          {f.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
