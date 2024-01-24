import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { BADGE_CRITERIA } from "@/constants";
import { BadgeCounts } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (createdAt: Date): string => {
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - createdAt.getTime();
  const minutesDifference = Math.floor(timeDifference / (1000 * 60));
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);
  const weeksDifference = Math.floor(daysDifference / 7);
  const yearsDifference = Math.floor(daysDifference / 365);

  if (minutesDifference < 1) {
    return "just now";
  } else if (minutesDifference < 60) {
    return `${minutesDifference} minute${
      minutesDifference === 1 ? "" : "s"
    } ago`;
  } else if (hoursDifference < 24) {
    return `${hoursDifference} hour${hoursDifference === 1 ? "" : "s"} ago`;
  } else if (daysDifference < 7) {
    return `${daysDifference} day${daysDifference === 1 ? "" : "s"} ago`;
  } else if (weeksDifference < 52) {
    return `${weeksDifference} week${weeksDifference === 1 ? "" : "s"} ago`;
  } else {
    return `${yearsDifference} year${yearsDifference === 1 ? "" : "s"} ago`;
  }
};

export const formatNumberWithExtension = (inputNumber: number): string => {
  if (Math.abs(inputNumber) >= 1e9) {
    return (inputNumber / 1e9).toFixed(1) + "b";
  } else if (Math.abs(inputNumber) >= 1e6) {
    return (inputNumber / 1e6).toFixed(1) + "m";
  } else if (Math.abs(inputNumber) >= 1e3) {
    return (inputNumber / 1e3).toFixed(1) + "k";
  } else {
    return inputNumber.toString();
  }
};

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: typeof window !== "undefined" ? window.location.pathname : "",
      query: currentUrl,
    },
    { skipNull: true }
  );
};

interface RemoveUrlQueryParams {
  params: string;
  keys: string[];
}

export const removeKeysFromQuery = ({ params, keys }: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keys.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

interface BadgeParam {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}
export const assignBadges = (params: BadgeParam) => {
  const { criteria } = params;
  const badges = { GOLD: 0, SILVER: 0, BRONZE: 0 };

  for (const criterion of criteria) {
    const { type, count } = criterion;
    const badgeCriteria: any = BADGE_CRITERIA[type];

    Object.keys(badgeCriteria).forEach((level: any) => {
      if (count >= badgeCriteria[level]) {
        badges[level as keyof BadgeCounts] += 1;
      }
    });
  }

  return badges;
};
