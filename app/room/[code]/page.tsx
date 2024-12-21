"use client";
import { Player, Room } from "@/types/schema";
import { use, useEffect, useRef, useState } from "react";
import RoomView from "@/components/room/room-view";
import { getEndpoints, getWsUrl } from "@/lib/utils/weHelpers";
import { playerStore } from "@/lib/utils/playerStore";
import { toast } from "sonner";

type TransferType = "SEND" | "REQUEST" | "ADD" | "SUBTRACT";

export interface TransferPayload {
  amount: string;
  type: TransferType;
  fromPlayerId?: string;
  toPlayerId?: string;
  reason: string;
  roomId: string;
}

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

type WebSocketPayload = TransferPayload | JoinPayload | PurchasePropertyPayload;

const RoomPage = ({ params }: { params: Promise<{ code: string }> }) => {
  const { code } = use(params);
  const [player, setPlayer] = useState<Player | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<Player[]>([]);
  const [room, setRoom] = useState<Room>();
  const ws = useRef<WebSocket | null>(null);
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
            fetchRoomData();
            break;
          case "PLAYER_LEFT":
            console.log("Player left event received");
            fetchRoomData();
            break;
          case "PROPERTY_BOUGHT":
            console.log("Player bought property");
            fetchRoomData();
            fetchAvailableProperties(code);
            break;
          case "TRANSFER":
            console.log("Transfer message received:", message);
            fetchRoomData();
            break;
          case "GAME_STATE_UPDATE":
            console.log("Game state update received:", message);
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
    type: "TRANSFER" | "JOIN" | "PROPERTY_BOUGHT",
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
      />
    </>
  );
};

export default RoomPage;
