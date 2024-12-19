"use client";

import { useEffect, useState } from "react";

interface Player {
  id: string;
  name: string;
  color: string;
  balance: number;
}

interface Property {
  id: string;
  propertyIndex: number;
  houses: number;
  hotel: number;
  isMortgaged: boolean;
}

const RoomView = ({ roomCode }: { roomCode: string }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [properties, setProperties] = useState<{ [key: string]: Property[] }>(
    {}
  );
  console.log("players", players);
  console.log(properties);
  const [view, setView] = useState<"players" | "properties">("players");
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      const response = await fetch(
        `https://emoney.up.railway.app/player/room/${roomCode}`
      );
      const data = await response.json();
      setPlayers(data);
    };
    fetchRoomData();
  }, [roomCode]);

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="flex flex-col h-full">
        <div className="w-full snap-x snap-mandatory overflow-x-auto flex">
          {players?.map((player) => (
            <div
              key={player.id}
              className="w-full flex-none snap-center"
              style={{ minWidth: "100%" }}
            >
              {/* <PlayerCard
                player={player}
                onClick={() => {
                  setSelectedPlayer(player.id);
                  setView("properties");
                }}
              /> */}
            </div>
          ))}
        </div>

        {/* Properties view */}
        {selectedPlayer && view === "properties" && (
          <div
            className="w-full snap-x snap-mandatory overflow-x-auto flex mt-4"
            style={{ minHeight: "60vh" }}
          >
            {properties[selectedPlayer]?.map((property) => (
              <div
                key={property.id}
                className="w-full flex-none snap-center"
                style={{ minWidth: "100%" }}
              >
                {/* <PropertyCard property={property} /> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default RoomView;
