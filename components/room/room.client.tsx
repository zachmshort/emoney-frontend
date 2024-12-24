"use client";

import PlayerCard from "@/components/players/player-card";
import { EventHistory, Player, Property, Room } from "@/types/schema";
import Navbar from "../navbar/navbar";
import { josephinBold } from "../ui/fonts";
import { ManagePropertiesPayload, TransferType } from "@/types/payloads";

const RoomView = ({
  currentPlayer,
  otherPlayers,
  room,
  availableProperties,
  onTransfer,
  eventHistory,
  onPurchaseProperty,
  onFreeParkingAction,
  onBankerTransaction,
  onManageProperties,
}: {
  otherPlayers: Player[];
  eventHistory: EventHistory[];
  currentPlayer: Player;
  room: Room;
  onTransfer: (
    amount: string,
    transferType: TransferType,
    transferDetails: {
      fromPlayerId: string;
      toPlayerId: string;
      reason: string;
      roomId: string;
    }
  ) => void;

  onFreeParkingAction: (amount: string, type: string, playerId: string) => void;
  onBankerTransaction: (amount: string, type: string, playerId: string) => void;
  availableProperties: Property[];
  onPurchaseProperty: (
    propertyId: string,
    buyerId: string,
    price: number
  ) => void;
  onManageProperties: (
    amount: number,
    managementType: ManagePropertiesPayload["managementType"],
    properties: { propertyId: string; count?: number }[],
    playerId: string
  ) => void;
}) => {
  const allPlayers = [...otherPlayers, currentPlayer];
  return (
    <div className="min-h-screen w-full relative flex flex-col">
      <div className="sticky top-0 z-50 bg-white">
        <div
          className={`${josephinBold.className} select-none text-white absolute top-5 text-2xl right-1/2 transform translate-x-1/2`}
        >
          {room?.name || room?.roomCode}
        </div>
        <Navbar
          freeParking={room?.freeParking || 0}
          player={currentPlayer}
          eventHistory={eventHistory}
          availableProperties={availableProperties}
          onPurchaseProperty={onPurchaseProperty}
          onFreeParkingAction={onFreeParkingAction}
          roomCode={room?.roomCode}
          roomId={room?.id}
        />
      </div>
      <div className="flex-1 flex items-center overflow-x-auo">
        <div className="w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar">
          <div className="inline-flex gap-x-4 mx-4">
            <div className="flex-none snap-center">
              <PlayerCard
                player={currentPlayer}
                isBanker={currentPlayer?.isBanker}
                currentPlayer={currentPlayer}
                onTransfer={onTransfer}
                roomId={room?.id}
                allPlayers={allPlayers}
                onBankerTransaction={onBankerTransaction}
                onManageProperties={onManageProperties}
              />
            </div>

            {otherPlayers?.map((oPlayer) => (
              <div key={oPlayer?.id} className="flex-none snap-center">
                <PlayerCard
                  player={oPlayer}
                  isBanker={currentPlayer?.isBanker}
                  currentPlayer={currentPlayer}
                  onTransfer={onTransfer}
                  allPlayers={allPlayers}
                  roomId={room?.id}
                  onBankerTransaction={onBankerTransaction}
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
