"use client";

import { useEffect, useRef } from "react";
import { use } from "react";
import RoomView from "../components/room-view";

const RoomPage = ({ params }: { params: Promise<{ code: string }> }) => {
  const { code } = use(params);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(`ws://emoney.up.railway.app/ws/room/${code}`);

    ws.current.onopen = () => {
      console.log("Connected to room");
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "PLAYER_JOINED":
          break;
        case "GAME_STATE_UPDATE":
          break;
      }
    };

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
      <RoomView roomCode={code} />
    </>
  );
};

export default RoomPage;
