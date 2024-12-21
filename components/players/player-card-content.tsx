import { Player } from "@/types/schema";
import { josephinBold } from "../fonts";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import SelectColorProperties from "./purchase-properties-bank";
import { useState } from "react";
import SendReqToggle from "./pay-req-toggle-switch";
import PayRequestRent from "./pay.req.rent.component";
import { calculateMonopolies } from "../helper-funcs";

const PlayerDetails = ({
  player,
  currentPlayer,
  onTransfer,
  roomId,
}: {
  player: Player;
  currentPlayer: Player;
  roomId: string;
  onTransfer: (
    amount: string,
    type: "SEND" | "REQUEST",
    transferDetails: {
      fromPlayerId: string;
      toPlayerId: string;
      reason: string;
      roomId: string;
    }
  ) => void;
}) => {
  const [type, setType] = useState<"SEND" | "REQUEST">("SEND");
  const getPropertiesToShow = () => {
    if (type !== "SEND") {
      return currentPlayer?.properties;
    }
    return player?.properties;
  };
  const monopoliesCount = calculateMonopolies(player?.properties);

  return (
    <>
      <div
        className={`text-black flex flex-col items-evenly gap-y-2 justify-between ${josephinBold.className} text-2xl`}
      >
        <div className={`flex items-center justify-center mt-4`}>
          <div>${player?.balance || 0}</div>
        </div>
        <Drawer>
          <DrawerTrigger asChild>
            <div className={`flex items-center justify-between w-full`}>
              <div>{currentPlayer?.id === player?.id && "My"} Properties</div>
              <div>{player?.properties?.length || 0}</div>
            </div>
          </DrawerTrigger>
          <DrawerContent className={`bg-black h-[75vh] px-3 text-white`}>
            <DrawerTitle className={`text-black`}>
              {player?.name}&apos; Properties
            </DrawerTitle>
            <SelectColorProperties properties={player?.properties} />
          </DrawerContent>
        </Drawer>
        <div className={`flex items-center justify-between`}>
          <div>{currentPlayer?.id === player?.id && "My"} Monopolies</div>
          <div>{monopoliesCount}</div>
        </div>
        {currentPlayer?.id !== player?.id && (
          <Drawer>
            <DrawerTrigger asChild>
              <div
                className={`shadow-xl w-[calc(100%-1rem)] text-center border rounded-full absolute bottom-4 p-4`}
              >
                Pay or Request
              </div>
            </DrawerTrigger>
            <DrawerContent className={`h-[90vh] bg-black px-2`}>
              <DrawerTitle className={`text-black`}>
                Choose Payment Type
              </DrawerTitle>
              <SendReqToggle onToggle={(newType) => setType(newType)} />
              <PayRequestRent
                properties={getPropertiesToShow()}
                type={type}
                fromPlayer={type === "SEND" ? currentPlayer : player}
                toPlayer={type === "SEND" ? player : currentPlayer}
                onTransferRequest={(amount, reason, transferDetails) => {
                  const payload = {
                    amount: amount.toString(),
                    type: type,
                    fromPlayerId: transferDetails.fromPlayerId,
                    toPlayerId: transferDetails.toPlayerId,
                    reason: reason,
                    roomId: roomId,
                  };

                  onTransfer(payload.amount, payload.type, {
                    fromPlayerId: payload.fromPlayerId,
                    toPlayerId: payload.toPlayerId,
                    reason: payload.reason,
                    roomId: roomId,
                  });
                }}
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
