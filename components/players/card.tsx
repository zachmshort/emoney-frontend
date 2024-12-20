import { Player } from "@/types/schema";
import { sulpherBold } from "../fonts";
import { PlayerDetails } from "./card-content";

const PlayerCard = ({
  player,
  currentPlayer,
  isBanker = false,
  onTransfer,
  roomId,
}: {
  player: Player;
  currentPlayer: Player;
  isBanker?: boolean;
  onTransfer: (
    amount: string,
    type: string,
    transferDetails: {
      fromPlayerId: string;
      roomId: string;
      toPlayerId: string;
      reason: string;
    }
  ) => void;
  roomId: string;
}) => {
  let color = player?.color;
  if (player?.color === undefined) {
    color = "#fff";
  }

  return (
    <>
      <div className="snap-center w-[360px] border bg-white border-black aspect-[3/4] rounded select-none relative ">
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
                >
                  -
                </button>
              )}
            </div>
            <div className={`text-black`}>{player?.name}</div>
            {isBanker && (
              <button
                className={`border rounded-md aspect-square  px-4 border-green-300`}
              >
                +
              </button>
            )}
          </div>

          <PlayerDetails
            player={player}
            currentPlayer={currentPlayer}
            onTransfer={onTransfer}
            roomId={roomId}
          />
        </div>
      </div>
    </>
  );
};

export default PlayerCard;
