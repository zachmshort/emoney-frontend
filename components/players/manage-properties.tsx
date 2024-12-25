import { Player, Property } from "@/types/schema";
import { useEffect, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { josephinBold, josephinNormal } from "../ui/fonts";
import { ManagePropertiesPayload } from "@/types/payloads";
import {
  getDisplayState,
  getDisplayStateManage,
} from "@/lib/utils/propertyHelpers";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { toast } from "sonner";
import PropertyCard from "../property/cards/card";

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
  const [propertiesToBuy, setPropertiesToBuy] = useState<Property[]>([]);
  useEffect(() => {
    if (selectedGroup && player.properties) {
      const groupProperties =
        groupedProperties.find(([group]) => group === selectedGroup)?.[1] || [];
      const initialHouseCount = groupProperties.reduce(
        (sum, p) => sum + p.developmentLevel,
        0
      );
      setInitialHouses(initialHouseCount);
      setCurrentHouses(initialHouseCount);
      setPropertyCounts(
        groupProperties.map((p) => ({
          propertyId: p.id,
          count: p.developmentLevel,
        }))
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

  const canManageHouses = (properties: Property[]) => {
    const allPropertiesInGroup = groupedProperties.find(
      ([group]) => group === properties[0].group
    );

    // if player doesnt have all the cards in set or if its railroad/utility cannot buy houses
    if (
      !allPropertiesInGroup ||
      allPropertiesInGroup[1].length !== properties.length ||
      allPropertiesInGroup[0] === "railroad" ||
      allPropertiesInGroup[0] === "utility"
    ) {
      return false;
    }
    console.log("didint fail 1");
    if (properties.some((p) => p.isMortgaged)) {
      return false;
    }
    console.log("didnt fail 2");

    return true;
  };

  const canMortgageProperty = (properties: Property[]) => {
    if (properties.some((p) => p.developmentLevel > 0)) {
      return false;
    }
    return true;
  };

  const handleChangeHouses = (
    propertyCounts: { propertyId: string; count: number }[],
    totalCost: number
  ) => {
    console.log(propertyCounts);
    onManageProperties(totalCost, "HOUSES", propertyCounts, currentPlayer.id);
  };

  // const handleSellToBank = (property: Property) => {
  //   onManageProperties(
  //     property?.isMortgaged ? -property.price / 2 : -property.price,
  //     "SELL",
  //     [{ propertyId: property.id }],
  //     currentPlayer.id
  //   );
  // };

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
    const totalHotelsAvailable = properties.length;
    const totalPropertiesAvailable =
      totalHotelsAvailable + totalHousesAvailable;

    const distributeHouses = (totalHouses: number) => {
      setPropertyCounts(() => {
        const distribution = properties.map((p) => ({
          propertyId: p.id,
          count: p.developmentLevel,
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
      if (currentHouses < totalPropertiesAvailable) {
        const newHouseCount = currentHouses + 1;
        setCurrentHouses((prev) => {
          const updated = prev + 1;
          return updated;
        });
        distributeHouses(newHouseCount - initialHouses);
      }
    };

    const handleDecrement = () => {
      if (currentHouses > 0) {
        const newHouseCount = currentHouses - 1;
        setCurrentHouses((prev) => {
          const updated = prev - 1;
          return updated;
        });
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
    const NO_CHANGE = transactionType === "NO_CHANGE";
    const numHouses = Math.abs(currentHouses - initialHouses);
    return (
      <>
        {houseBuildingMode && (
          <>
            <div className={`${josephinNormal.className} text-center `}>
              Develop Property
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button onClick={handleDecrement}>
                  <CiCircleMinus className="h-12 w-12 text-white " />
                </button>
                {!NO_CHANGE ? (
                  <>
                    <span className={` ${josephinBold.className}`}>
                      {transactionType === "ADD_HOUSES" ? "Buy " : "Sell "}
                      {getDisplayStateManage(numHouses, properties.length)} (
                      {transactionType === "ADD_HOUSES" ? "-" : "+"}$
                      {BUY ? totalCost : totalCost / 2})
                    </span>
                  </>
                ) : (
                  <div className={` ${josephinBold.className}`}>No Change</div>
                )}
                <button onClick={handleIncrement}>
                  <CiCirclePlus className="h-12 w-12 rounded-full shadhow-md  text-white " />
                </button>
              </div>
              <div className="space-y-2">
                {propertyCounts.map((property) => (
                  <div
                    key={property.propertyId}
                    className="flex justify-between items-center"
                  >
                    <span className={` ${josephinBold.className}`}>
                      {
                        properties.find((p) => p.id === property.propertyId)
                          ?.name
                      }
                    </span>
                    <span className={` ${josephinBold.className}`}>
                      {getDisplayState(property.count)}
                    </span>
                  </div>
                ))}
              </div>
              <button
                className={`${josephinNormal.className} w-full p-2 ${
                  BUY ? "bg-red-500" : "bg-green-600"
                }  rounded`}
                disabled={currentHouses === initialHouses}
                onClick={() => {
                  if (BUY && totalCost > player.balance) {
                    toast.error(
                      `Insufficent funds, you need $${
                        totalCost - player.balance
                      }`,
                      {
                        className: `${josephinBold.className}`,
                      }
                    );
                  } else {
                    handleChangeHouses(
                      propertyCounts,
                      BUY ? totalCost : -totalCost / 2
                    );
                    setHouseBuildingMode(false);
                  }
                }}
              >
                Confirm
              </button>
              <button
                className={`w-full border-[1px] border-grey-400 p-2 rounded ${josephinNormal.className}`}
                onClick={() => {
                  setHouseBuildingMode(false);
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </>
    );
  };

  const renderPropertyManagement = (
    property: Property,
    groupProperties: Property[]
  ) => {
    const canMortgage = canMortgageProperty(groupProperties);
    return (
      <div className="relative group">
        <div className="relative">
          {currentPlayer?.id !== property?.playerId &&
            propertiesToBuy.some((p) => p.id === property.id) && (
              <div className="absolute inset-0 bg-white opacity-50 rounded"></div>
            )}
          <PropertyCard
            property={property}
            className2={`pt-3`}
            onClick={() => {
              if (currentPlayer?.id === property?.playerId) {
                if (canManageHouses(groupProperties)) {
                  setHouseBuildingMode(true);
                  setSelectedGroup(property.group);
                } else {
                  toast.error("You cannot build on this property", {
                    className: `${josephinBold.className}`,
                  });
                }
              } else {
                if (propertiesToBuy.some((p) => p.id === property.id)) {
                  setPropertiesToBuy((prev) =>
                    prev.filter((p) => p.id !== property.id)
                  );
                } else {
                  setPropertiesToBuy((prev) => [...prev, property]);
                }
              }
            }}
          />
        </div>

        {player?.id === currentPlayer?.id && (
          <>
            <div className="grid grid-cols-1 gap-2 py-2">
              {canMortgage && !property.isMortgaged && (
                <button
                  className="bg-yellow-600 text-white p-2 rounded text-sm"
                  onClick={() => handleMortgage(property)}
                >
                  Mortgage (${property.price / 2})
                </button>
              )}
              {property.isMortgaged && (
                <button
                  className="bg-blue-600 text-white p-2 rounded text-sm"
                  onClick={() => handleUnmortgage(property)}
                >
                  Unmortgage (${Math.floor(property.price * 0.55)})
                </button>
              )}
              {/* {property.developmentLevel === 0 && canMortgage && (
                <button
                  className="bg-gray-600 text-white p-2 rounded text-sm"
                  onClick={() => handleSellToBank(property)}
                >
                  Sell to Bank ($
                  {Math.floor(property?.isMortgaged ? 0 : property.price / 2)})
                </button>
              )} */}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-4 ! ${josephinBold.className}`}>
      {propertiesToBuy?.length > 0 && (
        <button
          className={`fixed bottom-2 w-full right-1/2 transform translate-x-1/2 bg-slate-800 text-white`}
        >
          Make an Offer
        </button>
      )}
      {currentView === "properties" ? (
        <>
          {houseBuildingMode ? (
            renderManageHouseDialog(
              groupedProperties.find(([group]) => group === selectedGroup)[1]
            )
          ) : (
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
            </>
          )}
        </>
      ) : (
        <>
          <div className="grid grid-cols-4 sm:grid-cols-10 gap-2">
            {groupedProperties.map(([group, props]) => (
              <button
                key={group}
                className="p-2 rounded-sm border aspect-square w-full"
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
