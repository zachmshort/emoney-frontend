import { useState } from "react";
import { sulpherBold } from "../fonts";
import { getButtonText } from "../helper-funcs";
// import { ReasonSelect } from "../reason-select";
// import SendReqToggle from "./send-req-toggle";
import { Player } from "@/types/schema";

const CustomTransfer = ({
  player,
  onTransfer,
}: {
  player: Player;
  onTransfer?: (
    amount: string,
    type: string,
    transferDetails: {
      fromPlayerId: string;
      toPlayerId: string;
      reason: string;
    }
  ) => void;
}) => {
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const handleTransfer = () => {
    if (onTransfer && amount && type) {
      const transferDetails = {
        fromPlayerId: type === "SEND" ? player.id : "",
        toPlayerId: type === "SEND" ? "" : player.id,
        reason: reason,
      };

      onTransfer(amount, type, transferDetails);
      setAmount("");
      setReason("");
      setType("");
    }
  };
  return (
    <>
      <input
        placeholder="Amount"
        className={`border p-4 bg-inherit rounded-lg text-2xl w-full border-neutral-400 ${sulpherBold.className} shadow-md text-black my-4`}
        value={amount}
        type="numeric"
        min={1}
        onChange={(e) => {
          setAmount(e.target.value);
        }}
        required
      />
      <div
        className={`${sulpherBold.className} w-full flex items-center justify-between gap-x-2`}
      >
        {/* <button
          className={`border p-2 rounded-md border-black w-1/2 text-black`}
          onClick={() => {
            setAmount("");
            setType("");
          }}
        >
          Cancel
        </button> */}
        <button
          className={`border p-2 rounded-md border-black text-white bg-black w-full`}
          onClick={handleTransfer}
        >
          {getButtonText(type)}
        </button>
      </div>
    </>
  );
};

export default CustomTransfer;
