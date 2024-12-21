import { Property } from "@/types/schema";

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
  const propertiesInGroup = playerProperties.filter(
    (p) => p.group === property.group
  );

  const ownedUnmortgagedCount = propertiesInGroup.filter(
    (p) => !p.isMortgaged
  ).length;

  const requiredPropertiesPerGroup: Record<string, number> = {
    brown: 2,
    lightBlue: 3,
    pink: 3,
    orange: 3,
    red: 3,
    yellow: 3,
    green: 3,
    darkBlue: 2,
  };

  return ownedUnmortgagedCount === requiredPropertiesPerGroup[property.group];
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
  let rentIndex = 0;
  let rentMultiplier = 1;
  let rentReason = `base rent for ${property.name}`;

  if (hasFullSet) {
    if (property.houses === 0 && property.hotel === 0) {
      rentMultiplier = 2;
      rentReason = `double rent for ${property.name} (full ${property.group} set)`;
    } else if (property.hotel === 1) {
      rentIndex = 5;
      rentReason = `hotel rent for ${property.name}`;
    } else {
      rentIndex = property.houses + 1;
      rentReason = `rent for ${property.name} with ${property.houses} house${
        property.houses > 1 ? "s" : ""
      }`;
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

export { getButtonText, calculateRent };
