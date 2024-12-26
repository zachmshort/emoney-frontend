"use client";
import { Player } from "@/types/schema";
import { josephinBold } from "../ui/fonts";
import { PlayerDetails } from "./player-card-content";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ManagePropertiesPayload, TransferType } from "@/types/payloads";

const PlayerCard = ({
  player,
  currentPlayer,
  allPlayers,
  isBanker = false,
  onTransfer,
  roomId,
  onBankerTransaction,
  onManageProperties,
}: {
  player: Player;
  currentPlayer: Player;
  allPlayers: Player[];
  isBanker?: boolean;
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
  roomId: string;
  onBankerTransaction: (
    amount: string,
    playerId: string,
    transactionType: string
  ) => void;
  onManageProperties?: (
    amount: number,
    managementType: ManagePropertiesPayload["managementType"],
    properties: { propertyId: string; count?: number }[],
    playerId: string
  ) => void;
}) => {
  const color = player?.color || "#fff";

  return (
    <>
      <div className="snap-center w-[360px] border bg-white border-black  aspect-[3/4] select-none relative">
        <div className={`p-3 w-full h-full border-black `}>
          <div className={`border border-black p-2 h-full`}>
            <div
              style={{ backgroundColor: color }}
              className={`h-16 border-[1px] border-black w-full flex items-center ${
                isBanker ? "justify-evenly" : "justify-center"
              } ${josephinBold.className} text-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ color: "black" }} className={`!text-3xl pt-2`}>
                {player?.name}
              </div>
            </div>{" "}
            <PlayerDetails
              player={player}
              currentPlayer={currentPlayer}
              onTransfer={onTransfer}
              onManageProperties={onManageProperties}
              onBankerTransaction={onBankerTransaction}
              allPlayers={allPlayers}
              roomId={roomId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerCard;
