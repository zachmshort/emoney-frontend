import { Player } from "@/types/schema";
import { josephinBold, sulpherBold } from "../fonts";
import { PlayerDetails } from "./card-content";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PlayerCard = ({
  player,
  currentPlayer,
  isBanker = false,
  onTransfer,
  roomId,
  onBankerTransaction,
}: {
  player: Player;
  currentPlayer: Player;
  isBanker?: boolean;
  onTransfer: (
    amount: string,
    type: string,
    transferDetails: {
      fromPlayerId: string;
      roomId: string;
      toPlayerId: string;
      reason: string;
    }
  ) => void;
  roomId: string;
  onBankerTransaction: (
    amount: string,
    playerId: string,
    transactionType: string
  ) => void;
}) => {
  const [amount, setAmount] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const handleBankerAction = (isAdd: boolean) => {
    onBankerTransaction(
      amount,
      player.id,
      isAdd ? "BANKER_ADD" : "BANKER_REMOVE"
    );
    setAmount("");
    setIsAddDialogOpen(false);
    setIsRemoveDialogOpen(false);
  };

  let color = player?.color || "#fff";

  const BankerDialog = ({ isAdd }: { isAdd: boolean }) => (
    <Dialog
      open={isAdd ? isAddDialogOpen : isRemoveDialogOpen}
      onOpenChange={isAdd ? setIsAddDialogOpen : setIsRemoveDialogOpen}
    >
      <DialogContent
        className={`sm:max-w-[425px] ${josephinBold.className} text-black`}
      >
        <DialogHeader>
          <DialogTitle>
            {isAdd ? "Add Money to" : "Remove Money from"} {player.name}
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
            <Button onClick={() => handleBankerAction(isAdd)}>Confirm</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <div className="snap-center w-[360px] border bg-white border-black aspect-[3/4] rounded select-none relative">
        <div className={`border p-2 w-full h-full border-black`}>
          <div
            style={{ backgroundColor: color }}
            className={`h-16 w-full flex items-center ${
              isBanker ? "justify-evenly" : "justify-center"
            } ${sulpherBold.className} text-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            {isBanker && (
              <>
                <button
                  className="border rounded-md aspect-square px-4 border-red-300"
                  onClick={() => setIsRemoveDialogOpen(true)}
                >
                  -
                </button>
                <BankerDialog isAdd={false} />
              </>
            )}
            <div className="text-black">{player?.name}</div>
            {isBanker && (
              <>
                <button
                  className="border rounded-md aspect-square px-4 border-green-300"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  +
                </button>
                <BankerDialog isAdd={true} />
              </>
            )}
          </div>
          <PlayerDetails
            player={player}
            currentPlayer={currentPlayer}
            onTransfer={onTransfer}
            roomId={roomId}
          />
        </div>
      </div>
    </>
  );
};

export default PlayerCard;
