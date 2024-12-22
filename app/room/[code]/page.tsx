"use client";
import { Player, Room } from "@/types/schema";
import { use, useEffect, useRef, useState } from "react";
import RoomView from "@/components/room/room.client";
import { getEndpoints, getWsUrl } from "@/lib/utils/wsHelpers";
import { playerStore } from "@/lib/utils/playerHelpers";
import { toast } from "sonner";
import { josephinBold } from "@/components/ui/fonts";

export interface TransferPayload {
  amount: string;
  type: TransferType;
  fromPlayerId?: string;
  toPlayerId?: string;
  reason: string;
  roomId: string;
}
type TransferType =
  | "SEND"
  | "REQUEST"
  | "ADD"
  | "SUBTRACT"
  | "BANKER_ADD"
  | "BANKER_REMOVE";

interface BankerTransactionPayload {
  type: "BANKER_TRANSACTION";
  amount: string;
  fromPlayerId: string;
  toPlayerId: string;
  transactionType: "BANKER_ADD" | "BANKER_REMOVE";
  roomId: string;
}

type WebSocketPayload =
  | TransferPayload
  | JoinPayload
  | PurchasePropertyPayload
  | BankerTransactionPayload;

interface JoinPayload {
  playerId: string;
}

interface PurchasePropertyPayload {
  type: "PURCHASE_PROPERTY";
  propertyId: string;
  buyerId: string;
  price: number;
  roomId: string;
}

const RoomPage = ({ params }: { params: Promise<{ code: string }> }) => {
  const { code } = use(params);
  const [player, setPlayer] = useState<Player | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<Player[]>([]);
  const [room, setRoom] = useState<Room>();
  const ws = useRef<WebSocket | null>(null);
  const handleBankerTransaction = (
    amount: string,
    targetPlayerId: string,
    transactionType: "BANKER_ADD" | "BANKER_REMOVE"
  ) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      try {
        ws.current.send(
          JSON.stringify({
            type: "BANKER_TRANSACTION",
            payload: {
              type: "BANKER_TRANSACTION",
              amount,
              fromPlayerId: player?.id,
              toPlayerId: targetPlayerId,
              transactionType,
              roomId: room?.id,
            },
          })
        );
        console.log("Banker transaction sent successfully");
      } catch (error) {
        console.error("Error sending banker transaction:", error);
        toast.error("Failed to process banker transaction");
      }
    } else {
      console.error("WebSocket not connected. State:", ws.current?.readyState);
      toast.error("Connection lost. Trying to reconnect...");
      const storedPlayerId = playerStore.getPlayerIdForRoom(code);
      if (storedPlayerId) {
        initializeWebSocket(storedPlayerId);
      }
    }
  };
  const handlePurchaseProperty = (
    propertyId: string,
    buyerId: string,
    price: number
  ) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const purchasePayload: PurchasePropertyPayload = {
        type: "PURCHASE_PROPERTY",
        propertyId,
        buyerId,
        price,
        roomId: code,
      };

      try {
        ws.current.send(
          JSON.stringify({
            type: "PURCHASE_PROPERTY",
            payload: purchasePayload,
          })
        );
        console.log("Property purchase message sent successfully");
      } catch (error) {
        console.error("Error sending property purchase message:", error);
        toast.error("Failed to send purchase request");
      }
    } else {
      console.error("WebSocket not connected. State:", ws.current?.readyState);
      toast.error("Connection lost. Trying to reconnect...");
      const storedPlayerId = playerStore.getPlayerIdForRoom(code);
      if (storedPlayerId) {
        initializeWebSocket(storedPlayerId);
      }
    }
  };
  const handleFreeParkingAction = (
    amount: string,
    type: "ADD" | "REMOVE",
    playerId: string
  ) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      try {
        ws.current.send(
          JSON.stringify({
            type: "FREE_PARKING",
            payload: {
              type,
              amount,
              playerId,
              roomId: room?.id,
            },
          })
        );
        console.log("Free parking action sent successfully");
      } catch (error) {
        console.error("Error sending free parking action:", error);
        toast.error("Failed to process Free Parking action");
      }
    } else {
      console.error("WebSocket not connected. State:", ws.current?.readyState);
      toast.error("Connection lost. Trying to reconnect...");
      const storedPlayerId = playerStore.getPlayerIdForRoom(code);
      if (storedPlayerId) {
        initializeWebSocket(storedPlayerId);
      }
    }
  };
  const fetchRoomData = async () => {
    try {
      const storedPlayerId = playerStore.getPlayerIdForRoom(code);

      if (!storedPlayerId) {
        toast.error("No player ID found for this room");
        return;
      }

      const roomResponse = await fetch(getEndpoints.room.getDetails(code), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const roomData = await roomResponse.json();

      const playersWithProperties = await Promise.all(
        roomData.players.map(async (p: Player) => {
          const propertyResponse = await fetch(
            getEndpoints.player.getDetails(p.id),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const propertyData = await propertyResponse.json();
          return {
            ...p,
            properties: propertyData.properties,
          };
        })
      );

      const currentPlayer = playersWithProperties.find(
        (p: Player) => p.id === storedPlayerId
      );

      const remainingPlayers = playersWithProperties.filter(
        (p: Player) => p.id !== storedPlayerId
      );

      setPlayer(currentPlayer || null);
      setOtherPlayers(remainingPlayers);
      setRoom(roomData.room);
    } catch (error) {
      console.error("Failed to fetch room data:", error);
      toast.error("Failed to fetch room data");
    }
  };
  const [availableProperties, setAvailableProperties] = useState([]);

  const initializeWebSocket = (storedPlayerId: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    ws.current = new WebSocket(getWsUrl(code));

    ws.current.onopen = () => {
      console.log("WebSocket connected to room:", code);
      sendMessage("JOIN", { playerId: storedPlayerId });
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = (event) => {
      console.log(
        "WebSocket closed. Reconnecting...",
        event.code,
        event.reason
      );
      setTimeout(() => initializeWebSocket(storedPlayerId), 1000);
    };

    ws.current.onmessage = (event) => {
      console.log("Raw WebSocket message received:", event.data);

      try {
        const message = JSON.parse(event.data);
        console.log("Parsed WebSocket message:", message);

        switch (message.type) {
          case "PLAYER_JOINED":
            console.log("Player joined event received");
            toast.success(message.payload.notification || "Player Joined", {
              duration: 4000,
              icon: "🧍",
              position: "top-center",
              className: `${josephinBold.className} text-xs text-center`,
            });
            fetchRoomData();
            break;
          case "FREE_PARKING":
            toast.success(message.payload.notification, {
              duration: 4000,
              icon: "💰",
              position: "top-center",
              className: `${josephinBold.className} text-xs text-center`,
            });
            fetchRoomData();
            break;
          case "PLAYER_LEFT":
            console.log("Player left event received");
            toast.success(message.payload.notification || "Player Left", {
              duration: 4000,
              icon: "🧍",
              position: "top-center",
              className: `${josephinBold.className} text-xs text-center`,
            });
            fetchRoomData();
            break;
          case "BANKER_TRANSACTION":
            toast.success(message.payload.notification, {
              duration: 4000,
              icon: "🏦",
              position: "top-center",
              className: `${josephinBold.className} text-xs text-center`,
            });
            fetchRoomData();
            break;
          case "PURCHASE_PROPERTY":
            toast.success(message.payload.notification, {
              duration: 4000,
              icon: "🏠",
              position: "top-center",
              className: `${josephinBold.className} text-xs text-center`,
            });
            fetchRoomData();
            fetchAvailableProperties(code);
            break;
          case "TRANSFER":
            toast.success(message.payload.notification, {
              duration: 4000,
              icon: "💵",
              position: "top-center",
              className: `${josephinBold.className} text-xs text-center`,
            });
            fetchRoomData();
            break;
          case "GAME_STATE_UPDATE":
            fetchRoomData();
            break;
          default:
            console.log("Unknown message type received:", message.type);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };
    ws.current.onclose = () => {
      setTimeout(() => initializeWebSocket(storedPlayerId), 1000);
    };
  };

  useEffect(() => {
    const storedPlayerId = playerStore.getPlayerIdForRoom(code);

    if (!storedPlayerId) {
      toast.error("No player found for this room");
      return;
    }

    initializeWebSocket(storedPlayerId);
    fetchRoomData();
    fetchAvailableProperties(code);

    return () => {
      ws.current?.close();
    };
  }, [code]);

  const sendMessage = (
    type: "TRANSFER" | "JOIN" | "PURCHASE_PROPERTY",
    payload: WebSocketPayload
  ) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log("Attempting to send message:", { type, payload });
      try {
        ws.current.send(JSON.stringify({ type, payload }));
        console.log("Message sent successfully");
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message");
      }
    } else {
      console.error("WebSocket not connected. State:", ws.current?.readyState);
      toast.error("Connection lost. Trying to reconnect...");
      const storedPlayerId = playerStore.getPlayerIdForRoom(code);
      if (storedPlayerId) {
        initializeWebSocket(storedPlayerId);
      }
    }
  };
  const fetchAvailableProperties = async (roomCode: string) => {
    try {
      const response = await fetch(
        `https://emoney.up.railway.app/property/available/${roomCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch available properties");
      }

      const data = await response.json();
      setAvailableProperties(data.availableProperties);
    } catch (error) {
      console.error("Error fetching available properties:", error);
      toast.error("Unable to retrieve available properties");
    }
  };

  return (
    <>
      <RoomView
        currentPlayer={player}
        otherPlayers={otherPlayers}
        room={room}
        onTransfer={(amount, type, transferDetails) => {
          sendMessage("TRANSFER", {
            amount,
            type,
            fromPlayerId: transferDetails.fromPlayerId,
            toPlayerId: transferDetails.toPlayerId,
            reason: transferDetails.reason,
            roomId: transferDetails.roomId,
          } as TransferPayload);
        }}
        availableProperties={availableProperties}
        onPurchaseProperty={handlePurchaseProperty}
        onFreeParkingAction={handleFreeParkingAction}
        onBankerTransaction={handleBankerTransaction}
      />
    </>
  );
};

export default RoomPage;
