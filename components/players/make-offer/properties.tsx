import { OfferNoID, Property } from "@/types/schema";
import MakeOfferProperties from "./select-properties";

const Properties = ({
  properties,
  updateOffer,
  offer,
  type,
}: {
  offer: OfferNoID;
  updateOffer: (
    key: keyof OfferNoID,
    value: Partial<OfferNoID[keyof OfferNoID]>
  ) => void;
  properties?: Property[];
  type: "request" | "offer";
}) => {
  return (
    <>
      <MakeOfferProperties
        properties={properties}
        updateOffer={updateOffer}
        offer={offer}
        type={type}
      />
    </>
  );
};

export default Properties;
