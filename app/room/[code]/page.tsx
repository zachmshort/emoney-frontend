"use client";
import { Player, Room } from "@/types/schema";
import { use, useEffect, useRef, useState } from "react";
import RoomView from "../components/room-view";
import { getWsUrl } from "@/types/schema";

const RoomPage = ({ params }: { params: Promise<{ code: string }> }) => {
  const { code } = use(params);
  const [player, setPlayer] = useState<Player | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<Player[]>([]);
  const [room, setRoom] = useState<Room>();
  const ws = useRef<WebSocket | null>(null);
  const [deviceId, setDeviceId] = useState<string>("");

  const fetchRoomData = async () => {
    try {
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
        (p: Player) => p.deviceId === deviceId
      );
      const remainingPlayers = data.players.filter(
        (p: Player) => p.deviceId !== deviceId
      );

      setPlayer(currentPlayer || null);
      setOtherPlayers(remainingPlayers);
      setRoom(data.room);
    } catch (error) {
      console.error("Failed to fetch room data:", error);
    }
  };

  const initializeWebSocket = (storedDeviceId: string | null) => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    ws.current = new WebSocket(getWsUrl(code));

    ws.current.onopen = () => {
      console.log("Connected to room");
      sendMessage("JOIN", { deviceId: storedDeviceId });
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (
        [
          "PLAYER_JOINED",
          "PLAYER_LEFT",
          "TRANSFER",
          "GAME_STATE_UPDATE",
        ].includes(message.type)
      ) {
        fetchRoomData();
      }
    };

    ws.current.onclose = () => {
      setTimeout(() => initializeWebSocket(storedDeviceId), 1000);
    };
  };

  useEffect(() => {
    const storedDeviceId = localStorage.getItem("deviceId");
    setDeviceId(storedDeviceId);

    initializeWebSocket(storedDeviceId);
    fetchRoomData();

    return () => {
      ws.current?.close();
    };
  }, [code]);

  const sendMessage = (type: string, payload: any) => {
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
          });
        }}
      />
    </>
  );
};
export default RoomPage;
