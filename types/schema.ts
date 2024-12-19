export interface Room {
  _id: string;
  roomCode: string; // Unique code for joining (e.g., "AXBY12")
  bankerId: string; // Device ID of the banker
  createdAt: Date;
  isActive: boolean;
  freeParking: number; // Amount in free parking
  availableHouses: number; // Default 32
  availableHotels: number; // Default 12
}

export interface Player {
  _id: string;
  roomId: string; // Reference to Room
  deviceId: string; // Unique identifier for rejoining
  name: string;
  color: string;
  balance: number;
  isActive: boolean; // In case they disconnect
  isBanker: boolean;
}

export interface Property {
  _id: string;
  roomId: string; // Reference to Room
  playerId: string; // Reference to Player (null if unowned)
  name: string; // e.g., "Boardwalk"
  color: string; // e.g., "dark-blue"
  houses: number; // 0-4
  hotels: number; // 0-1
  images: string[];
  isMortgaged: boolean;
}

export interface Transaction {
  _id: string;
  roomId: string;
  fromPlayerId: string | null; // null if from bank
  toPlayerId: string | null; // null if to bank
  amount: number;
  type: string; // "transfer" | "rent" | "tax" | "chance" etc.
  timestamp: Date;
  status: string; // "pending" | "completed" | "rejected"
}
