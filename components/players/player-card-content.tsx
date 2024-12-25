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

const PlayerDetails = ({
  player,
  currentPlayer,
  allPlayers,
  onTransfer,
  roomId,
  onManageProperties,
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
  // const monopoliesCount = calculateMonopolies(player?.properties);

  return (
    <>
      <div
        className={`px-4 text-black flex flex-col items-evenly gap-y-2 justify-between ${josephinNormal.className} text-2xl`}
      >
        <div
          className={`${josephinBold.className} absolute top-[6.5rem] right-1/2 transform translate-x-1/2`}
        >
          ${player?.balance || 0}
        </div>
        <Drawer>
          <DrawerTrigger asChild>
            <div className={`flex items-center justify-between w-full mt-14`}>
              <div>{currentPlayer?.id === player?.id && "My"} Properties</div>
              <div>{player?.properties?.length || 0}</div>
            </div>
          </DrawerTrigger>
          <DrawerContent className={`bg-black h-[80vh] px-3 text-white`}>
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
        <div className={`flex items-center justify-between`}>
          <div>{currentPlayer?.id === player?.id && "My"} Monopolies</div>
          {/* <div>{monopoliesCount}</div> */}
          <div>0</div>
        </div>
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
