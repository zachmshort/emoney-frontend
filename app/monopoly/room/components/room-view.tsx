"use client";

import { useEffect, useRef, useState } from "react";

interface Player {
  id: string;
  name: string;
  color: string;
  balance: number;
}

// interface Property {
//   id: string;
//   propertyIndex: number;
//   houses: number;
//   hotel: number;
//   isMortgaged: boolean;
// }

const RoomView = ({ roomCode }: { roomCode: string }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  // const [properties, setProperties] = useState<{ [key: string]: Property[] }>(
  //   {}
  // );
  const properties = [];
  const [view, setView] = useState<"players" | "properties">("players");
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const playersContainerRef = useRef<HTMLDivElement>(null);
  const propertiesContainerRef = useRef<HTMLDivElement>(null);

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

  const handleScroll = () => {
    if (playersContainerRef.current && propertiesContainerRef.current) {
      const playerScroll = playersContainerRef.current.scrollLeft;
      const propertiesScroll = propertiesContainerRef.current.scrollLeft;

      if (playerScroll === 0) {
        setView("players");
      } else if (propertiesScroll > 0) {
        setView("properties");
      }
    }
  };

  const handleButtonClick = (playerId: string) => {
    setSelectedPlayer(playerId);
    setView("properties");
    propertiesContainerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="flex flex-col h-full">
        <div
          ref={playersContainerRef}
          className="w-full snap-x snap-mandatory overflow-x-auto flex"
          onScroll={handleScroll}
        >
          {players?.map((player) => (
            <div
              key={player.id}
              className="w-full flex-none snap-center"
              style={{ minWidth: "100%" }}
            >
              <button
                onClick={() => handleButtonClick(player.id)}
                className="p-4 bg-blue-500 text-white rounded"
              >
                View {player.name}&apos;s Properties
              </button>
            </div>
          ))}
        </div>

        {selectedPlayer && view === "properties" && (
          <div
            ref={propertiesContainerRef}
            className="w-full snap-x snap-mandatory overflow-x-auto flex mt-4"
            style={{ minHeight: "60vh" }}
            onScroll={handleScroll}
          >
            {properties[selectedPlayer]?.map((property) => (
              <div
                key={property.id}
                className="w-full flex-none snap-center"
                style={{ minWidth: "100%" }}
              >
                <div className="p-4 bg-gray-200 rounded">
                  Property ID: {property.id}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomView;
