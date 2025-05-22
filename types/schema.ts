export type Room = {
  id: string;
  name: string;
  roomCode: string;
  bankerId: string;
  createdAt: Date;
  isActive: boolean;
  freeParking: number;
};

export type Player = {
  id: string;
  roomId: string;
  deviceId: string;
  name: string;
  color: string;
  balance: number;
  isActive: boolean;
  isBanker: boolean;
  properties?: Property[];
};

export type Property = {
  id: string;
  roomId: string;
  playerId: string;
  name: string;
  color: string;
  price: number;
  group: string;
  developmentLevel: number;
  images: string[];
  isMortgaged: boolean;
  rentPrices: number[];
  houseCost?: number;
  propertyIndex: number;
};

export type Transfer = {
  id: string;
  roomId: string;
  fromPlayerId: string | null; // null if from bank
  toPlayerId: string | null; // null if to bank
  amount: number;
  reason: string; // "transfer" | "rent" | "tax" | "chance" etc.
  timestamp: Date;
  status: string; // "pending" | "completed" | "rejected"
};

export type EventHistory = {
  id: string;
  roomId: string;
  event: string;
  timestamp: Date;
  eventType: string[];
};

// type Immunity {
//   propertyId?: string;
//   propertyGroup?: string;
//   count: number;
// }

type Trade = {
  properties?: string[];
  amount?: number;
  // immunity?: Immunity[];
};

export type Offer = {
  id: string;
  roomId: string;
  status: "PENDING" | "DENIED" | "ACCEPTED" | "COUNTERED";
  fromPlayerId: string;
  toPlayerId: string;
  offer: Trade;
  request: Trade;
  createdAt: Date;
  updatedAt: Date;
  note?: string;
};

export type OfferNoID = {
  roomId: string;
  status: "PENDING" | "DENIED" | "ACCEPTED" | "COUNTERED";
  fromPlayerId: string;
  toPlayerId: string;
  offer: Trade;
  request: Trade;
  createdAt: Date;
  updatedAt: Date;
  note?: string;
};
