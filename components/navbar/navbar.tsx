import { Player, Property } from "@/types/schema";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { AiOutlineMenu } from "react-icons/ai";
import { josephinNormal, sulpherBold } from "../ui/fonts";
import SelectColorProperties from "../players/purchase-properties-bank";
import { useState } from "react";
import Link from "next/link";
import FreeParkingDialog from "./free-parking";
import { playerStore } from "@/lib/utils/playerHelpers";

const Navbar = ({
  freeParking,
  player,
  availableProperties,
  onFreeParkingAction,
  roomId,
  onPurchaseProperty,
}: {
  freeParking: number;
  roomId: string;
  player: Player;
  onPurchaseProperty: (
    propertyId: string,
    buyerId: string,
    price: number
  ) => void;
  onFreeParkingAction: (amount: string, type: string, playerId: string) => void;
  availableProperties?: Property[];
}) => {
  const [showProperties, setShowProperties] = useState(false);
  const [showFreeParking, setShowFreeParking] = useState(false);

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <div className={`border rounded-md p-2 absolute top-4 right-4 `}>
            <AiOutlineMenu size={25} />
          </div>
        </DrawerTrigger>
        <DrawerContent
          className={`${josephinNormal.className} h-[75vh] bg-black border-[1px] px-3 text-3xl `}
        >
          <DrawerTitle className={`text-black`}>Menu</DrawerTitle>
          <ul className={`flex flex-col h-[75vh] relative`}>
            {showProperties ? (
              <>
                <div
                  className={`flex justify-between`}
                  onClick={() => {
                    setShowProperties(false);
                    setShowFreeParking(false);
                  }}
                >
                  <li
                    className={`border w-full text-center py-2 rounded shadow-xl`}
                  >
                    Return to Main Menu
                  </li>
                </div>
                <div
                  className={`${sulpherBold.className} bg-black h-full  text-2xl overflow-y-auto`}
                >
                  <DrawerTitle className={`select-none text-black`}>
                    Properties for Sale
                  </DrawerTitle>
                  <SelectColorProperties
                    properties={availableProperties}
                    onPurchase={onPurchaseProperty}
                    player={player}
                  />
                </div>
              </>
            ) : showFreeParking ? (
              <>
                <FreeParkingDialog
                  player={player}
                  onFreeParkingAction={onFreeParkingAction}
                  freeParking={freeParking}
                  onClick={() => setShowFreeParking(false)}
                />
              </>
            ) : (
              <>
                <div
                  className={`flex justify-between mt-2`}
                  onClick={() => setShowProperties(true)}
                >
                  <li>Bank&apos;s Properties</li>
                  <li>{availableProperties.length}</li>
                </div>
                <div
                  className={`flex justify-between mt-4`}
                  onClick={() => setShowFreeParking(true)}
                >
                  <li>Free Parking</li>
                  <li>${freeParking}</li>
                </div>
                <div className={`absolute bottom-2 w-full`}>
                  <div className={`flex flex-col items-start w-full `}>
                    <div className={` w-full text-lg text-red-300`}>
                      Danger Zone
                    </div>
                    <div
                      className={`flex flex-col items-start w-full space-y-5`}
                    >
                      <Link
                        href={`/`}
                        className={` w-full text-lg border border-red-300 p-2 rounded-sm`}
                      >
                        Leave Game
                      </Link>
                      <Link
                        href={`/`}
                        className={`w-full text-lg border rounded-sm p-2 border-red-300`}
                        onClick={() => playerStore.clearAllPlayerData()}
                      >
                        Delete My Players in All Games
                      </Link>
                      <Link
                        href={`/`}
                        className={`  p-2 border rounded-sm w-full text-lg border-red-300`}
                        onClick={() => {
                          playerStore.clearPlayerDataForRoom(roomId);
                        }}
                      >
                        Delete My Player this Game
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </ul>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;
