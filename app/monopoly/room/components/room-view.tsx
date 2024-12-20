"use client";

import { sulpherBold } from "@/components/fonts";
import PlayerCard from "@/components/players/card";
import { Player, Room } from "@/types/schema";
import Image from "next/image";
import { useEffect, useState } from "react";

const RoomView = ({ roomCode }: { roomCode: string }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<Player[]>([]);
  const [room, setRoom] = useState<Room>();
  const [deviceId, setDeviceId] = useState<string>("");
  console.log(deviceId);
  useEffect(() => {
    const storedDeviceId = localStorage.getItem("deviceId");
    setDeviceId(storedDeviceId);
    const fetchRoomData = async () => {
      const response = await fetch(
        `https://emoney.up.railway.app/player/room/${roomCode}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      const currentPlayer = data.players.find(
        (p: Player) => p.deviceId === storedDeviceId
      );
      const remainingPlayers = data.players.filter(
        (p: Player) => p.deviceId !== storedDeviceId
      );

      setPlayer(currentPlayer || null);
      setOtherPlayers(remainingPlayers);
      setRoom(data.room);
    };

    fetchRoomData();
  }, [roomCode]);

  return (
    <div className="h-screen w-screen flex flex-col relative items-center justify-center ">
      <div className={`absolute top-2 right-[0]`}>
        <Image
          src="/free-parking.png"
          alt="free parking"
          width={200}
          height={300}
        />
        <a
          className={`absolute top-9 right-[10rem]  text-blue-500 text-2xl ${sulpherBold.className} select-none`}
        >
          ${room?.freeParking}
        </a>
      </div>
      <PlayerCard
        player={player}
        showTransferButtons={false}
        isBanker={player?.isBanker}
      />
      {otherPlayers?.map((oPlayer) => (
        <PlayerCard
          player={oPlayer}
          key={oPlayer?.id}
          isBanker={player?.isBanker}
        />
      ))}
    </div>
  );
};

export default RoomView;
