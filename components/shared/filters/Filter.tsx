"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

type TFilter = {
  name: string;
  value: string;
};

type FilterProps = {
  filter: TFilter[];
  otherClasses?: string;
  containerClasses?: string;
};

const Filter = ({ filter, containerClasses, otherClasses }: FilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("filter");

  const [activeFilter, setActiveFilter] = useState<TFilter>({
    name: query || "newest",
    value: query || "newest",
  });

  const handleFilterClick = (f: TFilter) => {
    setActiveFilter(f);
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value: f.value,
    });
    router.push(newUrl, { scroll: false });
  };
  return (
    <div className={`relative ${containerClasses}`}>
      <Select
        onValueChange={(value) =>
          handleFilterClick(
            filter.find((f) => f.value === value) ?? { name: "", value: "" }
          )
        }
        defaultValue={query || ""}>
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}>
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>
        <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
          <SelectGroup>
            {filter.map((f) => (
              <SelectItem
                key={f.value}
                value={f.value}
                className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400">
                {f.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
