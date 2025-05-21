
"use client";

import { ColorSelect } from "../players/color-select-drawer";
import { josephinBold } from "@/components/ui/fonts";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { playerStore } from "@/lib/utils/playerHelpers";
import CustomLink from "../ui/cusotm-link";
import ButtonAction from "../ui/button-action";
import { Slider } from "../ui/slider";
import { usePublicAction } from "@/hooks/use-public-fetch";
import { roomApi } from "@/utils/api.service";

interface p {
  type?: string;
  buttonText1?: string;
  buttonText2?: string;
  placeholder?: string;
}

type RoomFormData = {
  name:string
  startingCash:string
  code:string
  playerName:string
  playerColor:string
  houses:string, 
  hotels:string, 
}

const initialFormData:RoomFormData = {
  name: "",
  code: "",
  playerName: "",
  playerColor: "",
  startingCash: "",
  houses: "",
  hotels: "",
};

// updateFormData: <K extends keyof ListingFormData>(
//     field: K,
//     value: ListingFormData[K]
//   ) => void;
//   formData: ListingFormData;
//

const RoomForm = ({
  type = "JOIN",
  buttonText1 = "Next",
  buttonText2 = "Join",
  placeholder = "Enter Room Code",
}: p) => {

  const [formData, setFormData] = useState<RoomFormData>(initialFormData);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [startingCash, setStartingCash] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [roomName, setRoomName] = useState("");
  const [showGameRules, setShowGameRules] = useState(false);
  const [houses, setHouses] = useState(32);
  const [hotels, setHotels] = useState(12);

  const {execute, error,loading, data} = usePublicAction(roomApi.create, {
    onSuccess(data) {
        
    },
    onError(error) {
        
    },
  })
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
      toast.error("Unable to verify player. Please try again.", {
        className: `${josephinBold.className}`,
      });
      setShowDetails(true);
    }
  };

  const joinRoom = async () => {
    if (!selectedColor) {
      toast.error("Please select a color", {
        className: `${josephinBold.className}`,
      });
    } else if (!name) {
      toast.error("Please enter a name", {
        className: `${josephinBold.className}`,
      });
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
      toast.error(
        `There was an error in attempting to join the room, please ensure it exists and try again.`,
        { className: `${josephinBold.className}` }
      );
    }
  };

  const createRoom = async () => {
    try {
      const payload = {
        name: name,
        roomName: roomName,
        code: code,
        color: selectedColor,
      };
      console.log(payload);
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
      toast.error(`Failed to create room, please refresh and try again.`, {
        className: `${josephinBold.className}`,
      });
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
          <>
            {!showGameRules ? (
              <>
                {!showDetails ? (
                  <>
                    {type === "CREATE" && (
                      <input
                        placeholder={`New Room Name`}
                        className={`${josephinBold.className} border p-4 bg-inherit rounded text-2xl w-64`}
                        value={roomName}
                        onChange={(e) => {
                          setRoomName(e.target.value);
                        }}
                      />
                    )}
                    <input
                      placeholder={placeholder}
                      className={`${josephinBold.className} border p-4 bg-inherit rounded text-2xl w-64 mt-4`}
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                      }}
                    />
                    <ButtonAction
                      onClick={() => {
                        if (!code || (!roomName && type === "CREATE")) {
                          toast.error("Please fill out the fields", {
                            className: `${josephinBold.className}`,
                          });
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
                      className={` border p-4 bg-inherit rounded-sm text-2xl w-64 ring-none`}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                    <ColorSelect
                      onColorSelect={(color: string) => setSelectedColor(color)}
                    />
                    <ButtonAction
                      onClick={() => {
                        setShowGameRules(true);
                      }}
                      text="Game Rules"
                      className={`mt-4`}
                    />
                    <ButtonAction
                      onClick={enterRoom}
                      text={buttonText2}
                      className={`mt-4`}
                    />
                  </>
                )}
              </>
            ) : (
              <>
                <input
                  placeholder="Starting Cash"
                  className={`w-64 border p-4 bg-inherit rounded-sm text-2xl ring-none`}
                  value={startingCash}
                  onChange={(e) => {
                    setStartingCash(e.target.value);
                  }}
                />
                <ButtonAction
                  text="Use Default"
                  onClick={() => {
                    setStartingCash("1500");
                  }}
                  className={`mt-4`}
                />
                <hr className={`border-t my-4 border-white w-64`} />
                <p>Houses Available: {houses < 88 ? houses : "No Limit"}</p>
                <Slider
                  className={`w-64 bg-white rounded-sm`}
                  min={0}
                  max={88}
                  value={[houses]}
                  onValueChange={(e: number[]) => {
                    setHouses(e[0]);
                  }}
                />
                <hr className={`border-t my-4 border-white w-64`} />
                <p>Hotels Available: {hotels < 22 ? hotels : "No Limit"}</p>
                <Slider
                  className={`w-64 bg-white rounded-sm`}
                  min={0}
                  max={22}
                  value={[hotels]}
                  onValueChange={(e: number[]) => {
                    setHotels(e[0]);
                  }}
                />
              </>
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default RoomForm;
