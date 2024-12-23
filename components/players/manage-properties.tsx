import { Player, Property } from "@/types/schema";
import { useState } from "react";
import Image from "next/image";
import { MdArrowBackIos } from "react-icons/md";
import { josephinBold, josephinNormal } from "../ui/fonts";
import { toast } from "sonner";
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
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [houseBuildingMode, setHouseBuildingMode] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<
    { propertyId: string; count?: number }[]
  >([]);

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

  const canBuildHouses = (properties: Property[]) => {
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

    // if the user has any hotels at all they cant buy houses because you have to evenly distribute houses. so you cant have a hotel on one property without atleast 4 houses on the rest
    if (properties.some((p) => p.hotel > 0)) {
      return false;
    }

    const minHouses = Math.min(...properties.map((p) => p.houses));
    const maxHouses = Math.max(...properties.map((p) => p.houses));

    return (
      maxHouses - minHouses <= 1 &&
      !properties.some((p) => p.isMortgaged) &&
      maxHouses < 5 // max houses is  4
    );
  };

  const handleBuildHouses = (properties: Property[], houseCount: number) => {
    const propertyDetails = properties.map((p) => ({
      propertyId: p.id,
      count: houseCount,
    }));
    const totalCost = houseCount * properties[0].houseCost;

    onManageProperties(
      totalCost,
      "ADD_HOUSES",
      propertyDetails,
      currentPlayer.id
    );
    setHouseBuildingMode(false);
  };

  const handleSellHouses = (property: Property, count: number) => {
    onManageProperties(
      -count * property.houseCost,
      "REMOVE_HOUSES",
      [{ propertyId: property.id, count }],
      currentPlayer.id
    );
  };

  const renderHouseBuildingDialog = (properties: Property[]) => {
    const totalHousesAvailable = properties.length * 4;
    const currentHouses = properties.reduce((sum, p) => sum + p.houses, 0);
    const maxHouses = totalHousesAvailable - currentHouses;
    return (
      <Dialog open={houseBuildingMode} onOpenChange={setHouseBuildingMode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={`${josephinNormal.className} text-black`}>
              Build Houses
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {properties.map((property) => (
              <div
                key={property.id}
                className="flex items-center justify-between"
              >
                <span className={`text-black ${josephinBold.className}`}>
                  {property.name}
                </span>
                <input
                  type="number"
                  min={0}
                  max={maxHouses / selectedProperties.length}
                  value={
                    selectedProperties.find((p) => p.propertyId === property.id)
                      ?.count || 0
                  }
                  onChange={(e) => {
                    const count = Math.max(
                      0,
                      Math.min(maxHouses, Number(e.target.value))
                    );
                    setSelectedProperties((prev) =>
                      prev.some((p) => p.propertyId === property.id)
                        ? prev.map((p) =>
                            p.propertyId === property.id ? { ...p, count } : p
                          )
                        : [...prev, { propertyId: property.id, count }]
                    );
                  }}
                  className={`${josephinBold.className} border rounded px-2 text-black`}
                />
              </div>
            ))}
            <button
              className={`${josephinNormal.className} w-full p-2 bg-green-600 text-white rounded`}
              onClick={() => handleBuildHouses(properties, maxHouses)}
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
    const canBuild = canBuildHouses(groupProperties);

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
                {property.isMortgaged && (
                  <span className="text-red-500">Mortgaged</span>
                )}
                {property.houses > 0 && (
                  <div className="flex gap-1 pt-1">
                    {Array.from({
                      length: property.houses / groupProperties.length,
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
                {property.hotel > 0 && (
                  <span className="text-blue-500">Hotel</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 py-4">
              {canBuild && (
                <button
                  className="bg-green-600 text-white p-2 rounded text-sm"
                  onClick={() => {
                    setHouseBuildingMode(true);
                  }}
                >
                  Build Houses
                </button>
              )}
              {property.houses > 0 && (
                <button
                  className="bg-red-600 text-white p-2 rounded text-sm"
                  onClick={() => handleSellHouses(property, 1)}
                >
                  Sell House
                </button>
              )}
              {!property.isMortgaged && property.houses === 0 ? (
                <button
                  className="bg-yellow-600 text-white p-2 rounded text-sm"
                  // onClick={() => onMortgage(property.id)}
                >
                  Mortgage (${property.price / 2})
                </button>
              ) : (
                property.isMortgaged && (
                  <button
                    className="bg-blue-600 text-white p-2 rounded text-sm"
                    // onClick={() => onUnmortgage(property.id)}
                  >
                    Unmortgage (${Math.floor(property.price * 0.55)})
                  </button>
                )
              )}
              {property.houses === 0 && (
                <button
                  className="bg-gray-600 text-white p-2 rounded text-sm"
                  // onClick={() => onSellToBank(property.id)}
                >
                  Sell to Bank
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
            renderHouseBuildingDialog(
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
