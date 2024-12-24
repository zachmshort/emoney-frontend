import { Property } from "@/types/schema";

const getDisplayState = (level: number) => {
  if (level === 1) {
    return `${level} house`;
  } else if (level === 5) {
    return `1 Hotel`;
  } else if (level < 5) {
    return `${level} houses`;
  }
};

const getDisplayStateManage = (count: number, num: number) => {
  if (count > num * 4) {
    const hotels = count - num * 4;
    const houses = count - hotels - hotels * 4;
    if (hotels === 3) {
      return `${hotels} Hotels`;
    } else if (hotels === 1) {
      return `${hotels} Hotel & ${houses} Houses`;
    }
    return `${hotels} Hotels & ${houses} Houses`;
  } else if (count === 0) {
    return "";
  } else if (count === 1) {
    return `${count} House`;
  }
  return `${count} houses`;
};

const getCost = (property: Property, targetLevel: number) => {
  const difference = Math.abs(targetLevel - property.developmentLevel);
  const isUpgrade = targetLevel > property.developmentLevel;

  return property.houseCost * difference * (isUpgrade ? 1 : 0.5);
};
const getDisplayText = (count: number) => {
  if (count < 5) {
    return `${count} house${count !== 1 ? "s" : ""}`;
  }
  return "Hotel";
};
export { getCost, getDisplayState, getDisplayText, getDisplayStateManage };
