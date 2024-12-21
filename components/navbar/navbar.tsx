import { Player, Property } from "@/types/schema";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { AiOutlineMenu } from "react-icons/ai";
import { sulpherBold } from "../fonts";
import SelectColorProperties from "../players/select-color-properties";
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
  roomId,
}: {
  freeParking: number;
  player: Player;
  onPurchaseProperty: (
    propertyId: string,
    buyerId: string,
    price: number
  ) => void;
  roomId;
  availableProperties?: Property[];
}) => {
  const handlePurchaseProperty = async (
    propertyId: string,
    buyerId: string,
    price: number
  ) => {
    const payload: PurchasePropertyPayload = {
      propertyId,
      buyerId,
      price,
      roomId: roomId,
    };

    try {
      // Send the purchase request to your backend
      const response = await fetch("/api/game/purchase-property", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to purchase property");
      }

      // If successful, show a confirmation message
      toast.success("Property purchased successfully!");

      // The actual game state update should happen through your real-time system
      // (e.g., websockets/Firebase) rather than updating state directly here
    } catch (error) {
      // Show error message to user
      toast.error(
        error instanceof Error ? error.message : "Failed to purchase property"
      );

      // Log the error for debugging
      console.error("Property purchase error:", error);
    }
  };

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <div className={`border rounded-md p-2 absolute top-4 right-4`}>
            <AiOutlineMenu size={25} />
          </div>
        </DrawerTrigger>
        <DrawerContent
          className={`${sulpherBold.className} h-[80vh] bg-black border-[1px] px-3 text-2xl`}
        >
          <DrawerTitle className={`text-black`}>Menu</DrawerTitle>
          <ul className={`flex flex-col gap-y-5 mt-5`}>
            <Drawer>
              <DrawerTrigger>
                <div className={`flex justify-between`}>
                  <li>Bank Properties</li>
                  <li>{availableProperties.length}</li>
                </div>
              </DrawerTrigger>
              <DrawerContent
                className={`${sulpherBold.className} bg-black h-[66vh] px-3 text-2xl overflow-y-auto`}
              >
                <DrawerTitle className={`select-none text-black`}>
                  Properties for Sale
                </DrawerTitle>
                <SelectColorProperties
                  properties={availableProperties}
                  onPurchase={onPurchaseProperty}
                  player={player}
                />
              </DrawerContent>
            </Drawer>
            <div className={`flex justify-between`}>
              <li>Free Parking</li>
              <li>${freeParking}</li>
            </div>
          </ul>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;
