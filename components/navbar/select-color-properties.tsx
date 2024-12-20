import { Property } from "@/types/schema";
import { useState } from "react";
import Image from "next/image";
import { MdArrowBackIos } from "react-icons/md";
import { josephinBold } from "../fonts";

const SelectColorProperties = ({
  properties = [],
}: {
  properties?: Property[];
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  if (!properties || properties.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className={`text-xl ${josephinBold.className} text-white`}>
          No Properties Found
        </p>
      </div>
    );
  }

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

  return (
    <div className="space-y-4">
      {hoveredGroup && <PrefetchImages group={hoveredGroup} />}

      {selectedGroup ? (
        <>
          <h1
            className={`flex items-center justify-start`}
            onClick={() => setSelectedGroup(null)}
          >
            <MdArrowBackIos /> Back
          </h1>
          <div className="overflow-x-auto flex gap-4 px-2">
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
                    priority
                  />
                </div>
              ))}
          </div>
        </>
      ) : (
        <>
          <h2 className={``}>Select a Color</h2>
          <div className="grid grid-cols-4 sm:grid-cols-10 gap-2">
            {groupedProperties.map(([group, props]) => (
              <button
                key={group}
                className="p-2 rounded mb-2 border aspect-square w-full"
                style={{ backgroundColor: props[0].color }}
                onClick={() => setSelectedGroup(group)}
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
