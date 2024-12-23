import { Player, Property } from "@/types/schema";
import { useState } from "react";
import Image from "next/image";
import { MdArrowBackIos } from "react-icons/md";
import { josephinBold } from "../ui/fonts";
import { toast } from "sonner";
import { DrawerClose } from "../ui/drawer";

interface SelectColorPropertiesProps {
  properties?: Property[];
  player?: Player;
  onPurchase?: (propertyId: string, buyerId: string, price: number) => void;
  canPurchase?: boolean;
}

const SelectColorProperties = ({
  properties = [],
  player,
  onPurchase,
  canPurchase = false,
}: SelectColorPropertiesProps) => {
  const [currentView, setCurrentView] = useState<
    "colors" | "properties" | "confirmation"
  >("colors");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  if (!properties || properties.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className={`text-xl ${josephinBold.className} text-white`}>
          No Properties Found
        </p>
      </div>
    );
  }

  const handlePropertySelect = (property: Property) => {
    if (player.balance < property.price && canPurchase) {
      toast.error(
        `Insufficient funds to purchase ${property.name} ($${property.price})`
      );
      return;
    }
    setSelectedProperty(property);
    setCurrentView("confirmation");
  };

  const handleConfirmPurchase = () => {
    if (!selectedProperty) return;

    onPurchase(selectedProperty.id, player.id, selectedProperty.price);
  };

  const handleBack = () => {
    if (currentView === "confirmation") {
      setCurrentView("properties");
      setSelectedProperty(null);
    } else if (currentView === "properties") {
      setCurrentView("colors");
      setSelectedGroup(null);
    }
  };

  const groupedProperties = Object.entries(
    properties.reduce((acc, property) => {
      if (!acc[property.group]) {
        acc[property.group] = [];
      }
      acc[property.group].push(property);
      return acc;
    }, {} as Record<string, Property[]>)
  );

  const PrefetchImages = ({ group }: { group: string }) => {
    const images = groupedProperties
      .find(([g]) => g === group)?.[1]
      .map((property) => property.images[0]);

    return (
      <>
        {images?.map((image) => (
          <link
            key={image}
            rel="prefetch"
            href={`/property-images/${image}.png`}
            as="image"
          />
        ))}
      </>
    );
  };

  const renderConfirmationView = () => {
    if (!selectedProperty) return null;

    const newBalance = player.balance - selectedProperty.price;

    return (
      <>
        <h1
          className="flex items-center justify-start mb-6"
          onClick={handleBack}
        >
          <MdArrowBackIos />
        </h1>
        <div className="space-y-2">
          <div className="space-y-2">
            <h2 className="text-xl">Confirm Purchase</h2>
            <div className="bg-gray-800 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span>Price:</span>
                <span className="text-xl">${selectedProperty.price}</span>
              </div>
              <div className="text-sm opacity-80">{selectedProperty.name}</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg">Balance After Purchase</h3>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between">
                <span>{player.name}</span>
                <span className="text-yellow-400">${newBalance}</span>
              </div>
            </div>
          </div>

          <DrawerClose className="w-full">
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg mt-4"
              onClick={handleConfirmPurchase}
            >
              Confirm Purchase
            </button>
          </DrawerClose>
        </div>
      </>
    );
  };

  return (
    <div className={`space-y-2 text-2xl  ${josephinBold.className}`}>
      {hoveredGroup && <PrefetchImages group={hoveredGroup} />}

      {currentView === "confirmation" ? (
        renderConfirmationView()
      ) : currentView === "properties" ? (
        <>
          <h1 className="flex items-center justify-start" onClick={handleBack}>
            <MdArrowBackIos />
          </h1>
          <div className="overflow-x-auto flex gap-4">
            {groupedProperties
              .find(([group]) => group === selectedGroup)?.[1]
              .map((property) => (
                <div
                  key={property.id}
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() => handlePropertySelect(property)}
                >
                  <div className="relative">
                    <Image
                      src={`/property-images/${property.images[0]}.png`}
                      alt={property.images[0]}
                      width={200}
                      height={300}
                      className="rounded"
                      priority
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-center">
                      <span className="text-lg">${property?.price}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <>
          <h2>Select a Color</h2>
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
                onMouseEnter={() => setHoveredGroup(group)}
                onMouseLeave={() => setHoveredGroup(null)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SelectColorProperties;
