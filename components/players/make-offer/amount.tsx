import { josephinBold } from "@/components/ui/fonts";
import { OfferNoID } from "@/types/schema";
import { useState } from "react";
import { FaDollarSign } from "react-icons/fa";

const Amount = ({
  offer,
  updateOffer,
  type = "offer",
  balance = 0,
  name,
}: {
  offer: OfferNoID;
  updateOffer: (
    key: keyof OfferNoID,
    value: Partial<OfferNoID[keyof OfferNoID]>
  ) => void;
  type?: "offer" | "request";
  balance?: number;
  name?: string;
}) => {
  const currentAmount =
    type === "offer" ? offer?.offer?.amount : offer?.request?.amount;

  const displayValue = currentAmount
    ? Math.floor(currentAmount).toString()
    : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^\d]/g, "");

    const newAmount = sanitizedValue === "" ? 0 : parseInt(sanitizedValue, 10);

    if (type === "offer") {
      if (newAmount <= balance) {
        updateOffer("offer", { amount: newAmount });
      } else {
        updateOffer("offer", { amount: balance });
      }
    } else {
      updateOffer("request", { amount: newAmount });
    }
  };
  // set the initial percent state by dividing the balance based on either offer.offer.amount or .request.amount depending on the type
  const [percent, setPercent] = useState(() => {
    if (!balance || balance === 0) return 0;

    if (type === "offer") {
      const offerAmount = offer?.offer?.amount || 0;
      return (offerAmount / balance) * 100;
    }

    const requestAmount = offer?.request?.amount || 0;
    return (requestAmount / balance) * 100;
  });

  return (
    <div className="flex flex-col gap-2">
      <p className={`${josephinBold.className} text-xl mt-4`}>
        {type === "offer" ? "Your" : `${name}'s`} balance:{" "}
        {balance.toLocaleString()}
      </p>
      <div className={`flex w-full items-center gap-x-3`}>
        {[10, 25, 50, 75, 100].map((num: number, index: number) => (
          <button
            key={index}
            className={`
            border w-24 p-2 rounded-full
            ${
              percent === num
                ? type === "offer"
                  ? "border-red-700"
                  : "border-green-700"
                : "border-white"
            }
          `}
            onClick={() => {
              setPercent(num);
              if (type === "offer") {
                updateOffer("offer", { amount: (balance * num) / 100 });
              } else {
                updateOffer("request", { amount: (balance * num) / 100 });
              }
            }}
          >
            {num}%
          </button>
        ))}
      </div>
      <div className={`relative`}>
        <FaDollarSign
          className={`absolute left-1 top-1/2 transform -translate-y-1/2 text-4xl ${
            type === "offer" ? "text-red-700" : "text-green-700"
          }`}
        />
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder={`${type === "offer" ? "Offer" : "Request"} Amount`}
          onWheel={(e) => e.currentTarget.blur()}
          onKeyDown={(e) => {
            if (e.key === "." || e.key.toLowerCase() === "e") {
              e.preventDefault();
            }
          }}
          className={`${josephinBold.className} bg-black text-white border rounded py-6 w-full pl-10 text-sm`}
        />
      </div>
    </div>
  );
};

export default Amount;
