import ManageProperties from "@/components/players/manage-properties";

export interface Room {
  id: string;
  name: string;
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
  price: number;
  houses: number;
  group: string;
  hotel: number;
  images: string[];
  isMortgaged: boolean;
  rentPrices: number[];
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

export interface EventHistory {
  id: string;
  roomId: string;
  fromPlayerId: string | null; // null if from bank
  toPlayerId: string | null; // null if to bank
  amount: number | null;
  event: string;
  type: string; // "transfer" | "rent" | "tax" | "chance" etc.
  timestamp: Date;
}

export interface TransferPayload {
  amount: string;
  type: TransferType;
  fromPlayerId?: string;
  toPlayerId?: string;
  reason: string;
  roomId: string;
}

export type ManagePropertiesPayload =
  | {
      type: "ADD_HOUSES" | "REMOVE_HOUSES";
      playerId: string;
      propertyIds: string[];
      roomId: string;
      houseCount: number;
      amount: number;
    }
  | {
      type: "ADD_HOTELS" | "REMOVE_HOTELS";
      playerId: string;
      propertyIds: string[];
      roomId: string;
      hotelCount: number;
      amount: number;
    }
  | {
      type: "MORTGAGE" | "SELL_TO_BANK";
      playerId: string;
      propertyIds: string[];
      roomId: string;
      amount: number;
    };

export type TransferType =
  | "SEND"
  | "REQUEST"
  | "ADD"
  | "SUBTRACT"
  | "BANKER_ADD"
  | "BANKER_REMOVE";

export interface BankerTransactionPayload {
  type: "BANKER_TRANSACTION";
  amount: string;
  fromPlayerId: string;
  toPlayerId: string;
  transactionType: "BANKER_ADD" | "BANKER_REMOVE";
  roomId: string;
}

export type WebSocketPayload =
  | TransferPayload
  | JoinPayload
  | PurchasePropertyPayload
  | BankerTransactionPayload
  | ManagePropertiesPayload;

export interface JoinPayload {
  playerId: string;
}

export interface PurchasePropertyPayload {
  type: "PURCHASE_PROPERTY";
  propertyId: string;
  buyerId: string;
  price: number;
  roomId: string;
}
