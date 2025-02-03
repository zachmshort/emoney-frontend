"use client";
import ButtonLink from "@/components/ui/button-link";
import { josephinBold, josephinLight } from "@/components/ui/fonts";
import Loader from "@/components/ui/loader";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

const MyRoomsPage = () => {
  const [rooms, setRooms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedRooms = Object.keys(localStorage)
        .filter((key) => key.startsWith("room_"))
        .map((key) => key.replace("room_", ""))
        .map((key) => key.replace("_playerId", ""));

      setRooms(storedRooms);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className={`h-16 fixed top-0 w-full bg-black border-b`}>
        <div className={`flex items-center justify-between px-2 h-full`}>
          <Link href={`/`}>
            <IoIosArrowBack className={`text-2xl color`} />
          </Link>
          <h1 className={`${josephinBold.className} text-2xl color`}>
            Existing Rooms
          </h1>
          <div />
        </div>
      </div>
      <div className="flex items-center justify-start mt-20 gap-y-4 flex-col w-full min-h-screen">
        {rooms.length > 0 ? (
          rooms.map((room, index) => (
            <Link
              key={index}
              href={`/room/${room}`}
              className={`font ${josephinLight.className} text-2xl`}
            >
              {room}
            </Link>
          ))
        ) : (
          <div className={`flex items-center justify-center gap-y-4`}>
            <p>No rooms found.</p>
            <ButtonLink href="/join" text="Join a Room" />
            <ButtonLink href="/create" text="Create a Room" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRoomsPage;
