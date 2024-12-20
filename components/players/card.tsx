import { Player } from "@/types/schema";
import { sulpherBold } from "../fonts";
import { useEffect, useState } from "react";
import { PlayerDetails } from "./card-content";
import { ReasonSelect } from "../reason-select";
import ToggleSwitch from "./send-req-toggle";

const PlayerCard = ({
  player,
  isBanker = false,
  onTransfer,
}: {
  player: Player;
  isBanker?: boolean;
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
  const [showTransfer, setShowTransfer] = useState(false);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("SEND");
  const getButtonText = () => {
    switch (type) {
      case "SEND":
        return "Send";
      case "REQUEST":
        return "Request";
      case "ADD":
        return "Add";
      case "SUBTRACT":
        return "Subtract";
      default:
        return "";
    }
  };
  let color = player?.color;
  if (player?.color === undefined) {
    color = "#000";
  }
  const [reason, setReason] = useState("");

  const handleTransfer = () => {
    if (onTransfer && amount && type) {
      const transferDetails = {
        fromPlayerId: type === "SEND" ? player.id : "",
        toPlayerId: type === "SEND" ? "" : player.id,
        reason: reason,
      };

      onTransfer(amount, type, transferDetails);
      setShowTransfer(false);
      setAmount("");
      setReason("");
      setType("");
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const content = document.getElementById("transfer-content");
      if (content && !content.contains(event.target as Node)) {
        setShowTransfer(false);
      }
    };

    if (showTransfer) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTransfer]);
  const openTransfer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTransfer(true);
  };
  return (
    <>
      <div
        className="snap-center w-[360px] border bg-white border-black aspect-[3/4] rounded select-none "
        onClick={() => {
          setShowTransfer(true);
        }}
      >
        <div className={`border p-2 w-full h-full border-black `}>
          <div
            style={{ backgroundColor: color }}
            className={`h-16 w-full flex items-center ${
              isBanker ? "justify-evenly" : "justify-center"
            } ${sulpherBold.className} text-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {isBanker && (
                <button
                  className={`border rounded-md aspect-square  px-4 border-red-300`}
                  onClick={() => {
                    setShowTransfer(true);
                    setType("SUBTRACT");
                  }}
                >
                  -
                </button>
              )}
            </div>
            <div className={`text-black`}>{player?.name}</div>
            {isBanker && (
              <button
                className={`border rounded-md aspect-square  px-4 border-green-300`}
                onClick={() => {
                  setShowTransfer(true);
                  setType("ADD");
                }}
              >
                +
              </button>
            )}
          </div>

          {!showTransfer ? (
            <div onClick={openTransfer}>
              <PlayerDetails player={player} />
            </div>
          ) : (
            <div id="transfer-content">
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
              <ReasonSelect
                onChange={(value) => setReason(value)}
                reason={reason}
              />
              <ToggleSwitch onToggle={(newType) => setType(newType)} />
              <div
                className={`${sulpherBold.className} w-full flex items-center justify-between gap-x-2`}
              >
                <button
                  className={`border p-2 rounded-md border-black w-1/2 text-black`}
                  onClick={() => {
                    setShowTransfer(false);
                    setAmount("");
                    setType("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className={`border p-2 rounded-md border-black text-white bg-black w-1/2`}
                  onClick={handleTransfer}
                >
                  {getButtonText()}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlayerCard;
