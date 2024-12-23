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
import { TransferType } from "@/types/payloads";

const PlayerCard = ({
  player,
  currentPlayer,
  allPlayers,
  isBanker = false,
  onTransfer,
  roomId,
  onBankerTransaction,
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
}) => {
  const [dialogState, setDialogState] = useState<"add" | "remove" | null>(null);
  const [amount, setAmount] = useState("");

  const handleBankerAction = (isAdd: boolean) => {
    onBankerTransaction(
      amount,
      player.id,
      isAdd ? "BANKER_ADD" : "BANKER_REMOVE"
    );
    setAmount("");
    setDialogState(null);
  };
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
              {isBanker && (
                <>
                  <button
                    onClick={() => setDialogState("remove")}
                    className={`text-black pt-2`}
                  >
                    -
                  </button>
                </>
              )}
              <div style={{ color: "black" }} className={`!text-3xl pt-2`}>
                {player?.name}
              </div>
              {isBanker && (
                <>
                  <button
                    onClick={() => setDialogState("add")}
                    className={`text-black pt-2`}
                  >
                    +
                  </button>
                </>
              )}
            </div>

            <Dialog
              open={dialogState !== null}
              onOpenChange={(open) => !open && setDialogState(null)}
            >
              <DialogContent
                className={`sm:max-w-[425px] ${josephinBold.className} text-black`}
              >
                <DialogHeader>
                  <DialogTitle>
                    {dialogState === "add"
                      ? "Add Money to"
                      : "Remove Money from"}{" "}
                    {player?.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="col-span-3"
                    />
                    <Button
                      onClick={() => handleBankerAction(dialogState === "add")}
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <PlayerDetails
              player={player}
              currentPlayer={currentPlayer}
              onTransfer={onTransfer}
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
