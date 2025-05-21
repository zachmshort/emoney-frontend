"use client";

import { josephinBold, josephinLight } from "@/components/ui/fonts";
import NextLink from "next/link";
import Link from "@/components/ui/link";
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
      <div id="loading" className={`${josephinBold.className} w-full min-h-screen flex flex-col items-center justify-center`}>
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

  const existingRooms = rooms.length > 0

  return (
    <div className={`min-h-screen overflow-y-auto`}>
      <Header />
      
      <div className="flex items-center justify-start mt-20 gap-y-4 flex-col w-full min-h-screen">
        {existingRooms ? <ExistingRooms rooms={rooms} />
         : (
          
          <NoExistingRoomsFound />
        )}
      </div>
    </div>
  );
};

const NoExistingRoomsFound = ()=> {
  return (
<div
            className={`${josephinBold.className} flex items-center justify-center gap-y-4 flex-col w-full h-[50vh]`}
          >
            <p className={`color`}>No rooms found</p>
            <Link href="/join" >Join Room</Link>
            <Link href="/create" >Create Room</Link>
          </div>
  )
}

const ExistingRooms = (rooms)=> {
  return (

  <>
           {rooms.map((room, index) => (
            <NextLink
              key={index}
              href={`/room/${room}`}
              className={`font ${josephinLight.className} text-2xl`}
            >
              {room}
            </NextLink>

          ))}

  </>

  )
}

const Header = () => {
return (
<div className={`h-16 fixed top-0 w-full bg-black border-b`}>
        <div className={`flex items-center justify-center px-2 h-full`}>
          <NextLink href={`/`} className={`absolute left-2 top-4`}>
            <IoIosArrowBack className={`text-2xl color`} />
          </NextLink>
          <h1 className={`${josephinBold.className} text-2xl color`}>
            Existing Rooms
          </h1>
          <div />
        </div>
      </div>
)
}

export default MyRoomsPage;
