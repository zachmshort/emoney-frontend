"use client";
import { EventHistory, Player, Room } from "@/types/schema";
import { use, useCallback, useEffect, useRef, useState } from "react";
import RoomView from "@/components/room/room.client";
import { getWsUrl } from "@/lib/utils/wsHelpers";
import { playerStore } from "@/lib/utils/playerHelpers";
import { toast } from "sonner";
import { josephinBold } from "@/components/ui/fonts";
import { sendMessage } from "@/lib/utils/sendWsMessage";
import { ManagePropertiesPayload } from "@/types/payloads";
import { usePublicFetch } from "@/hooks/use-public-fetch";
import { roomApi } from "@/lib/utils/api.service";
import DataState from "@/components/containers/data-state";

interface WebSocketMessage {
  type: string;
  payload: {
    notification?: string;
  };
}

const RoomPage = ({ params }: { params: Promise<{ code: string }> }) => {
  const { code } = use(params);
  const [player, setPlayer] = useState<Player | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<Player[]>([]);
  const [room, setRoom] = useState<Room>();
  const [eventHistory, setEventHistory] = useState<EventHistory[]>([]);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const ws = useRef<WebSocket | null>(null);
  const storedPlayerId = playerStore.getPlayerIdForRoom(code);

  const {
    data: playersData,
    error: playersError,
    loading: playersLoading,
    refetch: refetchPlayers,
  } = usePublicFetch<{
    players: Player[];
    room: Room;
    eventHistory: EventHistory[];
  }>(roomApi.getPlayers, {
    resourceParams: [code, storedPlayerId],
    dependencies: [code, storedPlayerId],
    enabled: !!code && !!storedPlayerId,
  });

  const {
    data: propertiesData,
    error: propertiesError,
    loading: propertiesLoading,
    refetch: refetchProperties,
  } = usePublicFetch(roomApi.getProperties, {
    resourceParams: [code],
    dependencies: [code],
    enabled: !!code,
  });

  useEffect(() => {
    if (playersData) {
      const currentPlayer =
        playersData.players?.find((p: Player) => p.id === storedPlayerId) ||
        null;

      const others =
        playersData.players?.filter((p: Player) => p.id !== storedPlayerId) ||
        [];

      setPlayer(currentPlayer);
      setOtherPlayers(others);
      setRoom(playersData.room);
      setEventHistory(playersData.eventHistory || []);
    }
  }, [playersData, storedPlayerId]);

  const handleBankerTransaction = (
    amount: string,
    targetPlayerId: string,
    transactionType: "BANKER_ADD" | "BANKER_REMOVE",
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
    price: number,
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

    refetchPlayers();

    if (["PURCHASE_PROPERTY", "MANAGE_PROPERTIES"].includes(message.type)) {
      refetchProperties();
    }
  };

  const handleFreeParkingAction = (
    amount: string,
    freeParkingType: "ADD" | "REMOVE",
    playerId: string,
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
    playerId: string,
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
    },
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
    (playerId: string) => {
      if (ws.current?.readyState === WebSocket.OPEN) return;

      ws.current = new WebSocket(getWsUrl(code));

      ws.current.onopen = () => {
        sendMessage(ws.current, "JOIN", { playerId });
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.current.onclose = () => {
        setTimeout(() => initializeWebSocket(playerId), 1000);
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
    [code],
  );

  useEffect(() => {
    if (!storedPlayerId) {
      toast.error("No player found for this room");
      return;
    }

    initializeWebSocket(storedPlayerId);

    return () => {
      ws.current?.close();
    };
  }, [code, storedPlayerId, initializeWebSocket]);

  const isLoading = playersLoading || propertiesLoading;
  const error = playersError || propertiesError;

  const combinedData =
    playersData && propertiesData
      ? {
        players: playersData,
        properties: propertiesData,
      }
      : null;

  useEffect(() => {
    if (!initialLoadComplete && playersData && propertiesData) {
      setInitialLoadComplete(true);
    }
  }, [playersData, propertiesData, initialLoadComplete]);

  return (
    <DataState
      data={combinedData}
      loading={!initialLoadComplete}
      error={error}
      refetch={() => {
        refetchPlayers();
        refetchProperties();
      }}
    >
      {() => (
        <RoomView
          room={room}
          loading={isLoading}
          currentPlayer={player}
          otherPlayers={otherPlayers}
          availableProperties={propertiesData?.availableProperties || []}
          eventHistory={eventHistory}
          onTransfer={handleTransfer}
          onPurchaseProperty={handlePurchaseProperty}
          onFreeParkingAction={handleFreeParkingAction}
          onBankerTransaction={handleBankerTransaction}
          onManageProperties={handleManageProperties}
        />
      )}
    </DataState>
  );
};

export default RoomPage;

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
    case "MANAGE_PROPERTIES":
      return "🏠";
    default:
      return "ℹ️";
  }
};
