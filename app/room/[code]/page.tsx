"use client";
import { EventHistory, Player, Room } from "@/types/schema";
import { use, useCallback, useEffect, useRef, useState } from "react";
import RoomView from "@/components/room/room.client";
import { getWsUrl } from "@/lib/utils/wsHelpers";
import { playerStore } from "@/lib/utils/playerHelpers";
import { toast } from "sonner";
import { josephinBold } from "@/components/ui/fonts";
import {
  fetchRoomData,
  fetchAvailableProperties,
} from "@/lib/utils/roomHelpers";
import { sendMessage } from "@/lib/utils/sendWsMessage";
import { ManagePropertiesPayload } from "@/types/payloads";

interface WebSocketMessage {
  type: string;
  payload: {
    notification?: string;
  };
}

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
    sendMessage(ws.current, "BANKER_TRANSACTION", {
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
    sendMessage(ws.current, "PURCHASE_PROPERTY", {
      type: "PURCHASE_PROPERTY",
      propertyId,
      buyerId,
      price,
      roomId: code,
    });
  };

  const handleWebSocketNotification = (message: WebSocketMessage) => {
    toast.success(message.payload.notification, {
      duration: 4000,
      icon: getIconForType(message.type),
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

    if (["PURCHASE_PROPERTY", "MANAGE_PROPERTIES"].includes(message.type)) {
      fetchAvailableProperties(code, setAvailableProperties);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "PLAYER_JOINED":
        return "🧍";
      case "PLAYER_LEFT":
        return "🧍";
      case "BANKER_TRANSACTION":
        return "🏦";
      case "PROPERTY_CHANGE":
        return "🧾";
      case "TRANSFER":
        return "💵";
      default:
        return "ℹ️";
    }
  };

  const handleFreeParkingAction = (
    amount: string,
    freeParkingType: "ADD" | "REMOVE",
    playerId: string
  ) => {
    sendMessage(ws.current, "FREE_PARKING", {
      type: "FREE_PARKING",
      freeParkingType,
      amount,
      playerId,
      roomId: room?.id,
    });
  };

  const handleManageProperties = (
    amount: number,
    managementType: ManagePropertiesPayload["managementType"],
    properties: { propertyId: string; count?: number }[],
    playerId: string
  ) => {
    sendMessage(ws.current, "MANAGE_PROPERTIES", {
      managementType,
      playerId,
      properties,
      roomId: room?.id,
      amount,
    });
  };

  const handleTransfer = (
    amount: string,
    transferType:
      | "SEND"
      | "REQUEST"
      | "ADD"
      | "SUBTRACT"
      | "BANKER_ADD"
      | "BANKER_REMOVE",
    transferDetails: {
      fromPlayerId?: string;
      toPlayerId?: string;
      reason: string;
      roomId: string;
    }
  ) => {
    sendMessage(ws.current, "TRANSFER", {
      type: "TRANSFER",
      amount,
      transferType: transferType,
      fromPlayerId: transferDetails.fromPlayerId,
      toPlayerId: transferDetails.toPlayerId,
      reason: transferDetails.reason,
      roomId: transferDetails.roomId,
    });
  };

  const initializeWebSocket = useCallback(
    (storedPlayerId: string) => {
      if (ws.current?.readyState === WebSocket.OPEN) return;

      ws.current = new WebSocket(getWsUrl(code));

      ws.current.onopen = () => {
        sendMessage(ws.current, "JOIN", { playerId: storedPlayerId });
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.current.onclose = () => {
        setTimeout(() => initializeWebSocket(storedPlayerId), 1000);
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketNotification(message);
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      };
    },
    [code]
  );

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
    fetchAvailableProperties(code, setAvailableProperties);

    return () => {
      ws.current?.close();
    };
  }, [code]);

  return (
    <>
      <RoomView
        room={room}
        currentPlayer={player}
        otherPlayers={otherPlayers}
        availableProperties={availableProperties}
        eventHistory={eventHistory}
        onTransfer={handleTransfer}
        onPurchaseProperty={handlePurchaseProperty}
        onFreeParkingAction={handleFreeParkingAction}
        onBankerTransaction={handleBankerTransaction}
        onManageProperties={handleManageProperties}
      />
    </>
  );
};

export default RoomPage;
