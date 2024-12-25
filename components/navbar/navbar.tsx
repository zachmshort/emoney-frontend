"use client";
import { EventHistory, Player, Property } from "@/types/schema";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { AiOutlineMenu } from "react-icons/ai";
import { josephinBold, josephinNormal } from "../ui/fonts";
import SelectColorProperties from "../players/purchase-properties-bank";
import { useState } from "react";
import Link from "next/link";
import FreeParkingDialog from "./free-parking";
import { playerStore } from "@/lib/utils/playerHelpers";
import { IoCopyOutline } from "react-icons/io5";
import { toast } from "sonner";
import { formatTimeAgo } from "../ui/helper-funcs";

const Navbar = ({
  freeParking,
  player,
  eventHistory,
  availableProperties,
  onFreeParkingAction,
  roomId,
  roomCode,
  onPurchaseProperty,
}: {
  freeParking: number;
  roomCode: string;
  eventHistory: EventHistory[];
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
  const [showEvents, setShowEvents] = useState(false);

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
                    className={`border w-full text-center text-sm py-2 rounded shadow-xl`}
                  >
                    Return to Main Menu
                  </li>
                </div>
                <div
                  className={`${josephinBold.className} bg-black h-full  text-2xl overflow-y-auto`}
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
            ) : showEvents ? (
              <>
                <div
                  className={`flex justify-between`}
                  onClick={() => {
                    setShowProperties(false);
                    setShowFreeParking(false);
                    setShowEvents(false);
                  }}
                >
                  <li
                    className={`border w-full text-center py-2 rounded shadow-xl text-sm`}
                  >
                    Return to Main Menu
                  </li>
                </div>
                <h2 className={`pt-5 pb-2 ${josephinBold.className}`}>
                  Event History
                </h2>
                <div
                  className={`event-history-container overflow-y-auto pb-20 pt-2`}
                >
                  {eventHistory.map((event: EventHistory, index: number) => (
                    <div className={`${josephinNormal.className}`} key={index}>
                      <div className="flex justify-between rounded-full items-center mb-2 py-1 sm:py-2">
                        <span className={`text-xs sm:text-sm`}>
                          <div className={`flex justify-start items-start`}>
                            <div className={`pr-[4px]`}>
                              {event?.eventType?.[1] || "🧍"}
                            </div>
                            <p
                              style={{
                                color: event?.eventType?.[0] || "white",
                              }}
                            >
                              {event.event}
                            </p>
                          </div>
                        </span>
                        <span
                          className={` text-gray-500 text-[.5rem] sm:text-xs text-end `}
                        >
                          {formatTimeAgo(new Date(event.timestamp))}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div
                  className={`flex justify-between mt-2`}
                  onClick={() => setShowProperties(true)}
                >
                  <li>Bank&apos;s Properties</li>
                  <li>{availableProperties?.length || 0}</li>
                </div>
                <div
                  className={`flex justify-between mt-4`}
                  onClick={() => setShowFreeParking(true)}
                >
                  <li>Free Parking</li>
                  <li>${freeParking}</li>
                </div>
                <div
                  className={`flex justify-between mt-4`}
                  onClick={() => setShowEvents(true)}
                >
                  <li>Event History</li>
                  <li>{eventHistory.length}</li>
                </div>
                <div
                  className={`flex justify-between mt-4 cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => {
                    navigator.clipboard
                      .writeText(roomCode)
                      .then(() => {
                        toast.success("Room code copied to clipboard!", {
                          duration: 2000,
                          icon: "📋",
                          className: `${josephinBold.className}`,
                        });
                      })
                      .catch(() => {
                        toast.error("Failed to copy room code");
                      });
                  }}
                >
                  <li>Room Code</li>
                  <li className={`flex items-center`}>
                    <IoCopyOutline className={`mr-1`} />
                    {roomCode}
                  </li>
                </div>
                <div className={`absolute bottom-5 w-full`}>
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
                      </Link>{" "}
                      <Link
                        href={`/`}
                        className={`  p-2 border rounded-sm w-full text-lg border-red-300`}
                        onClick={() => {
                          playerStore.clearPlayerDataForRoom(roomId);
                        }}
                      >
                        Delete My Player this Game
                      </Link>
                      <Link
                        href={`/`}
                        className={`w-full text-lg border rounded-sm p-2 border-red-300`}
                        onClick={() => playerStore.clearAllPlayerData()}
                      >
                        Delete My Players in All Games
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
