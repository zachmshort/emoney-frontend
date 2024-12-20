import { AiOutlineMenu } from "react-icons/ai";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { sulpherBold } from "../fonts";
import { Property } from "@/types/schema";

const Navbar = ({
  freeParking,
  availableProperties,
}: {
  freeParking: number;
  availableProperties?: Property[];
}) => {
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
                  <li></li>
                </div>
              </DrawerTrigger>
              <DrawerContent
                className={`${sulpherBold.className} bg-black h-[66vh] px-3 text-2xl`}
              >
                <DrawerTitle className={`select-none text-black`}>
                  Properties for Sale
                </DrawerTitle>
                <h1 className={`text-start`}>Select a Color</h1>
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
