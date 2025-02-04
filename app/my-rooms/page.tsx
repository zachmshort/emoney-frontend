"use client";
import ButtonLink from "@/components/ui/button-link";
import { josephinBold, josephinLight } from "@/components/ui/fonts";
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

      setTimeout(() => {
        setRooms(storedRooms);
        setLoading(false);
      }, 500);
    }
  }, []);

  if (loading) {
    return (
      <div id="loading" className={`${josephinBold.className}`}>
        <div className="dice">
          <div className="front">1</div>
          <div className="back">6</div>
          <div className="left">2</div>
          <div className="right">5</div>
          <div className="top">3</div>
          <div className="bottom">4</div>
        </div>
        <p
          className={`color !text-xl border-yellow-100 border h-12 w-[200px] justify-center flex items-center rounded-sm`}
        >
          LOADING
        </p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen overflow-y-auto`}>
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
          <div
            className={`${josephinBold.className} flex items-center justify-center gap-y-4 flex-col w-full min-h-screen`}
          >
            <p className={`color`}>No rooms found.</p>
            <ButtonLink href="/join" text="Join a Room" />
            <ButtonLink href="/create" text="Create a Room" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRoomsPage;
