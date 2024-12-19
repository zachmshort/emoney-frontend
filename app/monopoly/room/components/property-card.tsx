import { getPropertyByIndex } from "@/lib/properties";
import { Property } from "@/types/schema";
import Image from "next/image";

const PropertyCard = ({ property }: { property: Property }) => {
  const propertyConfig = getPropertyByIndex(property.propertyIndex);

  return (
    <div className="h-full w-full p-4">
      <div className="w-full h-full rounded-lg shadow-lg p-4">
        <Image
          src={propertyConfig.images[0]}
          alt={`${propertyConfig.name} image`}
          className="w-full h-auto rounded-lg"
        />
        <div className="mt-4">
          {property.houses > 0 && <p>Houses: {property.houses}</p>}
          {property.hotel > 0 && <p>Hotel: Yes</p>}
          {property.isMortgaged && <p className="text-red-500">MORTGAGED</p>}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
