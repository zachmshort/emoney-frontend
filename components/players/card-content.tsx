import { Player } from "@/types/schema";
import { josephinBold } from "../fonts";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import SelectColorProperties from "../navbar/select-color-properties";
import { useState } from "react";
import SendReqToggle from "./send-req-toggle";

const PlayerDetails = ({
  player,
  currentPlayer,
}: {
  player: Player;
  currentPlayer: Player;
}) => {
  const [type, setType] = useState("REQUEST");
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
              <SelectColorProperties properties={getPropertiesToShow()} />
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </>
  );
};

export { PlayerDetails };
