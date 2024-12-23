"use client";
import { EventHistory, Player, Room } from "@/types/schema";
import { use, useEffect, useRef, useState } from "react";
import RoomView from "@/components/room/room.client";
import { getWsUrl } from "@/lib/utils/wsHelpers";
import { playerStore } from "@/lib/utils/playerHelpers";
import { toast } from "sonner";
import { josephinBold } from "@/components/ui/fonts";
import { fetchRoomData } from "@/lib/utils/roomHelpers";
import {
  PurchasePropertyPayload,
  TransferPayload,
  WebSocketPayload,
} from "@/types/payloads";
import { sendWebSocketMessage } from "@/lib/utils/sendWsMessage";

const RoomPage = ({ params }: { params: Promise<{ code: string }> }) => {
  // variables set by websocket passed down to children that change as game progresses
  const { code } = use(params);
  const [player, setPlayer] = useState<Player | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<Player[]>([]);
  const [room, setRoom] = useState<Room>();
  const [eventHistory, setEventHistory] = useState<EventHistory[]>([]); // history of transactions, game creation, etc.
  const [availableProperties, setAvailableProperties] = useState([]); // properties owned by bank, should be [] in late game

  const ws = useRef<WebSocket | null>(null);

  const handleBankerTransaction = (
    amount: string,
    targetPlayerId: string,
    transactionType: "BANKER_ADD" | "BANKER_REMOVE"
  ) => {
    sendMessage("BANKER_TRANSACTION", {
      type: "BANKER_TRANSACTION",
      amount,
      fromPlayerId: player?.id,
      toPlayerId: targetPlayerId,
      transactionType,
      roomId: room?.id,
    });
  };

  const handlePurchaseProperty = (
    propertyId: string,
    buyerId: string,
    price: number
  ) => {
    sendMessage("PURCHASE_PROPERTY", {
      type: "PURCHASE_PROPERTY",
      propertyId,
      buyerId,
      price,
      roomId: code,
    });
  };

  const handleFreeParkingAction = (
    amount: string,
    freeParkingType: "ADD" | "REMOVE",
    playerId: string
  ) => {
    sendMessage("FREE_PARKING", {
      type: "FREE_PARKING",
      freeParkingType,
      amount,
      playerId,
      roomId: room?.id,
    });
  };

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
            fetchRoomData(
              code,
              playerStore,
              setPlayer,
              setOtherPlayers,
              setRoom,
              setEventHistory
            );
            break;
          case "FREE_PARKING":
            toast.success(message.payload.notification, {
              duration: 4000,
              icon: "💰",
              position: "top-center",
              className: `${josephinBold.className} text-xs text-center`,
            });
            fetchRoomData(
              code,
              playerStore,
              setPlayer,
              setOtherPlayers,
              setRoom,
              setEventHistory
            );
            break;
          case "PLAYER_LEFT":
            console.log("Player left event received");
            toast.success(message.payload.notification || "Player Left", {
              duration: 4000,
              icon: "🧍",
              position: "top-center",
              className: `${josephinBold.className} text-xs text-center`,
            });
            fetchRoomData(
              code,
              playerStore,
              setPlayer,
              setOtherPlayers,
              setRoom,
              setEventHistory
            );
            break;
          case "BANKER_TRANSACTION":
            toast.success(message.payload.notification, {
              duration: 4000,
              icon: "🏦",
              position: "top-center",
              className: `${josephinBold.className} text-xs text-center`,
            });
            fetchRoomData(
              code,
              playerStore,
              setPlayer,
              setOtherPlayers,
              setRoom,
              setEventHistory
            );
            break;
          case "PURCHASE_PROPERTY":
            toast.success(message.payload.notification, {
              duration: 4000,
              icon: "🏠",
              position: "top-center",
              className: `${josephinBold.className} text-xs text-center`,
            });
            fetchRoomData(
              code,
              playerStore,
              setPlayer,
              setOtherPlayers,
              setRoom,
              setEventHistory
            );
            fetchAvailableProperties(code);
            break;
          case "TRANSFER":
            toast.success(message.payload.notification, {
              duration: 4000,
              icon: "💵",
              position: "top-center",
              className: `${josephinBold.className} text-xs text-center`,
            });
            fetchRoomData(
              code,
              playerStore,
              setPlayer,
              setOtherPlayers,
              setRoom,
              setEventHistory
            );
            break;
          case "GAME_STATE_UPDATE":
            fetchRoomData(
              code,
              playerStore,
              setPlayer,
              setOtherPlayers,
              setRoom,
              setEventHistory
            );
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
    fetchRoomData(
      code,
      playerStore,
      setPlayer,
      setOtherPlayers,
      setRoom,
      setEventHistory
    );
    fetchAvailableProperties(code);

    return () => {
      ws.current?.close();
    };
  }, [code]);

  const sendMessage = (
    type:
      | "TRANSFER"
      | "JOIN"
      | "PURCHASE_PROPERTY"
      | "BANKER_TRANSACTION"
      | "FREE_PARKING"
      | "MANAGE_PROPERTIES",
    payload: WebSocketPayload
  ) => {
    sendWebSocketMessage(ws.current, type, payload);
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
        eventHistory={eventHistory}
      />
    </>
  );
};

export default RoomPage;
