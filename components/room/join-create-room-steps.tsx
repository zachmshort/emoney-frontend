"use client";
import { ColorSelect } from "../players/color-select-drawer";
import { josephinBold } from "@/components/ui/fonts";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { playerStore } from "@/lib/utils/playerHelpers";
import CustomLink from "../ui/cusotm-link";
import ButtonAction from "../ui/button-action";

interface p {
  type?: string;
  buttonText1?: string;
  buttonText2?: string;
  placeholder?: string;
}

const RoomForm = ({
  type = "JOIN",
  buttonText1 = "Next",
  buttonText2 = "Join",
  placeholder = "Enter Room Code",
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
          className={`flex flex-col items-center text-start justify-center h-full ${josephinBold.className}`}
        >
          {!showDetails ? (
            <>
              <input
                placeholder={placeholder}
                className={`${josephinBold.className} border p-4 bg-inherit rounded-lg text-2xl w-64`}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                }}
              />
              <ButtonAction
                onClick={() => {
                  if (!code) {
                    toast.error("Please enter a code");
                  } else {
                    checkExistingPlayer();
                  }
                }}
                text={buttonText1}
                className={`mt-4`}
              />
            </>
          ) : (
            <>
              <input
                placeholder="Your Name"
                className={` border p-4 bg-inherit rounded-lg text-2xl w-64 ring-none`}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <ColorSelect
                onColorSelect={(color: string) => setSelectedColor(color)}
              />
              <ButtonAction
                onClick={enterRoom}
                text={buttonText2}
                className={`mt-4`}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RoomForm;
