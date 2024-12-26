import { useState } from "react";
import { josephinBold, josephinNormal } from "../ui/fonts";
import { Player } from "@/types/schema";
import { toast } from "sonner";
import { DrawerClose } from "../ui/drawer";
import Toast from "../ui/toasts";
import { Gi3dGlasses } from "react-icons/gi";
import { PiMoneyWavyThin, PiXThin } from "react-icons/pi";

interface FreeParkingDialogProps {
  onFreeParkingAction: (amount: string, type: string, playerId: string) => void;
  player: Player;
  freeParking: number;
  onClick: () => void;
}

const FreeParkingDialog = ({
  onFreeParkingAction,
  player,
  freeParking,
  onClick,
}: FreeParkingDialogProps) => {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"ADD" | "REMOVE">("ADD");

  const handleSubmit = () => {
    onFreeParkingAction(amount, type, player.id);
    setAmount("");
  };

  return (
    <div className="">
      <div className={`${josephinNormal.className} text-xl mb-4`}>
        Free Parking: ${freeParking}
      </div>

      <button
        className={`relative w-full h-12 rounded-full border border-neutral-400 shadow-md ${josephinBold.className} mb-4`}
        onClick={() => setType(type === "ADD" ? "REMOVE" : "ADD")}
      >
        <div
          className={`absolute w-1/2 h-full bg-white rounded-full shadow-md transition-transform duration-300 ${
            type === "ADD" ? "translate-x-0" : "translate-x-full"
          }`}
        />
        <div className="relative flex h-full">
          <span
            className={`flex-1 flex items-center justify-center ${
              type === "ADD" ? "text-black" : "text-neutral-400"
            }`}
          >
            Add
          </span>
          <span
            className={`flex-1 flex items-center justify-center ${
              type === "REMOVE" ? "text-black" : "text-neutral-400"
            }`}
          >
            Collect
          </span>
        </div>
      </button>

      <input
        type="numeric"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="w-full p-4 rounded border bg-inherit text-xl"
      />

      <div className={`flex gap-4 mt-4 items-center ${josephinBold.className}`}>
        <div className="flex-1 py-3 rounded text-center" onClick={onClick}>
          Cancel
        </div>
        <DrawerClose
          className={`flex-1 py-3 text-center bg-white rounded-md ${
            type === "ADD" ? "text-green-600" : "text-blue-600"
          }`}
          onClick={() => {
            if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
              Toast({
                message: "Please enter a valid amount",
                icon: <PiXThin className="text-red-700 text-xl" />,
              });
              return;
            } else if (type === "REMOVE" && Number(amount) > freeParking) {
              Toast({
                icon: <PiMoneyWavyThin className="text-red-700 text-xl" />,
                message: "Not enough money in free parking",
              });
              return;
            } else if (type === "ADD" && Number(amount) > player.balance) {
              Toast({
                icon: <PiMoneyWavyThin className="text-red-700 text-xl" />,
                message: "Insufficient funds",
                details: `You need $${Number(amount) - player.balance}`,
              });
              return;
            } else {
              handleSubmit();
            }
          }}
        >
          {type === "ADD" ? "Add to Pot" : "Collect"}
        </DrawerClose>
      </div>
    </div>
  );
};

export default FreeParkingDialog;
