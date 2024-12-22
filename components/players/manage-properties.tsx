import { Player, Property } from "@/types/schema";
import { useState } from "react";
import Image from "next/image";
import { MdArrowBackIos } from "react-icons/md";
import { josephinBold, josephinNormal } from "../ui/fonts";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface ManagePropertiesProps {
  player: Player;
  currentPlayer: Player;
  onBuildHouses: (propertyIds: string[], count: number) => void;
  onSellHouses: (propertyIds: string[], count: number) => void;
  onMortgage: (propertyId: string) => void;
  onUnmortgage: (propertyId: string) => void;
  onSellToBank: (propertyId: string) => void;
}

const ManageProperties = ({
  player,
  currentPlayer,
  onBuildHouses,
  onSellHouses,
  onMortgage,
  onUnmortgage,
  onSellToBank,
}: ManagePropertiesProps) => {
  const [currentView, setCurrentView] = useState<"colors" | "properties">(
    "colors"
  );
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [houseBuildingMode, setHouseBuildingMode] = useState(false);
  const [houseCount, setHouseCount] = useState(0);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  // Empty state handling
  if (!player?.properties || player?.properties.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className={`text-xl ${josephinBold.className} text-white`}>
          No Properties Found
        </p>
      </div>
    );
  }

  // Group properties by color
  const groupedProperties = Object.entries(
    player.properties.reduce((acc, property) => {
      if (!acc[property.group]) {
        acc[property.group] = [];
      }
      acc[property.group].push(property);
      return acc;
    }, {} as Record<string, Property[]>)
  );

  // Helper to check if house building is valid
  const canBuildHouses = (properties: Property[]) => {
    const minHouses = Math.min(...properties.map((p) => p.houses));
    const maxHouses = Math.max(...properties.map((p) => p.houses));
    return (
      maxHouses - minHouses <= 1 && // Houses are relatively even
      !properties.some((p) => p.isMortgaged) && // No mortgaged properties
      maxHouses < 5
    ); // No property has a hotel
  };

  // Handle house building flow
  const handleBuildHouses = (properties: Property[]) => {
    const totalProperties = properties.length;
    const maxHousesToBuild =
      totalProperties * (5 - Math.max(...properties.map((p) => p.houses)));

    if (maxHousesToBuild === 0) {
      toast.error("Cannot build more houses on these properties");
      return;
    }

    setHouseBuildingMode(true);
    setHouseCount(0);
    setSelectedProperties([]);
  };

  // Render the house building dialog
  const renderHouseBuildingDialog = (properties: Property[]) => {
    const minHouses = Math.min(...properties.map((p) => p.houses));
    const totalCost = houseCount * properties[0].houseCost;
    const unbalancedCount = houseCount % properties.length;

    return (
      <Dialog open={houseBuildingMode} onOpenChange={setHouseBuildingMode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Build Houses</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* House count selector */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setHouseCount(Math.max(0, houseCount - 1))}
                className="p-2 rounded bg-gray-200"
              >
                -
              </button>
              <span>
                {houseCount} houses (${totalCost})
              </span>
              <button
                onClick={() => setHouseCount(houseCount + 1)}
                className="px-3 py-2 rounded border-[1px] text-black"
              >
                +
              </button>
            </div>

            {unbalancedCount > 0 && (
              <div
                className={`${josephinNormal.className} space-y-2 text-black`}
              >
                <p>
                  Select {unbalancedCount} properties to receive an extra house:
                </p>
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className={`p-2 border rounded ${
                      selectedProperties.includes(property.id)
                        ? "bg-blue-100"
                        : ""
                    }`}
                    onClick={() => {
                      if (selectedProperties.includes(property.id)) {
                        setSelectedProperties((prev) =>
                          prev.filter((id) => id !== property.id)
                        );
                      } else if (selectedProperties.length < unbalancedCount) {
                        setSelectedProperties((prev) => [...prev, property.id]);
                      }
                    }}
                  >
                    {property.name} (Currently {property.houses} houses)
                  </div>
                ))}
              </div>
            )}

            <button
              className={`${josephinNormal.className} w-full p-2 bg-green-600 text-black  rounded`}
              disabled={
                unbalancedCount > 0 &&
                selectedProperties.length !== unbalancedCount
              }
              onClick={() => {
                onBuildHouses(
                  properties.map((p) => p.id),
                  houseCount
                );
                setHouseBuildingMode(false);
              }}
            >
              Confirm (${totalCost})
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

        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
          <div className="flex flex-col gap-1">
            {property.isMortgaged && (
              <span className="text-red-500">Mortgaged</span>
            )}
            {property.houses > 0 && (
              <span className="text-green-500">
                {property.houses} House{property.houses !== 1 && "s"}
              </span>
            )}
            {property.hotel > 0 && <span className="text-blue-500">Hotel</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 py-4">
          {canBuild && (
            <button
              className="bg-green-600 text-white p-2 rounded text-sm"
              onClick={() => handleBuildHouses(groupProperties)}
            >
              Build Houses
            </button>
          )}
          {property.houses > 0 && (
            <button
              className="bg-red-600 text-white p-2 rounded text-sm"
              onClick={() => onSellHouses([property.id], 1)}
            >
              Sell House
            </button>
          )}
          {!property.isMortgaged && property.houses === 0 ? (
            <button
              className="bg-yellow-600 text-white p-2 rounded text-sm"
              onClick={() => onMortgage(property.id)}
            >
              Mortgage (${property.price / 2})
            </button>
          ) : (
            property.isMortgaged && (
              <button
                className="bg-blue-600 text-white p-2 rounded text-sm"
                onClick={() => onUnmortgage(property.id)}
              >
                Unmortgage (${Math.floor(property.price * 0.55)})
              </button>
            )
          )}
          {property.houses === 0 && (
            <button
              className="bg-gray-600 text-white p-2 rounded text-sm"
              onClick={() => onSellToBank(property.id)}
            >
              Sell to Bank
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-4 !text-black ${josephinBold.className}`}>
      {currentView === "properties" ? (
        <>
          <h1
            className="flex items-center justify-start"
            onClick={() => {
              setCurrentView("colors");
              setSelectedGroup(null);
            }}
          >
            <MdArrowBackIos />
            <span className="ml-2">Back</span>
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
          <h2>Select a Color Group</h2>
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
