import { Player } from "@/types/schema";
import { sulpherLight } from "../fonts";

const PlayerDetails = ({ player }: { player: Player }) => {
  return (
    <>
      <div
        className={`text-black flex flex-col items-evenly gap-y-2 justify-between ${sulpherLight.className}`}
      >
        <div className={`flex items-center justify-between mt-4`}>
          <div>Total Cash</div>
          <div>${player?.balance}</div>
        </div>
        <div className={`flex items-center justify-between`}>
          <div>Properties</div>
          <div>0</div>
        </div>
        <div className={`flex items-center justify-between`}>
          <div>Monopolies</div>
          <div>0</div>
        </div>
      </div>
    </>
  );
};

export { PlayerDetails };
