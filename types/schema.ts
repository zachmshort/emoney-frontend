export interface Room {
  id: string;
  roomCode: string;
  bankerId: string;
  createdAt: Date;
  isActive: boolean;
  freeParking: number;
}

export interface Player {
  id: string;
  roomId: string;
  deviceId: string;
  name: string;
  color: string;
  balance: number;
  isActive: boolean;
  isBanker: boolean;
  properties?: Property[];
}

export interface Property {
  id: string;
  roomId: string;
  playerId: string;
  name: string;
  color: string;
  houses: number;
  group: string;
  hotel: number;
  images: string[];
  isMortgaged: boolean;
  houseCost?: number;
  propertyIndex: number;
}

export interface Transfer {
  id: string;
  roomId: string;
  fromPlayerId: string | null; // null if from bank
  toPlayerId: string | null; // null if to bank
  amount: number;
  reason: string; // "transfer" | "rent" | "tax" | "chance" etc.
  timestamp: Date;
  status: string; // "pending" | "completed" | "rejected"
}

export const getWsUrl = (code: string): string => {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "wss://emoney.up.railway.app"
      : "ws://localhost:8080";
  return `${baseUrl}/ws/room/${code}`;
};
