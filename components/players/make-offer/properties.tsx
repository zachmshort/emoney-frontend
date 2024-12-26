import { OfferNoID, Property } from "@/types/schema";
import MakeOfferProperties from "./select-properties";

const Properties = ({
  properties,
  updateOffer,
  offer,
}: {
  offer: OfferNoID;
  updateOffer: (
    key: keyof OfferNoID,
    value: Partial<OfferNoID[keyof OfferNoID]>
  ) => void;
  properties?: Property[];
}) => {
  return (
    <>
      <MakeOfferProperties
        properties={properties}
        updateOffer={updateOffer}
        offer={offer}
      />
    </>
  );
};

export default Properties;
