import { Property } from "@/types/schema";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInWeeks,
} from "date-fns";

const getButtonText = (type: string) => {
  switch (type) {
    case "SEND":
      return "Send";
    case "REQUEST":
      return "Request";
    case "ADD":
      return "Add";
    case "SUBTRACT":
      return "Subtract";
    default:
      return "";
  }
};

const doesPlayerOwnFullSet = (
  property: Property,
  playerProperties: Property[]
): boolean => {
  const requiredPropertiesPerGroup: Record<string, number> = {
    brown: 2,
    "light-blue": 3,
    pink: 3,
    orange: 3,
    red: 3,
    yellow: 3,
    green: 3,
    "dark-blue": 2,
    railroad: 4,
    utility: 2,
  };

  return playerProperties.length === requiredPropertiesPerGroup[property.group];
};

const calculateMonopolies = (playerProperties: Property[] = []): number => {
  if (!playerProperties) return 0;

  const monopolyGroups = new Set<string>();

  playerProperties.forEach((property) => {
    if (
      !monopolyGroups.has(property.group) &&
      doesPlayerOwnFullSet(property, playerProperties)
    ) {
      monopolyGroups.add(property.group);
    }
  });

  return monopolyGroups.size;
};
const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const minutesAgo = differenceInMinutes(now, date);
  const hoursAgo = differenceInHours(now, date);
  const daysAgo = differenceInDays(now, date);
  const weeksAgo = differenceInWeeks(now, date);

  if (weeksAgo >= 1) {
    return "over 1 week ago";
  }
  if (daysAgo >= 1) {
    return `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;
  }
  if (hoursAgo >= 1) {
    return `${hoursAgo} hr${hoursAgo === 1 ? "" : "s"} ago`;
  }
  return `${minutesAgo} min ago`;
};
const getGroupedMonopolies = (playerProperties: Property[] = []) => {
  if (!playerProperties) return [];

  const groupedObj = playerProperties.reduce((acc, property) => {
    if (doesPlayerOwnFullSet(property, playerProperties)) {
      if (!acc[property.group]) {
        acc[property.group] = [];
      }
      acc[property.group].push(property);
    }
    return acc;
  }, {} as Record<string, Property[]>);

  return Object.entries(groupedObj);
};

const calculateRent = (
  property: Property,
  properties: Property[]
): { amount: number; reason: string } => {
  if (property.isMortgaged) {
    return {
      amount: 0,
      reason: `${property.name} is mortgaged`,
    };
  }

  const hasFullSet = doesPlayerOwnFullSet(property, properties);
  console.log(property);
  console.log("has full set is ", hasFullSet, "for ", property.group);
  let rentIndex = 0;
  let rentMultiplier = 1;
  let rentReason = `base rent for ${property.name}`;

  if (hasFullSet) {
    console.log(property.developmentLevel, "houses on", property.name);
    if (property.developmentLevel === 0) {
      rentMultiplier = 2;
      rentReason = `double rent for ${property.name} (full ${property.group} set)`;
    } else if (property.developmentLevel === 5) {
      rentIndex = property.developmentLevel + 1;
      rentReason = `rent for ${property.name} with a hotel`;
    }
  }

  const baseAmount =
    property.rentPrices?.[rentIndex] ?? property.rentPrices?.[0] ?? 50;
  const finalAmount = baseAmount * rentMultiplier;

  return {
    amount: finalAmount,
    reason: rentReason,
  };
};

export {
  getButtonText,
  calculateRent,
  doesPlayerOwnFullSet,
  calculateMonopolies,
  getGroupedMonopolies,
  formatTimeAgo,
};
