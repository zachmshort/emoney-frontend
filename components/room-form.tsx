"use client";
import { ColorSelect } from "@/components/color-select-drawer";
import { sulpherBold } from "@/components/fonts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./logo";
import { Player, Room } from "@/types/schema";

interface JoinRoomResponse {
  message: string;
  playerId: string;
  players: Player[];
  room: Room;
}
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
  const [deviceId, setDeviceId] = useState<string>("");
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    const storedDeviceId = localStorage.getItem("deviceId");
    if (storedDeviceId) {
      setDeviceId(storedDeviceId);
    } else {
      const newDeviceId = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;
      localStorage.setItem("deviceId", newDeviceId);
      setDeviceId(newDeviceId);
    }
  }, []);

  const joinRoom = async () => {
    try {
      const payload = {
        roomCode: code,
        name: name,
        deviceId: deviceId,
        color: selectedColor,
      };
      console.log("Sending join payload:", payload);

      const response = await fetch("http://localhost:8080/room/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Log the raw response text first
      const rawText = await response.text();
      console.log("Raw response:", rawText);

      // Then try to parse it
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (parseError) {
        console.error("JSON Parse error:", parseError);
        throw new Error(`Invalid JSON response: ${rawText}`);
      }

      console.log("Parsed response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to join room");
      }

      localStorage.setItem("currentRoom", code);
      localStorage.setItem("playerId", data.playerId);

      router.push(`/monopoly/room/${code}`);
    } catch (error) {
      console.error("Error joining room:", error);
      alert(`Failed to join room: ${error.message}`);
    }
  };
  const createRoom = async () => {
    try {
      const payload = {
        name: name,
        deviceId: deviceId,
        code: code,
      };
      console.log("Sending payload:", payload);

      const response = await fetch("https://emoney.up.railway.app/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to create room");
      }

      router.push(`/monopoly/room/${data.roomCode}`);
    } catch (error) {
      console.error("Error creating room:", error);
      alert(`Failed to create room: ${error.message}`);
    }
  };

  const enterRoom = () => {
    if (type === "CREATE") {
      createRoom();
    } else {
      joinRoom();
    }
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
                placeholder="Enter Code"
                className={`border p-4 bg-inherit rounded-lg text-2xl w-64`}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                }}
              />
              <button
                className={`border font rounded-lg p-4 border-yellow-200 w-64 mt-4 text-black text-2xl`}
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
              {type === "JOIN" && (
                <ColorSelect
                  onColorSelect={(color: string) => setSelectedColor(color)}
                />
              )}
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
