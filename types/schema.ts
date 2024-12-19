export interface Room {
  _id: string;
  roomCode: string;
  bankerId: string;
  createdAt: Date;
  isActive: boolean;
  freeParking: number;
}

export interface Player {
  _id: string;
  roomId: string;
  deviceId: string;
  name: string;
  color: string;
  balance: number;
  isActive: boolean;
  isBanker: boolean;
}

export interface Property {
  _id: string;
  roomId: string;
  playerId: string;
  name: string;
  color: string;
  houses: number;
  hotel: number;
  images: string[];
  isMortgaged: boolean;
  houseCost?: number;
  propertyIndex: number;
}

export interface Transfer {
  _id: string;
  roomId: string;
  fromPlayerId: string | null; // null if from bank
  toPlayerId: string | null; // null if to bank
  amount: number;
  reason: string; // "transfer" | "rent" | "tax" | "chance" etc.
  timestamp: Date;
  status: string; // "pending" | "completed" | "rejected"
}
