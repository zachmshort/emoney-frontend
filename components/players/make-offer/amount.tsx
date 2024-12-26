import { Input } from "@/components/ui/input";
import { Offer, OfferNoID } from "@/types/schema";

const Amount = ({
  offer,
  updateOffer,
}: {
  offer: OfferNoID;
  updateOffer: (
    key: keyof OfferNoID,
    value: Partial<OfferNoID[keyof OfferNoID]>
  ) => void;
}) => {
  // Convert to string but remove any decimals by using parseInt
  const displayValue = offer?.offer?.amount
    ? Math.floor(offer.offer.amount).toString()
    : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-digit characters from the input
    const sanitizedValue = e.target.value.replace(/[^\d]/g, "");

    // Convert to number, defaulting to 0 if empty
    const newAmount = sanitizedValue === "" ? 0 : parseInt(sanitizedValue, 10);

    // Update the offer with the new amount
    updateOffer("offer", { amount: newAmount });
  };

  return (
    <Input
      type="number"
      value={displayValue}
      onChange={handleChange}
      placeholder="Enter amount"
      // Remove step prop to prevent decimals
      onWheel={(e) => e.currentTarget.blur()} // Prevent mousewheel from changing value
      // Prevent decimal point and e/E (scientific notation)
      onKeyDown={(e) => {
        if (e.key === "." || e.key.toLowerCase() === "e") {
          e.preventDefault();
        }
      }}
    />
  );
};

export default Amount;
