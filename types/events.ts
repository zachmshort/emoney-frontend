import { Property } from "./schema";

export interface PropertyUpdate {
  type: "PROPERTY_UPDATE";
  property: Property;
  playerId: string;
}

export interface BalanceUpdate {
  type: "BALANCE_UPDATE";
  playerId: string;
  newBalance: number;
}
