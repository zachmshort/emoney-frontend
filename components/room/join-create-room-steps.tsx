"use client";
import { ColorSelect } from "../players/color-select-drawer";
import { sulpherBold } from "@/components/ui/fonts";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "../ui/cusotm-link";
import { toast } from "sonner";
import { playerStore } from "@/lib/utils/playerHelpers";
import CustomLink from "../ui/cusotm-link";

interface p {
  type?: string;
  buttonText1?: string;
  buttonText2?: string;
}

const RoomForm = ({
  type = "JOIN",
  buttonText1 = "Next",
  buttonText2 = "Join",
}: p) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState<string>("");

  const checkExistingPlayer = async () => {
    try {
      const existingPlayerId = playerStore.getPlayerIdForRoom(code);

      if (existingPlayerId) {
        const response = await fetch(
          `https://emoney.up.railway.app/player/room/${code}?playerId=${existingPlayerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (data.existingPlayer && data.existingPlayer.isValid) {
          router.push(`/room/${code}`);
          return;
        }
      }

      setShowDetails(true);
    } catch (error) {
      console.error("Error checking existing player:", error);
      toast.error("Unable to verify player. Please try again.");
      setShowDetails(true);
    }
  };

  const joinRoom = async () => {
    if (!selectedColor) {
      toast.error("Please select a color");
    } else if (!name) {
      toast.error("Please enter a name");
    }
    try {
      const payload = {
        roomCode: code,
        name: name,
        color: selectedColor,
      };

      const response = await fetch("https://emoney.up.railway.app/room/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        playerStore.setPlayerIdForRoom(code, data.playerId);

        router.push(`/room/${code}`);
      } else {
        throw new Error(data.error || "Failed to join room");
      }
    } catch (error) {
      console.error("Error joining room:", error);
      toast.error(`${error.message}`);
    }
  };

  const createRoom = async () => {
    try {
      const payload = {
        name: name,
        code: code,
        color: selectedColor,
      };

      const response = await fetch("https://emoney.up.railway.app/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        playerStore.setPlayerIdForRoom(data.roomCode, data.playerId);

        router.push(`/room/${data.roomCode}`);
      } else {
        throw new Error(data.error || "Failed to create room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error(`Failed to create room: ${error.message}`);
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
        <CustomLink text="E-Money" href="/" className="top-2 left-2" />
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
                  if (!code) {
                    toast.error("Please enter a code");
                  } else {
                    checkExistingPlayer();
                  }
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
              <ColorSelect
                onColorSelect={(color: string) => setSelectedColor(color)}
              />
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
