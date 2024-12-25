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
    case "rEQUEST":
      return "request";
    case "ADD":
      return "Add";
    case "SUBTrACT":
      return "Subtract";
    default:
      return "";
  }
};

const doesPlayerOwnFullSet = (
  property: Property,
  properties: [string, Property[]]
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

  return properties[1].length === requiredPropertiesPerGroup[property.group];
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

const calculateRent = (
  property: Property,
  properties: [string, Property[]],
  roll?: number
): { amount: number; reason: string } => {
  if (property.isMortgaged) {
    return {
      amount: 0,
      reason: `${property.name} is mortgaged`,
    };
  }

  const commonProperty =
    property.group !== "utility" && property.group !== "utility";
  const railroad = property.group === "railroad";
  const utility = property.group === "utility";
  const hasFullSet = doesPlayerOwnFullSet(property, properties);

  let rentIndex = 0;
  let rentMultiplier = 1;
  let rentreason = `Base rent for ${property.name}`;
  let finalAmount: number;

  if (hasFullSet && commonProperty) {
    if (property.developmentLevel === 0) {
      rentMultiplier = 2;
      rentreason = `rent for ${property.name} with full set`;
    } else {
      rentIndex = property.developmentLevel;
      rentreason = `rent for ${property.name} with ${
        property.developmentLevel === 5
          ? "a hotel"
          : `${property.developmentLevel} House${
              property.developmentLevel > 1 && "s"
            }`
      }`;
    }
  } else if (railroad) {
    if (properties[1].length === 3) {
      rentMultiplier = 4;
    } else if (properties[1].length === 4) {
      rentMultiplier = 8;
    } else {
      rentMultiplier = properties.length;
    }
    rentreason = `rent for ${property.name} with ${properties.length} railroads`;
  }

  const baseAmount =
    property.rentPrices?.[rentIndex] ?? property.rentPrices?.[0] ?? 50;

  finalAmount = baseAmount * rentMultiplier;

  if (utility) {
    if (properties[1].length === 1) {
      rentMultiplier = 4;
    } else {
      rentMultiplier = 10;
    }
    console.log("rent multiplier", rentMultiplier);
    finalAmount = roll * rentMultiplier;
    rentreason = `rent on ${property.name} with ${properties[1].length} utilit${
      properties[1].length === 1 ? "y" : "ies"
    } & roll of ${roll}`;
  }

  return {
    amount: finalAmount,
    reason: rentreason,
  };
};

export { getButtonText, calculateRent, doesPlayerOwnFullSet, formatTimeAgo };
