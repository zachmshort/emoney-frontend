import { useState } from "react";
import { sulpherBold } from "../fonts";
import { Player } from "@/types/schema";
import { toast } from "sonner";

interface FreeParkingDialogProps {
  onFreeParkingAction: (amount: string, type: string, playerId: string) => void;
  onCancel: () => void;
  player: Player;
  freeParking: number;
}

const FreeParkingDialog = ({
  onFreeParkingAction,
  onCancel,
  player,
  freeParking,
}: FreeParkingDialogProps) => {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"ADD" | "REMOVE">("ADD");

  const handleSubmit = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (type === "REMOVE" && Number(amount) > freeParking) {
      toast.error("Not enough funds in Free Parking");
      return;
    }

    onFreeParkingAction(amount, type, player.id);
    setAmount("");
  };

  return (
    <div className="space-y-4">
      <div className={`${sulpherBold.className} text-xl mb-4`}>
        Free Parking: ${freeParking}
      </div>

      <div className="flex gap-4 mb-4">
        <button
          className={`flex-1 p-2 rounded ${
            type === "ADD" ? "bg-green-600 text-white" : "border"
          }`}
          onClick={() => setType("ADD")}
        >
          Add
        </button>
        <button
          className={`flex-1 p-2 rounded ${
            type === "REMOVE" ? "bg-blue-600 text-white" : "border"
          }`}
          onClick={() => setType("REMOVE")}
        >
          Collect
        </button>
      </div>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="w-full p-3 rounded border bg-inherit text-xl"
      />

      <div className="flex gap-4 mt-4">
        <button className="flex-1 p-2 rounded border" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="flex-1 p-2 rounded bg-black text-white"
          onClick={handleSubmit}
        >
          {type === "ADD" ? "Add to Pot" : "Collect"}
        </button>
      </div>
    </div>
  );
};

export default FreeParkingDialog;
