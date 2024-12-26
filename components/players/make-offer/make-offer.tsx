import { JSX, useState } from "react";
import { josephinNormal } from "../../ui/fonts";
import { Offer, OfferNoID, Player } from "@/types/schema";
import Amount from "./amount";
import Properties from "./properties";
import Immunity from "./immunity";

const newOffer = (
  fromPlayerId: string,
  roomId: string,
  toPlayerId: string
): OfferNoID => ({
  roomId,
  status: "PENDING",
  fromPlayerId,
  toPlayerId,
  offer: {
    properties: [],
    amount: 0,
    immunity: [],
  },
  request: {
    properties: [],
    amount: 0,
    immunity: [],
  },
  note: "",
  createdAt: new Date(),
  updatedAt: new Date(),
});

const MakeOffer = ({
  player,
  currentPlayer,
  roomId,
}: {
  player: Player;
  roomId: string;
  currentPlayer: Player;
}) => {
  const [offer, setOffer] = useState<OfferNoID>(() =>
    newOffer(currentPlayer?.id, roomId, player?.id)
  );
  const [view, setView] = useState<
    | "offer_amount"
    | "request_amount"
    | "offer_properties"
    | "request_properties"
    | "offer_immunity"
    | "request_immunity"
    | null
  >(null);

  const updateOffer = <K extends keyof OfferNoID>(
    key: K,
    value: Partial<OfferNoID[K]>
  ) => {
    setOffer((prev) => {
      if (!prev) return null;

      const currentField = prev[key] || {};
      if (typeof currentField === "object" && !Array.isArray(currentField)) {
        return {
          ...prev,
          [key]: {
            ...currentField,
            ...value,
          },
        };
      }

      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const viewComponents: { [key: string]: JSX.Element } = {
    offer_amount: <Amount offer={offer} updateOffer={updateOffer} />,
    offer_properties: <Properties offer={offer} updateOffer={updateOffer} />,
    offer_immunity: <Immunity offer={offer} updateOffer={updateOffer} />,
    request_amount: <Amount offer={offer} updateOffer={updateOffer} />,
    request_properties: <Properties offer={offer} updateOffer={updateOffer} />,
    request_immunity: <Immunity offer={offer} updateOffer={updateOffer} />,
  };

  return (
    <>
      <section className={`${josephinNormal.className} w-full px-2`}>
        {view ? (
          <>
            <button
              className={`border p-3 rounded w-full ${josephinNormal.className}`}
              onClick={() => setView(null)}
            >
              Back
            </button>
            {viewComponents[view]}
          </>
        ) : (
          <>
            <div
              className={`flex w-full items-center justify-between mt-2 px-3`}
            >
              <h1 className={`text-2xl`}>I&apos;m offering</h1>
              <div className={`flex flex-col gap-y-3`}>
                <button
                  className={` border border-white p-3 rounded-full`}
                  onClick={() => setView("offer_amount")}
                >
                  Cash
                </button>
                <button
                  onClick={() => setView("offer_properties")}
                  className={` border border-white p-3 rounded-full`}
                >
                  Properties
                </button>
                <button
                  onClick={() => setView("offer_immunity")}
                  className={` border border-white p-3 rounded-full`}
                >
                  Immunity
                </button>
              </div>
            </div>
            <hr className={`my-4`} />
            <div
              className={`flex w-full items-center justify-between mt-2 px-3`}
            >
              <h2 className={`text-2xl`}>I Would Like</h2>
              <div className={`flex flex-col gap-y-3`}>
                <button
                  onClick={() => setView("request_amount")}
                  className={` border border-white p-3 rounded-full`}
                >
                  Cash
                </button>
                <button
                  className={` border border-white p-3 rounded-full`}
                  onClick={() => setView("request_properties")}
                >
                  Properties
                </button>
                <button
                  onClick={() => setView("request_immunity")}
                  className={` border border-white p-3 rounded-full`}
                >
                  Immunity
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default MakeOffer;
