import { Player } from "@/types/schema";
import { josephinBold } from "../fonts";

const PlayerDetails = ({ player }: { player: Player }) => {
  return (
    <>
      <div
        className={`text-black flex flex-col items-evenly gap-y-2 justify-between ${josephinBold.className} text-2xl`}
      >
        <div className={`flex items-center justify-center mt-4`}>
          <div>${player?.balance || 0}</div>
        </div>
        <div className={`flex items-center justify-between`}>
          <div>Properties</div>
          <div>{player?.properties?.length || 0}</div>
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
