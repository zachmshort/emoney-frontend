"use client";
import { Player, Room } from "@/types/schema";
import { use, useEffect, useRef, useState } from "react";
import RoomView from "@/components/room/room-view";
import { getWsUrl } from "@/lib/utils/weHelpers";
import { playerStore } from "@/lib/utils/playerStore";
import { toast } from "sonner";

type TransferType = "SEND" | "REQUEST" | "ADD" | "SUBTRACT";

interface TransferPayload {
  amount: string;
  type: TransferType;
  fromPlayerId?: string;
  toPlayerId?: string;
  reason: string;
}

interface JoinPayload {
  playerId: string;
}

type WebSocketPayload = TransferPayload | JoinPayload;

const RoomPage = ({ params }: { params: Promise<{ code: string }> }) => {
  const { code } = use(params);
  const [player, setPlayer] = useState<Player | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  console.log(playerId);
  const [otherPlayers, setOtherPlayers] = useState<Player[]>([]);
  const [room, setRoom] = useState<Room>();
  const ws = useRef<WebSocket | null>(null);

  const fetchRoomData = async () => {
    try {
      const storedPlayerId = playerStore.getPlayerIdForRoom(code);

      if (!storedPlayerId) {
        toast.error("No player ID found for this room");
        return;
      }

      const response = await fetch(
        `https://emoney.up.railway.app/player/room/${code}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      const currentPlayer = data.players.find(
        (p: Player) => p.id === storedPlayerId
      );

      const remainingPlayers = data.players.filter(
        (p: Player) => p.id !== storedPlayerId
      );

      setPlayer(currentPlayer || null);
      setPlayerId(storedPlayerId);
      setOtherPlayers(remainingPlayers);
      setRoom(data.room);
    } catch (error) {
      console.error("Failed to fetch room data:", error);
      toast.error("Failed to fetch room data");
    }
  };

  const initializeWebSocket = (storedPlayerId: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    ws.current = new WebSocket(getWsUrl(code));

    ws.current.onopen = () => {
      console.log("Connected to room");
      sendMessage("JOIN", { playerId: storedPlayerId });
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "PLAYER_JOINED":
          setOtherPlayers((prev) => [...prev, message.payload]);
          break;
        case "PLAYER_LEFT":
          setOtherPlayers((prev) =>
            prev.filter((player) => player.id !== message.payload.playerId)
          );
          break;
        case "TRANSFER":
        case "GAME_STATE_UPDATE":
          fetchRoomData();
          break;
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

    setPlayerId(storedPlayerId);
    initializeWebSocket(storedPlayerId);
    fetchRoomData();

    return () => {
      ws.current?.close();
    };
  }, [code]);

  const sendMessage = (
    type: "TRANSFER" | "JOIN",
    payload: WebSocketPayload
  ) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, payload }));
    }
  };

  return (
    <>
      <RoomView
        player={player}
        otherPlayers={otherPlayers}
        room={room}
        onTransfer={(amount, type, transferDetails) => {
          sendMessage("TRANSFER", {
            amount,
            type,
            fromPlayerId: transferDetails.fromPlayerId,
            toPlayerId: transferDetails.toPlayerId,
            reason: transferDetails.reason,
          } as TransferPayload);
        }}
      />
    </>
  );
};

export default RoomPage;
