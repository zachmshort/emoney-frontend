"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { josephinBold } from "@/components/ui/fonts";
import { ColorSelect } from "../players/color-select-drawer";
import CustomLink from "../ui/cusotm-link";
import { Slider } from "../ui/slider";
import { playerStore } from "@/lib/utils/playerHelpers";
import { usePublicAction } from "@/hooks/use-public-fetch";
import { playerApi, roomApi } from "@/utils/api.service";
import { CreateRoomFormData, InitialCreateRoomFormData } from "./utils";
import Button from "../ui/button-custom";
import { BaseRoomInput } from "./room-code-input";

const STEP = {
  ROOM_DETAILS: 0,
  PLAYER_DETAILS: 1,
  GAME_RULES: 2,
};

const CreateRoomForm = () => {
  const [formData, setFormData] = useState<CreateRoomFormData>(
    InitialCreateRoomFormData,
  );
  const [step, setStep] = useState<number>(STEP.ROOM_DETAILS);
  const router = useRouter();

  const updateFormData = <F extends keyof CreateRoomFormData>(
    field: F,
    value: CreateRoomFormData[F],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const { execute: createRoomExecute, loading: creating } = usePublicAction(
    roomApi.create,
    {
      onSuccess(data) {
        playerStore.setPlayerIdForRoom(data.roomCode, data.playerId);
        router.push(`/rooms/${data.roomCode}`);
      },
      onError(error) {
        toast.error("Failed to create room", {
          description: error?.message || "Please try again.",
          className: josephinBold.className,
        });
      },
    },
  );

  const { execute: checkPlayerExecute, loading: checkingPlayer } =
    usePublicAction(playerApi.getDetails, {
      onSuccess(data) {
        if (data.isValid) {
          router.push(`/rooms/${formData.roomCode}`);
        } else {
          setStep(STEP.PLAYER_DETAILS);
        }
      },
      onError(error) {
        setStep(STEP.PLAYER_DETAILS);
        toast.error(error.error, {
          className: josephinBold.className,
        });
      },
    });

  const checkPlayerAlreadyInRoom = async () => {
    const existingPlayerId = playerStore.getPlayerIdForRoom(formData.roomCode);
    if (existingPlayerId) {
      checkPlayerExecute(formData.roomCode, existingPlayerId);
    } else {
      setStep(STEP.PLAYER_DETAILS);
    }
  };

  const handleCreateRoom = () => {
    if (!formData.roomName || !formData.roomCode || !formData.playerName) {
      toast.error("Please fill out all fields", {
        className: josephinBold.className,
      });
      return;
    }
    createRoomExecute(formData);
  };

  const RoomDetailsStep = () => (
    <>
      <BaseRoomInput
        placeholder="New Room Name"
        value={formData.roomName}
        onChange={(e) => updateFormData("roomName", e.target.value)}
      />
      <BaseRoomInput
        placeholder="New Room Code"
        value={formData.roomCode}
        onChange={(e) => updateFormData("roomCode", e.target.value)}
      />
      <Button
        className="mt-4"
        onClick={() => {
          if (!formData.roomCode || !formData.roomName) {
            toast.error("Please fill out the fields", {
              className: josephinBold.className,
            });
          } else {
            checkPlayerAlreadyInRoom();
          }
        }}
        disabled={checkingPlayer}
      >
        Next
      </Button>
    </>
  );

  const PlayerDetailsStep = () => (
    <>
      <BaseRoomInput
        placeholder="Your Name"
        value={formData.playerName}
        onChange={(e) => updateFormData("playerName", e.target.value)}
      />
      <ColorSelect
        onColorSelect={(color) => updateFormData("playerColor", color)}
      />
      <Button onClick={() => setStep(STEP.GAME_RULES)} className="mt-4">
        Game Rules
      </Button>
      <Button onClick={handleCreateRoom} className="mt-4" disabled={creating}>
        Create Room
      </Button>
    </>
  );

  const GameRulesStep = () => (
    <>
      <BaseRoomInput
        placeholder="Starting Cash"
        value={formData.startingCash}
        onChange={(e) =>
          updateFormData("startingCash", parseInt(e.target.value))
        }
      />
      <Button
        onClick={() => updateFormData("startingCash", 1500)}
        className="mt-4"
      >
        Use Default
      </Button>
      <hr className="border-t my-4 border-white w-64" />
      <p>
        Houses Available: {formData.houses < 88 ? formData.houses : "No Limit"}
      </p>
      <Slider
        className="w-64 bg-white rounded-sm"
        min={0}
        max={88}
        value={[formData.houses]}
        onValueChange={(e: number[]) => updateFormData("houses", e[0])}
      />
      <hr className="border-t my-4 border-white w-64" />
      <p>
        Hotels Available: {formData.hotels < 22 ? formData.hotels : "No Limit"}
      </p>
      <Slider
        className="w-64 bg-white rounded-sm"
        min={0}
        max={22}
        value={[formData.hotels]}
        onValueChange={(e: number[]) => updateFormData("hotels", e[0])}
      />
    </>
  );

  return (
    <div className="relative h-screen">
      <CustomLink text="E-Money" href="/" className="top-2 left-2" />
      <div
        className={`flex flex-col items-center justify-center h-full ${josephinBold.className}`}
      >
        {step === STEP.ROOM_DETAILS && RoomDetailsStep()}
        {step === STEP.PLAYER_DETAILS && PlayerDetailsStep()}
        {step === STEP.GAME_RULES && GameRulesStep()}
      </div>
    </div>
  );
};

export default CreateRoomForm;
