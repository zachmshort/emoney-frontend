"use client";

import PlayerCard from "@/components/players/card";
import { Player, Property, Room } from "@/types/schema";
import Navbar from "../navbar/navbar";

const RoomView = ({
  player,
  otherPlayers,
  room,
  onTransfer,
  availableProperties,
}: {
  otherPlayers: Player[];
  player: Player;
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
    <div className="h-screen w-full relative">
      <Navbar
        freeParking={room?.freeParking || 0}
        availableProperties={availableProperties}
      />

      <div className="h-full flex items-center">
        <div className="w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar">
          <div className="inline-flex gap-x-4">
            <div className="flex-none snap-center ml-4">
              <PlayerCard
                player={player}
                showTransferButtons={false}
                isBanker={player?.isBanker}
                onTransfer={onTransfer}
              />
            </div>

            {otherPlayers?.map((oPlayer) => (
              <div key={oPlayer?.id} className="flex-none snap-center mr-4">
                <PlayerCard
                  player={oPlayer}
                  onTransfer={onTransfer}
                  isBanker={player?.isBanker}
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
