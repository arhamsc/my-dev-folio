import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterProps = {
  filter: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
};

const Filter = ({ filter, containerClasses, otherClasses }: FilterProps) => {
  return (
    <div className={`relative ${containerClasses}`}>
      <Select>
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}>
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filter.map((f) => (
              <SelectItem key={f.value} value={f.value}>
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
