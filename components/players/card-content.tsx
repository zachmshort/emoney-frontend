import { Player } from "@/types/schema";
import { josephinBold } from "../fonts";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import SelectColorProperties from "./select-color-properties";
import { useState } from "react";
import SendReqToggle from "./send-req-toggle";
import PayRequestRent from "./rent-properties";

const PlayerDetails = ({
  player,
  currentPlayer,
  onTransfer,
}: {
  player: Player;
  currentPlayer: Player;
  onTransfer: (
    amount: string,
    type: "SEND" | "REQUEST",
    transferDetails: {
      fromPlayerId: string;
      toPlayerId: string;
      reason: string;
    }
  ) => void;
}) => {
  const [type, setType] = useState<"SEND" | "REQUEST">("REQUEST");
  const getPropertiesToShow = () => {
    if (type !== "SEND") {
      return currentPlayer?.properties;
    }
    return player?.properties;
  };
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
          <DrawerContent>
            <DrawerTitle>{player?.name}&apos; Properties</DrawerTitle>
            <SelectColorProperties properties={player?.properties} />
          </DrawerContent>
        </Drawer>
        <div className={`flex items-center justify-between`}>
          <div>{currentPlayer?.id === player?.id && "My"} Monopolies</div>
          <div>0</div>
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
            <DrawerContent className={`h-[70vh] bg-black px-2`}>
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
                  };

                  onTransfer(payload.amount, payload.type, {
                    fromPlayerId: payload.fromPlayerId,
                    toPlayerId: payload.toPlayerId,
                    reason: payload.reason,
                  });
                }}
              />
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </>
  );
};

export { PlayerDetails };
