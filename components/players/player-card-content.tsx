import { Player } from "@/types/schema";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { useState } from "react";
import SendReqToggle from "./pay-req-toggle-switch";
import PayRequestRent from "./pay.req.rent.component";
import { josephinBold, josephinNormal } from "../ui/fonts";
import PlayerTags from "./player-tags";
import ManageProperties from "./manage-properties";
import { ManagePropertiesPayload, TransferType } from "@/types/payloads";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";

const PlayerDetails = ({
  player,
  currentPlayer,
  allPlayers,
  onTransfer,
  roomId,
  onManageProperties,
  onBankerTransaction,
}: {
  player: Player;
  allPlayers: Player[];
  currentPlayer: Player;
  roomId: string;
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
  onManageProperties: (
    amount: number,
    managementType: ManagePropertiesPayload["managementType"],
    properties: { propertyId: string; count?: number }[],
    playerId: string
  ) => void;
  onBankerTransaction: (
    amount: string,
    playerId: string,
    transactionType: string
  ) => void;
}) => {
  const [transferType, setTransferType] = useState<"SEND" | "REQUEST">("SEND");
  const handleTransfer = (
    amount: number,
    reason: string,
    transferDetails: {
      fromPlayerId: string;
      toPlayerId: string;
    }
  ) => {
    const payload = {
      amount: amount.toString(),
      transferType: transferType,
      fromPlayerId: transferDetails.fromPlayerId,
      toPlayerId: transferDetails.toPlayerId,
      reason,
      roomId,
    };

    onTransfer(payload.amount, payload.transferType as TransferType, {
      fromPlayerId: payload.fromPlayerId,
      toPlayerId: payload.toPlayerId,
      reason: payload.reason,
      roomId: payload.roomId,
    });
  };
  const getPropertiesToShow = () => {
    if (transferType !== "SEND") {
      return currentPlayer?.properties;
    }
    return player?.properties;
  };

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

  return (
    <>
      <div
        className={`px-4 text-black flex flex-col items-evenly gap-y-2 justify-between ${josephinNormal.className} text-2xl`}
      >
        <Dialog
          open={dialogState !== null}
          onOpenChange={(open) => !open && setDialogState(null)}
        >
          <DialogContent
            className={`sm:max-w-[425px] ${josephinBold.className} text-black top-1/3`}
          >
            <DialogHeader>
              <DialogTitle>
                {dialogState === "add" ? "Add Money to" : "Remove Money from"}{" "}
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
        <div
          className={`${josephinBold.className} w-full absolute top-[6.5rem] right-1/2 transform translate-x-1/2`}
        >
          <div className={`flex items-center justify-center space-x-5 w-full`}>
            {currentPlayer?.isBanker && (
              <CiCircleMinus
                onClick={() => setDialogState("remove")}
                className={`hover:cursor-pointer pb-1`}
              />
            )}
            <p> ${player?.balance || 0}</p>{" "}
            {currentPlayer?.isBanker && (
              <CiCirclePlus
                onClick={() => setDialogState("add")}
                className={`hover:cursor-pointer pb-1`}
              />
            )}
          </div>
        </div>
        <Drawer>
          <DrawerTrigger asChild>
            <div className={`flex items-center justify-between w-full mt-14`}>
              <div>{currentPlayer?.id === player?.id && "My"} Properties</div>
              <div>{player?.properties?.length || 0}</div>
            </div>
          </DrawerTrigger>
          <DrawerContent
            className={`bg-black h-[600px] px-3 text-white  mt-0 border-t border-x border-b-none`}
          >
            <DrawerTitle className={`text-black select-none`}>
              {player?.id}&apos; Properties
            </DrawerTitle>
            <ManageProperties
              onManageProperties={onManageProperties}
              player={player}
              currentPlayer={currentPlayer}
            />
          </DrawerContent>
        </Drawer>
        <PlayerTags
          player={player}
          allPlayers={allPlayers.filter((p) => p?.id !== player?.id)}
        />
        {currentPlayer?.id !== player?.id && (
          <Drawer>
            <DrawerTrigger asChild>
              <div
                className={`shadow-xl w-[calc(100%-4rem)] text-center border rounded-full absolute bottom-6 p-4 right-1/2 transform translate-x-1/2 ${josephinBold.className}`}
              >
                Pay or Request
              </div>
            </DrawerTrigger>
            <DrawerContent className={`h-[90vh] bg-black px-2`}>
              <DrawerTitle className={`text-black`}>
                Choose Payment Type
              </DrawerTitle>
              <SendReqToggle onToggle={(newType) => setTransferType(newType)} />
              <PayRequestRent
                properties={getPropertiesToShow()}
                type={transferType}
                fromPlayer={transferType === "SEND" ? currentPlayer : player}
                toPlayer={transferType === "SEND" ? player : currentPlayer}
                onTransferRequest={(amount, reason, transferDetails) =>
                  handleTransfer(amount, reason, transferDetails)
                }
                roomId={roomId}
              />
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </>
  );
};

export { PlayerDetails };
