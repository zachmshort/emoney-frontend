import { Player, Property } from "@/types/schema";
import { useEffect, useState } from "react";
import Image from "next/image";
import { MdArrowBackIos } from "react-icons/md";
import { josephinBold, josephinNormal } from "../ui/fonts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ManagePropertiesPayload } from "@/types/payloads";

interface ManagePropertiesProps {
  player: Player;
  currentPlayer: Player;
  onManageProperties: (
    amount: number,
    managementType: ManagePropertiesPayload["managementType"],
    properties: { propertyId: string; count?: number }[],
    playerId: string
  ) => void;
}

const ManageProperties = ({
  player,
  currentPlayer,
  onManageProperties,
}: ManagePropertiesProps) => {
  const [currentView, setCurrentView] = useState<"colors" | "properties">(
    "colors"
  );
  const [houseBuildingMode, setHouseBuildingMode] = useState(false);
  const [currentHouses, setCurrentHouses] = useState(0);
  const [initialHouses, setInitialHouses] = useState(0);
  const [propertyCounts, setPropertyCounts] = useState<
    {
      propertyId: string;
      count: number;
    }[]
  >([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  useEffect(() => {
    if (selectedGroup && player.properties) {
      const groupProperties =
        groupedProperties.find(([group]) => group === selectedGroup)?.[1] || [];
      const initialHouseCount = groupProperties.reduce(
        (sum, p) => sum + p.houses,
        0
      );
      setInitialHouses(initialHouseCount);
      setCurrentHouses(initialHouseCount);
      setPropertyCounts(
        groupProperties.map((p) => ({ propertyId: p.id, count: p.houses }))
      );
    }
  }, [selectedGroup, player.properties]);

  if (!player?.properties || player?.properties.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className={`text-xl ${josephinBold.className} text-white`}>
          No Properties Found
        </p>
      </div>
    );
  }

  const groupedProperties = Object.entries(
    player.properties.reduce((acc, property) => {
      if (!acc[property.group]) {
        acc[property.group] = [];
      }
      acc[property.group].push(property);
      return acc;
    }, {} as Record<string, Property[]>)
  );

  // const canBuildHotels = (properties: Property[]) => {
  //   const allPropertiesInGroup = groupedProperties.find(
  //     ([group]) => group === properties[0].group
  //   );

  //   // player owns all properties in the group and they are not railroads or utilities
  //   if (
  //     !allPropertiesInGroup ||
  //     allPropertiesInGroup[1].length !== properties.length ||
  //     ["railroad", "utility"].includes(properties[0].group)
  //   ) {
  //     return false;
  //   }

  //   // check if the player already has hotels on all properties
  //   if (properties.every((p) => p.hotel === 1)) {
  //     return false;
  //   }

  //   // all properties have exactly 4 houses and none are mortgaged
  //   if (properties.some((p) => p.houses !== 4 || p.isMortgaged)) {
  //     return false;
  //   }

  //   return true;
  // };

  const canManageHouses = (properties: Property[]) => {
    const allPropertiesInGroup = groupedProperties.find(
      ([group]) => group === properties[0].group
    );

    // if player doesnt have all the cards in set or if its railroad/utility cannot buy houses
    if (
      !allPropertiesInGroup ||
      allPropertiesInGroup.length !== properties.length ||
      allPropertiesInGroup[0] === "railroad" ||
      allPropertiesInGroup[0] === "utility"
    ) {
      return false;
    }

    const minHouses = Math.min(...properties.map((p) => p.houses));
    const maxHouses = Math.max(...properties.map((p) => p.houses));

    return (
      maxHouses - minHouses <= 1 &&
      !properties.some((p) => p.isMortgaged) &&
      maxHouses < 5
    );
  };

  const canMortgageProperty = (properties: Property[]) => {
    if (properties.some((p) => p.houses > 0)) {
      return false;
    }

    if (properties.some((p) => p.hotel > 0)) {
      return false;
    }

    return true;
  };

  const handleChangeHouses = (
    propertyCounts: { propertyId: string; count: number }[],
    managementType: "ADD_HOUSES" | "REMOVE_HOUSES" | "NO_CHANGE",
    totalCost: number
  ) => {
    onManageProperties(
      managementType === "ADD_HOUSES" ? -totalCost : totalCost,
      managementType,
      propertyCounts,
      currentPlayer.id
    );
  };

  const handleSellToBank = (property: Property) => {
    onManageProperties(
      property?.isMortgaged ? -property.price / 2 : -property.price,
      "SELL",
      [{ propertyId: property.id }],
      currentPlayer.id
    );
  };

  const handleMortgage = (property: Property) => {
    onManageProperties(
      -property.price / 2,
      "MORTGAGE",
      [{ propertyId: property.id }],
      currentPlayer.id
    );
  };

  const handleUnmortgage = (property: Property) => {
    onManageProperties(
      property.price * 0.55,
      "UNMORTGAGE",
      [{ propertyId: property.id }],
      currentPlayer.id
    );
  };

  const renderManageHouseDialog = (properties: Property[]) => {
    const totalHousesAvailable = properties.length * 4;
    // const maxHouses = totalHousesAvailable - initialHouses;

    const distributeHouses = (totalHouses: number) => {
      setPropertyCounts(() => {
        const distribution = properties.map((p) => ({
          propertyId: p.id,
          count: p.houses,
        }));

        const houseDifference = totalHouses;

        if (houseDifference > 0) {
          for (let i = 0; i < houseDifference; i++) {
            const minHouses = Math.min(...distribution.map((p) => p.count));
            const candidateProps = distribution.filter(
              (p) => p.count === minHouses
            );
            candidateProps[0].count++;
          }
        } else if (houseDifference < 0) {
          for (let i = 0; i < Math.abs(houseDifference); i++) {
            distribution.sort((a, b) => b.count - a.count);
            distribution[0].count--;
          }
          distribution.sort(
            (a, b) =>
              properties.findIndex((p) => p.id === a.propertyId) -
              properties.findIndex((p) => p.id === b.propertyId)
          );
        }

        return distribution;
      });
    };

    const handleIncrement = () => {
      if (currentHouses < totalHousesAvailable) {
        const newHouseCount = currentHouses + 1;
        setCurrentHouses(newHouseCount);
        distributeHouses(newHouseCount - initialHouses);
      }
    };

    const handleDecrement = () => {
      if (currentHouses > 0) {
        const newHouseCount = currentHouses - 1;
        setCurrentHouses(newHouseCount);
        distributeHouses(newHouseCount - initialHouses);
      }
    };

    const totalCost =
      Math.abs(currentHouses - initialHouses) * properties[0].houseCost;
    const transactionType =
      currentHouses > initialHouses
        ? "ADD_HOUSES"
        : currentHouses < initialHouses
        ? "REMOVE_HOUSES"
        : "NO_CHANGE";

    const BUY = transactionType === "ADD_HOUSES";

    return (
      <Dialog open={houseBuildingMode} onOpenChange={setHouseBuildingMode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle
              className={`${josephinNormal.className} text-center text-black`}
            >
              Manage Houses
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleDecrement}
                className="h-12 w-12  rounded border-[1px] text-black"
              >
                <strong>-</strong>
              </button>
              <span className={`text-black ${josephinBold.className}`}>
                {transactionType === "ADD_HOUSES"
                  ? "+"
                  : transactionType === "NO_CHANGE"
                  ? ""
                  : "-"}
                {Math.abs(currentHouses - initialHouses)} house
                {Math.abs(currentHouses - initialHouses) !== 1 && "s"} (
                {transactionType === "ADD_HOUSES"
                  ? "-"
                  : transactionType === "NO_CHANGE"
                  ? ""
                  : "+"}
                ${BUY ? totalCost : totalCost / 2})
              </span>
              <button
                onClick={handleIncrement}
                className="h-12 w-12 rounded border-[1px] text-black"
              >
                <strong>+</strong>
              </button>
            </div>
            <div className="space-y-2">
              {propertyCounts.map((property) => (
                <div
                  key={property.propertyId}
                  className="flex justify-between items-center"
                >
                  <span className={`text-black ${josephinBold.className}`}>
                    {properties.find((p) => p.id === property.propertyId)?.name}
                  </span>
                  <span className={`text-black ${josephinBold.className}`}>
                    {property.count} house{property.count !== 1 && "s"}
                  </span>
                </div>
              ))}
            </div>
            <button
              className={`${josephinNormal.className} w-full p-2 ${
                BUY ? "bg-red-500" : "bg-green-600"
              } text-black rounded`}
              disabled={currentHouses === initialHouses}
              onClick={() => {
                handleChangeHouses(
                  propertyCounts,
                  transactionType,
                  transactionType === "ADD_HOUSES" ? totalCost : totalCost / 2
                );
                setHouseBuildingMode(false);
              }}
            >
              Confirm
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderPropertyManagement = (
    property: Property,
    groupProperties: Property[]
  ) => {
    const canBuild = canManageHouses(groupProperties);
    const canMortgage = canMortgageProperty(groupProperties);
    return (
      <div className="relative group">
        <Image
          src={`/property-images/${property.images[0]}.png`}
          alt={property.name}
          width={200}
          height={300}
          className="rounded"
          priority
        />
        {player?.id === currentPlayer?.id && (
          <>
            <div className="">
              <div className="flex flex-col gap-1">
                <div className={`h-11`}>
                  {property.houses > 0 && property.hotel === 0 && (
                    <div className="flex gap-1 pt-1">
                      {Array.from({
                        length: property.houses,
                      }).map((_, index) => (
                        <div key={index}>
                          <Image
                            src="/house.png"
                            width={40}
                            height={40}
                            alt="house"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {property.hotel > 0 && (
                  <Image src="/hotel.png" width={40} height={40} alt="house" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 py-4">
              {canBuild && (
                <>
                  <button
                    className=" text-white p-2 rounded text-sm"
                    style={{ backgroundColor: "#2E8332" }}
                    onClick={() => {
                      setHouseBuildingMode(true);
                    }}
                  >
                    Manage Houses
                  </button>

                  {houseBuildingMode &&
                    renderManageHouseDialog(
                      groupedProperties.find(
                        ([group]) => group === selectedGroup
                      )[1]
                    )}
                </>
              )}
              {!property.isMortgaged && canMortgage ? (
                <button
                  className="bg-yellow-600 text-white p-2 rounded text-sm"
                  onClick={() => handleMortgage(property)}
                >
                  Mortgage (${property.price / 2})
                </button>
              ) : (
                property.isMortgaged && (
                  <button
                    className="bg-blue-600 text-white p-2 rounded text-sm"
                    onClick={() => handleUnmortgage(property)}
                  >
                    Unmortgage (${Math.floor(property.price * 0.55)})
                  </button>
                )
              )}
              {property.houses === 0 && canMortgage && (
                <button
                  className="bg-gray-600 text-white p-2 rounded text-sm"
                  onClick={() => handleSellToBank(property)}
                >
                  Sell to Bank ($
                  {Math.floor(
                    property?.isMortgaged ? property.price / 2 : property.price
                  )}
                  )
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-4 !text-black ${josephinBold.className}`}>
      {currentView === "properties" ? (
        <>
          <h1
            className="flex items-center justify-start text-white"
            onClick={() => {
              setCurrentView("colors");
              setSelectedGroup(null);
            }}
          >
            <MdArrowBackIos className={`text-white pb-1`} />
            <span className="ml-2 text-white -1">Back</span>
          </h1>
          <div className="overflow-x-auto flex gap-4">
            {groupedProperties
              .find(([group]) => group === selectedGroup)?.[1]
              .map((property) => (
                <div key={property.id} className="flex-shrink-0">
                  {renderPropertyManagement(
                    property,
                    groupedProperties.find(
                      ([group]) => group === selectedGroup
                    )[1]
                  )}
                </div>
              ))}
          </div>
          {houseBuildingMode &&
            renderManageHouseDialog(
              groupedProperties.find(([group]) => group === selectedGroup)[1]
            )}
        </>
      ) : (
        <>
          <h2 className={`text-white`}>Select a Color Group</h2>
          <div className="grid grid-cols-4 sm:grid-cols-10 gap-2">
            {groupedProperties.map(([group, props]) => (
              <button
                key={group}
                className="p-2 rounded mb-2 border aspect-square w-full"
                style={{ backgroundColor: props[0].color }}
                onClick={() => {
                  setSelectedGroup(group);
                  setCurrentView("properties");
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageProperties;
