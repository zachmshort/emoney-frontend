import { Player, Property } from "@/types/schema";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { AiOutlineMenu } from "react-icons/ai";
import { josephinBold, josephinNormal, sulpherBold } from "../fonts";
import SelectColorProperties from "../players/select-color-properties";
import { useState } from "react";
interface PurchasePropertyPayload {
  propertyId: string;
  buyerId: string;
  price: number;
  roomId: string;
}
const Navbar = ({
  freeParking,
  player,
  availableProperties,
  onPurchaseProperty,
}: {
  freeParking: number;
  player: Player;
  onPurchaseProperty: (
    propertyId: string,
    buyerId: string,
    price: number
  ) => void;
  availableProperties?: Property[];
}) => {
  const [showProperties, setShowProperties] = useState(false);
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
              </>
            )}
          </ul>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;
