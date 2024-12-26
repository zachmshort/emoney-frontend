import { Input } from "@/components/ui/input";
import { OfferNoID } from "@/types/schema";

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
  const displayValue = offer?.offer?.amount
    ? Math.floor(offer.offer.amount).toString()
    : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d]/g, "");

    const newAmount = val === "" ? 0 : parseInt(val, 10);

    updateOffer("offer", { amount: newAmount });
  };

  return (
    <Input
      type="number"
      value={displayValue}
      onChange={handleChange}
      placeholder="Enter amount"
      onWheel={(e) => e.currentTarget.blur()}
      onKeyDown={(e) => {
        if (e.key === "." || e.key.toLowerCase() === "e") {
          e.preventDefault();
        }
      }}
    />
  );
};

export default Amount;
