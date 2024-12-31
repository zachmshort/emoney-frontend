import PropertyCard from "@/components/property/cards/card";
import { josephinBold } from "@/components/ui/fonts";
import { OfferNoID, Player, Property } from "@/types/schema";
import { useState } from "react";
import { MdArrowBackIos } from "react-icons/md";

interface p {
  properties?: Property[];
  // player?: Player;
  offer: OfferNoID;
  updateOffer: (
    key: keyof OfferNoID,
    value: Partial<OfferNoID[keyof OfferNoID]>
  ) => void;
  type: "offer" | "request";
}

const MakeOfferProperties = ({
  properties = [],
  // player,
  offer,
  type,
  updateOffer,
}: p) => {
  const [currentView, setCurrentView] = useState<"colors" | "properties">(
    "colors"
  );

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  if (!properties || properties.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className={`text-xl ${josephinBold.className} text-white`}>
          No Properties Found
        </p>
      </div>
    );
  }
  const isPropertySelected = (propertyId: string): boolean => {
    const currentProperties = offer[type]?.properties || [];
    return currentProperties.includes(propertyId);
  };
  const handlePropertySelect = (property: Property) => {
    const currentProperties = offer[type]?.properties || [];

    const propertyExists = currentProperties.includes(property.id);

    let updatedProperties: string[];
    if (propertyExists) {
      updatedProperties = currentProperties.filter((id) => id !== property.id);
    } else {
      updatedProperties = [...currentProperties, property.id];
    }

    updateOffer(type, {
      properties: updatedProperties,
    });
  };

  const handleBack = () => {
    setCurrentView("colors");
    setSelectedGroup(null);
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

  return (
    <div className={`space-y-2 text-2xl  ${josephinBold.className}`}>
      {currentView === "properties" ? (
        <>
          <h1 className="flex items-center justify-start" onClick={handleBack}>
            <MdArrowBackIos />
          </h1>
          <div className="overflow-x-auto flex gap-4">
            {groupedProperties
              .find(([group]) => group === selectedGroup)?.[1]
              .map((property: Property, index: number) => (
                <div className="relative" key={index}>
                  <PropertyCard
                    property={property}
                    className={`
                      flex-shrink-0 cursor-pointer
                      ${
                        isPropertySelected(property.id)
                          ? type === "offer"
                            ? "bg-red-700"
                            : "bg-green-700"
                          : ""
                      }
                    `}
                    onClick={() => handlePropertySelect(property)}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-center">
                    <span className="text-lg">${property?.price}</span>
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-4 sm:grid-cols-10 gap-2">
            {groupedProperties.map(([group, props]) => (
              <button
                key={group}
                className="p-2 rounded border aspect-square w-full"
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

export default MakeOfferProperties;
