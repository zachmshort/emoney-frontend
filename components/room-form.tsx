"use client";
import { ColorSelect } from "@/components/color-select-drawer";
import { sulpherBold, sulpherLight } from "@/components/fonts";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "./logo";

interface p {
  type?: string;
  buttonText1?: string;
  buttonText2?: string;
}
const RoomForm = ({
  type = "JOIN",
  buttonText1 = "Join",
  buttonText2 = "Enter Room",
}: p) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();
  const enterRoom = () => {
    router.push(`/monopoly/room/${code}`);
  };
  return (
    <>
      <div className={`relative h-screen`}>
        <Logo />
        <div
          className={`flex flex-col items-center text-start justify-center h-full ${sulpherBold.className}`}
        >
          {!showDetails ? (
            <>
              <input
                placeholder="Code"
                className={`border p-4 bg-inherit rounded-lg text-2xl w-64`}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                }}
              />
              <button
                className={`border rounded-lg p-4 bg-white w-64 mt-4 text-black text-2xl`}
                onClick={() => {
                  setShowDetails(true);
                }}
              >
                {buttonText1}
              </button>
            </>
          ) : (
            <>
              <input
                placeholder="Name"
                className={`border p-4 bg-inherit rounded-lg text-2xl w-64 ring-none`}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <ColorSelect />
              <button
                onClick={enterRoom}
                className={`mt-4 text-2xl w-64 p-4 border rounded-lg`}
              >
                {buttonText2}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RoomForm;
