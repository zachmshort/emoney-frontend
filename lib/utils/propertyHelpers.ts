import { Property } from "@/types/schema";

const getDisplayState = (level: number) => {
  const moreThanOneHouse = level > 1;
  const hotel = level === 5;
  if (hotel) {
    return `1 Hotel`;
  } else {
    return `${level} House${moreThanOneHouse ? "s" : ""}`;
  }
};

const getDisplayStateManage = (
  numberOfHouses: number,
  numberOfProperties: number,
): string => {
  if (numberOfHouses === 0) return "";

  const maxHouses = numberOfProperties * 4;

  const hotels = Math.floor(numberOfHouses / 5);
  const houses =
    numberOfHouses < maxHouses
      ? numberOfProperties
      : numberOfProperties - hotels * 5;

  const parts = [];
  if (hotels > 0) parts.push(`${hotels} Hotel${hotels > 1 ? "s" : ""}`);
  if (houses > 0) parts.push(`${houses} House${houses > 1 ? "s" : ""}`);

  return parts.join(" & ");
};

const getCost = (property: Property, targetLevel: number): number => {
  const levelDiff = targetLevel - property.developmentLevel;

  if (levelDiff === 0) return 0;

  const isUpgrade = levelDiff > 0;
  const costMultiplier = isUpgrade ? 1 : 0.5;

  return property.houseCost * Math.abs(levelDiff) * costMultiplier;
};

const getDisplayText = (numberOfHouses: number): string => {
  if (numberOfHouses < 5) {
    return `${numberOfHouses} House${numberOfHouses !== 1 ? "s" : ""}`;
  }
  return "Hotel";
};

export { getCost, getDisplayState, getDisplayText, getDisplayStateManage };
