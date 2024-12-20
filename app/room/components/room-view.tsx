"use client";

import { sulpherBold } from "@/components/fonts";
import PlayerCard from "@/components/players/card";
import { Player, Room } from "@/types/schema";
import Image from "next/image";

const RoomView = ({
  player,
  otherPlayers,
  room,
  onTransfer,
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
}) => {
  return (
    <div className="h-screen w-full relative">
      <div className="absolute top-2 right-0 z-10">
        <Image
          src="/free-parking.png"
          alt="free parking"
          width={200}
          height={300}
        />
        <a
          className={`absolute top-9 right-2 text-blue-500 text-2xl ${sulpherBold.className} select-none`}
        >
          ${room?.freeParking}
        </a>
      </div>

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
