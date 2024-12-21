import { useState } from "react";
import { sulpherBold } from "../fonts";
type TransferType = "SEND" | "REQUEST";

interface SendReqToggleProps {
  onToggle: (type: TransferType) => void;
}

const PayRequestRentToggleSwitch = ({ onToggle }: SendReqToggleProps) => {
  const [isSend, setIsSend] = useState(true);

  const handleToggle = () => {
    const newValue = !isSend;
    setIsSend(newValue);
    onToggle(newValue ? "SEND" : "REQUEST");
  };

  return (
    <button
      className={`relative w-full h-12 rounded-full border border-neutral-400 shadow-md ${sulpherBold.className} mb-4`}
      onClick={handleToggle}
    >
      <div
        className={`absolute w-1/2 h-full bg-white rounded-full shadow-md transition-transform duration-300 ${
          isSend ? "translate-x-0" : "translate-x-full"
        }`}
      />
      <div className="relative flex h-full">
        <span
          className={`flex-1 flex items-center justify-center ${
            isSend ? "text-black" : "text-neutral-400"
          }`}
        >
          Send
        </span>
        <span
          className={`flex-1 flex items-center justify-center ${
            !isSend ? "text-black" : "text-neutral-400"
          }`}
        >
          Request
        </span>
      </div>
    </button>
  );
};
export default PayRequestRentToggleSwitch;
