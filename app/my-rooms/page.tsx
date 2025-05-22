"use client";

import {
  josephinBold,
  josephinLight,
  josephinNormal,
} from "@/components/ui/fonts";
import NextLink from "next/link";
import Link from "@/components/ui/link";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import DiceLoader from "@/components/loaders/dice";

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
    return <DiceLoader />;
  }

  const existingRooms = rooms && rooms.length > 0;

  return (
    <div className={`min-h-screen`}>
      <Header />
      <div className="pt-20 flex flex-col items-start px-10 gap-y-6">
        {existingRooms ? (
          <ExistingRooms rooms={rooms} />
        ) : (
          <NoExistingRoomsFound />
        )}
      </div>
    </div>
  );
};

const NoExistingRoomsFound = () => {
  return (
    <div
      className={`${josephinBold.className} flex items-center justify-center gap-y-4 flex-col w-full h-[50vh]`}
    >
      <p className={`color`}>No rooms found</p>
      <Link href="/join">Join Room</Link>
      <Link href="/create">Create Room</Link>
    </div>
  );
};

const ExistingRooms = ({ rooms }: { rooms: string[] }) => {
  return (
    <>
      {rooms.map((room: string, index: number) => (
        <NextLink
          key={index}
          href={`/room/${room}`}
          className={`font ${josephinLight.className} text-2xl`}
        >
          {room}
        </NextLink>
      ))}
    </>
  );
};

const Header = () => {
  return (
    <div className={`h-16 absolute`}>
      <div className={`flex items-center justify-start px-2 h-full`}>
        <BackButton />
        <Heading />
        <div />
      </div>
    </div>
  );
};

const BackButton = () => {
  return (
    <NextLink href={`/`} className={`absolute left-2 top-4`}>
      <IoIosArrowBack className={`text-2xl color`} />
    </NextLink>
  );
};

const Heading = () => {
  return (
    <h1 className={`${josephinNormal.className} px-8 text-2xl color`}>
      Existing Rooms
    </h1>
  );
};

export default MyRoomsPage;
