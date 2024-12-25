import { Property } from "@/types/schema";
import PropertyCardContainer from "./card-container";
import CommonPropertyCard from "./common-card";
import RailroadCard from "./railroad-card";
import UtilityCard from "./utility-card";

const PropertyCard = ({
  property,
  className,
  className2,
  onClick,
}: {
  property: Property;
  className?: string;
  className2?: string;
  onClick?: () => void;
}) => {
  return (
    <>
      <PropertyCardContainer onClick={onClick} className={className}>
        {property.group === "railroad" ? (
          <RailroadCard property={property} />
        ) : property.group === "utility" ? (
          <UtilityCard property={property} />
        ) : (
          <CommonPropertyCard className2={className2} property={property} />
        )}
      </PropertyCardContainer>
    </>
  );
};

export default PropertyCard;
