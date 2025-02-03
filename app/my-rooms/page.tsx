"use client";
import Toast from "@/components/ui/toasts";
import { playerStore } from "@/lib/utils/playerHelpers";
import Link from "next/link";
import { useEffect, useState } from "react";

const MyRoomsPage = async () => {
  const [rooms, setRooms] = useState<string[]>([]);
  const getRooms = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("room_")) {
          const val = playerStore.trimRoom(key);
          rooms.push(val);
        } else {
          Toast({ type: "error", message: "No Rooms found on this device" });
        }
        return rooms;
      });
    }
  };

  useEffect(() => {
    const fetchedRooms = getRooms();
    console.log(fetchedRooms);
  }, []);

  return (
    <>
      {/* {fetchedRooms.map((room: any, index: number) => ( */}
      {/* <> */}
      {/* <Link href={room}></Link> */}
      {/* </> */}
      {/* ))} */}
    </>
  );
};

export default MyRoomsPage;
