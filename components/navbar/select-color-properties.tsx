import { Property } from "@/types/schema";
import { useState } from "react";
import Image from "next/image";

const SelectColorProperties = ({ properties }: { properties: Property[] }) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

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
    <div className="space-y-4">
      {selectedGroup ? (
        <>
          <h1 className={``} onClick={() => setSelectedGroup(null)}>
            Back
          </h1>
          <div className="overflow-x-auto flex gap-4 p-2">
            {groupedProperties
              .find(([group]) => group === selectedGroup)?.[1]
              .map((property) => (
                <div key={property.id} className="flex-shrink-0">
                  <Image
                    src={`/property-images/${property.images[0]}.png`}
                    alt={property.images[0]}
                    width={200}
                    height={300}
                    className="rounded"
                  />
                </div>
              ))}
          </div>
        </>
      ) : (
        <>
          <h2>Select a Color</h2>
          <div className="grid grid-cols-4 gap-2">
            {groupedProperties.map(([group, props]) => (
              <button
                key={group}
                className="p-2 rounded mb-2 border aspect-square w-full"
                style={{ backgroundColor: props[0].color }}
                onClick={() => setSelectedGroup(group)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SelectColorProperties;
