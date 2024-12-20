import { Player } from "@/types/schema";
import { sulpherBold } from "../fonts";
import { PlayerDetails } from "./card-content";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import SelectColorProperties from "../navbar/select-color-properties";

const PlayerCard = ({
  player,
  isBanker = false,
}: {
  player: Player;
  isBanker?: boolean;
}) => {
  let color = player?.color;
  if (player?.color === undefined) {
    color = "#fff";
  }

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <div className="snap-center w-[360px] border bg-white border-black aspect-[3/4] rounded select-none ">
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

              <PlayerDetails player={player} />
            </div>
          </div>
        </DrawerTrigger>
        <DrawerContent className={`h-[70vh] bg-black`}>
          <SelectColorProperties properties={player?.properties} />
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PlayerCard;
