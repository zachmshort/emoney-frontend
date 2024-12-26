import { OfferNoID } from "@/types/schema";

const Properties = ({
  offer,
  updateOffer,
}: {
  offer: OfferNoID;
  updateOffer: (
    key: keyof OfferNoID,
    value: Partial<OfferNoID[keyof OfferNoID]>
  ) => void;
}) => {
  return <></>;
};

export default Properties;
