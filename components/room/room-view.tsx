"use client";

import PlayerCard from "@/components/players/card";
import { Player, Property, Room } from "@/types/schema";
import Navbar from "../navbar/navbar";

const RoomView = ({
  currentPlayer,
  otherPlayers,
  room,
  availableProperties,
  onTransfer,
}: {
  otherPlayers: Player[];
  currentPlayer: Player;
  room: Room;
  onTransfer: (
    amount: string,
    type: string,
    transferDetails: {
      fromPlayerId: string;
      toPlayerId: string;
      reason: string;
    }
  ) => void;
  availableProperties: Property[];
}) => {
  return (
    <div className="min-h-screen w-full relative flex flex-col">
      <div className="sticky top-0 z-50 bg-white">
        <Navbar
          freeParking={room?.freeParking || 0}
          availableProperties={availableProperties}
        />
      </div>
      <div className="flex-1 flex items-center">
        <div className="w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar">
          <div className="inline-flex gap-x-4">
            <div className="flex-none snap-center ml-4">
              <PlayerCard
                player={currentPlayer}
                isBanker={currentPlayer?.isBanker}
                currentPlayer={currentPlayer}
                onTransfer={onTransfer}
              />
            </div>

            {otherPlayers?.map((oPlayer) => (
              <div key={oPlayer?.id} className="flex-none snap-center mr-4">
                <PlayerCard
                  player={oPlayer}
                  isBanker={currentPlayer?.isBanker}
                  currentPlayer={currentPlayer}
                  onTransfer={onTransfer}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomView;
