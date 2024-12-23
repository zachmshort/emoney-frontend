export type WebSocketPayload =
  | TransferPayload
  | JoinPayload
  | PurchasePropertyPayload
  | BankerTransactionPayload
  | ManagePropertiesPayload
  | FreeParkingPayload;

export type TransferType =
  | "SEND"
  | "REQUEST"
  | "ADD"
  | "SUBTRACT"
  | "BANKER_ADD"
  | "BANKER_REMOVE";

export interface TransferPayload {
  amount: string;
  type: TransferType;
  fromPlayerId?: string;
  toPlayerId?: string;
  reason: string;
  roomId: string;
}

type ManagePropertiesPayload =
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

interface BankerTransactionPayload {
  type: "BANKER_TRANSACTION";
  amount: string;
  fromPlayerId: string;
  toPlayerId: string;
  transactionType: "BANKER_ADD" | "BANKER_REMOVE";
  roomId: string;
}

interface FreeParkingPayload {
  type: "FREE_PARKING";
  freeParkingType: "ADD" | "REMOVE";
  amount: string;
  playerId: string;
  roomId: string;
}

interface JoinPayload {
  playerId: string;
}

export interface PurchasePropertyPayload {
  type: "PURCHASE_PROPERTY";
  propertyId: string;
  buyerId: string;
  price: number;
  roomId: string;
}
