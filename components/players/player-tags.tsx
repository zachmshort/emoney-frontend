import { Player } from "@/types/schema";
import { josephinBold, josephinNormal } from "../ui/fonts";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
interface PlayerTag {
  title: string;
  icon: string;
  color: string;
  description: string;
  howToEarn: string;
  condition: (player: Player, allPlayers: Player[]) => boolean;
}

const playerTags: PlayerTag[] = [
  {
    title: "Cash King",
    icon: "👑",
    color: "bg-yellow-400",
    description:
      "A master of wealth accumulation who maintains the highest balance among all players.",
    howToEarn:
      "Have more money than any other player. This title is exclusive - if multiple players tie for highest balance, no one gets the tag.",
    condition: (player, otherPlayers) => {
      const allBalances = otherPlayers
        .map((p) => p?.balance || 0)
        .concat(player?.balance || 0);

      const maxBalance = Math.max(...allBalances);
      const playersWithMaxBalance = allBalances.filter(
        (b) => b === maxBalance
      ).length;

      return player?.balance === maxBalance && playersWithMaxBalance === 1;
    },
  },
  {
    title: "Budget Master",
    icon: "💸",
    color: "bg-green-600",
    description:
      "A savvy investor who manages to acquire the most properties while maintaining a modest balance.",
    howToEarn:
      "Own more properties than any other player while having less than the average player balance.",
    condition: (player, otherPlayers) => {
      const getPropertyCount = (p: Player) =>
        Array.isArray(p?.properties) ? p.properties.length : 0;

      const playerPropertyCount = getPropertyCount(player);
      const otherPlayersCounts = otherPlayers.map(getPropertyCount);
      const maxProperties = Math.max(
        playerPropertyCount,
        ...otherPlayersCounts
      );

      const totalBalance =
        otherPlayers.reduce((sum, p) => sum + (p?.balance || 0), 0) +
        (player?.balance || 0);
      const avgBalance = totalBalance / (otherPlayers.length + 1);

      return (
        playerPropertyCount > 0 &&
        playerPropertyCount === maxProperties &&
        (player?.balance || 0) < avgBalance
      );
    },
  },
  {
    title: "Hotel Empire",
    icon: "🏨",
    color: "bg-purple-500",
    description: "A real estate magnate who dominates the hotel industry",
    howToEarn: "Have more hotels built than any other player",
    condition: (player, otherPlayers) => {
      const getHotelCount = (p: Player) =>
        p?.properties?.reduce((sum, prop) => sum + (prop?.hotel || 0), 0) || 0;

      const playerHotels = getHotelCount(player);
      const otherHotels = otherPlayers.map(getHotelCount);
      const maxHotels = Math.max(playerHotels, ...otherHotels);

      return playerHotels > 0 && playerHotels === maxHotels;
    },
  },
  {
    title: "Urban Developer",
    icon: "🏘️",
    color: "bg-green-500",
    description: "Master of housing development who leads construction efforts",
    howToEarn:
      "Have 3 or more houses built and more houses than any other player",
    condition: (player, otherPlayers) => {
      const getHouseCount = (p: Player) =>
        p?.properties?.reduce((sum, prop) => sum + (prop?.houses || 0), 0) || 0;

      const playerHouses = getHouseCount(player);
      const otherHouses = otherPlayers.map(getHouseCount);
      const maxHouses = Math.max(playerHouses, ...otherHouses);

      return playerHouses >= 3 && playerHouses === maxHouses;
    },
  },
  {
    title: "Color Master",
    icon: "🎨",
    color: "bg-blue-500",
    description:
      "Property diversification expert with holdings across multiple neighborhoods",
    howToEarn:
      "Own properties in more than 3 different color groups and have more unique color groups than others",
    condition: (player, otherPlayers) => {
      const getUniqueGroups = (p: Player) =>
        new Set(p?.properties?.map((prop) => prop?.group))?.size || 0;

      const playerGroups = getUniqueGroups(player);
      const otherGroups = otherPlayers.map(getUniqueGroups);
      const maxGroups = Math.max(playerGroups, ...otherGroups);

      return playerGroups > 2 && playerGroups === maxGroups;
    },
  },

  {
    title: "Property Mogul",
    icon: "💎",
    color: "bg-amber-500",
    description: "Owner of the most valuable property portfolio",
    howToEarn:
      "Have the highest total property value (sum of purchase prices) among all players",
    condition: (player, otherPlayers) => {
      const getTotalValue = (p: Player) =>
        p?.properties?.reduce((sum, prop) => sum + (prop?.price || 0), 0) || 0;

      const playerValue = getTotalValue(player);
      const otherValues = otherPlayers.map(getTotalValue);
      const maxValue = Math.max(playerValue, ...otherValues);

      return playerValue > 0 && playerValue === maxValue;
    },
  },

  {
    title: "Mortgage King",
    icon: "🏦",
    color: "bg-red-500",
    description: "Master of leveraging assets through strategic mortgaging",
    howToEarn:
      "Have more than 2 mortgaged properties and more mortgages than any other player",
    condition: (player, otherPlayers) => {
      const getMortgagedCount = (p: Player) =>
        p?.properties?.filter((prop) => prop?.isMortgaged)?.length || 0;

      const playerMortgaged = getMortgagedCount(player);
      const otherMortgaged = otherPlayers.map(getMortgagedCount);
      const maxMortgaged = Math.max(playerMortgaged, ...otherMortgaged);

      return playerMortgaged > 2 && playerMortgaged === maxMortgaged;
    },
  },

  {
    title: "Luxury Living",
    icon: "👑",
    color: "bg-indigo-500",
    description: "Collector of premium properties in prestigious locations",
    howToEarn: "Own at least 3 properties with one property worth $350 or more",
    condition: (player) => {
      const hasExpensiveProperties = player?.properties?.some(
        (prop) => prop?.price >= 350
      );
      const propertyCount = player?.properties?.length || 0;

      return hasExpensiveProperties && propertyCount >= 3;
    },
  },

  {
    title: "Efficient Landlord",
    icon: "📈",
    color: "bg-emerald-500",
    description: "Expert at maximizing property development",
    howToEarn:
      "Have at least 2 properties fully developed (4 houses or 1 hotel) and more than others",
    condition: (player, otherPlayers) => {
      const getFullyDevelopedCount = (p: Player) =>
        p?.properties?.filter(
          (prop) =>
            (prop?.houses === 4 || prop?.hotel === 1) && !prop?.isMortgaged
        )?.length || 0;

      const playerDeveloped = getFullyDevelopedCount(player);
      const otherDeveloped = otherPlayers.map(getFullyDevelopedCount);
      const maxDeveloped = Math.max(playerDeveloped, ...otherDeveloped);

      return playerDeveloped >= 2 && playerDeveloped === maxDeveloped;
    },
  },

  //   {
  //     title: "Strategic Investor",
  //     icon: "🎯",
  //     color: "bg-orange-500",
  //     description: "Skilled at acquiring and maintaining complete property sets",
  //     howToEarn:
  //       "Own at least 3 properties with one complete, unmortgaged color set",
  //     condition: (player, otherPlayers) => {
  //       const hasCompleteSet = player?.properties?.some((prop) => {
  //         const groupProperties = player?.properties?.filter(
  //           (p) => p?.group === prop?.group
  //         );
  //         return (
  //           groupProperties?.length >= 2 &&
  //           groupProperties?.every((p) => !p?.isMortgaged)
  //         );
  //       });

  //       const propertyCount = player?.properties?.length || 0;
  //       return hasCompleteSet && propertyCount >= 3;
  //     },
  //   },
];

const PlayerTags = ({
  player,
  allPlayers,
}: {
  player: Player;
  allPlayers: Player[];
}) => {
  const earnedTags = playerTags.filter((tag) => {
    const earned = tag.condition(player, allPlayers);
    return earned;
  });
  const [selectedTag, setSelectedTag] = useState<PlayerTag | null>(null);

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-2">
        {earnedTags.map((tag) => (
          <div
            key={tag.title}
            onClick={() => setSelectedTag(tag)}
            className={`
            inline-flex items-center gap-2 px-3 py-1 rounded-full
            ${tag.color} text-white text-sm ${josephinBold.className}
            transform hover:scale-105 transition-transform cursor-pointer
          `}
          >
            <span>{tag.icon}</span>
            <span>{tag.title}</span>
          </div>
        ))}
      </div>

      <Dialog
        open={selectedTag !== null}
        onOpenChange={() => setSelectedTag(null)}
      >
        <DialogContent className="sm:max-w-[425px] text-black">
          <DialogHeader>
            <DialogTitle
              className={`flex items-center gap-2 ${selectedTag?.color} text-white p-2 rounded-lg ${josephinBold.className}`}
            >
              <span>{selectedTag?.icon}</span>
              <span>{selectedTag?.title}</span>
            </DialogTitle>
          </DialogHeader>
          <div className=" space-y-4">
            <div>
              <h4
                className={`${josephinBold.className} text-lg mb-2 text-black`}
              >
                Description
              </h4>
              <p className={`text-black ${josephinNormal.className}`}>
                {selectedTag?.description}
              </p>
            </div>
            <div>
              <h4
                className={`${josephinBold.className} text-lg mb-2 text-black`}
              >
                How to Earn
              </h4>
              <p className={`text-black ${josephinNormal.className}`}>
                {selectedTag?.howToEarn}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlayerTags;
