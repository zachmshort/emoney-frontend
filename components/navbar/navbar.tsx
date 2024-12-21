import { Player, Property } from "@/types/schema";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { AiOutlineMenu } from "react-icons/ai";
import { josephinNormal, sulpherBold } from "../fonts";
import SelectColorProperties from "../players/select-color-properties";
import { useState } from "react";
import Link from "next/link";
import FreeParkingDialog from "./free-parking";

const Navbar = ({
  freeParking,
  player,
  availableProperties,
  onFreeParkingAction,
  onPurchaseProperty,
}: {
  freeParking: number;
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
          <div className={`border rounded-md p-2 absolute top-4 right-4`}>
            <AiOutlineMenu size={25} />
          </div>
        </DrawerTrigger>
        <DrawerContent
          className={`${josephinNormal.className} h-[75vh] bg-black border-[1px] px-3 text-2xl`}
        >
          <DrawerTitle className={`text-black`}>Menu</DrawerTitle>
          <ul className={`flex flex-col`}>
            {showProperties ? (
              <>
                <div
                  className={`flex justify-between`}
                  onClick={() => setShowProperties(false)}
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
                  onCancel={() => {}}
                />
              </>
            ) : (
              <>
                <div
                  className={`flex justify-between`}
                  onClick={() => setShowProperties(true)}
                >
                  <li>Bank Properties</li>
                  <li>{availableProperties.length}</li>
                </div>
                <div className={`flex justify-between`}>
                  <li>Free Parking</li>
                  <li>${freeParking}</li>
                </div>
                <Link href={`/`}>
                  <div
                    className={`text-center absolute bottom-0 w-full border rounded-md p-3 $`}
                  >
                    Sign Out
                  </div>
                </Link>
              </>
            )}
          </ul>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;
