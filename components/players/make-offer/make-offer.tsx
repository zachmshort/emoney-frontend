"use client";
import { JSX, useState } from "react";
import { josephinBold, josephinNormal } from "@/components/ui/fonts";
import { OfferNoID, Player } from "@/types/schema";
import Amount from "./amount";
import Properties from "./properties";
// import Immunity from "./immunity";

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
    // immunity: [],
  },
  request: {
    properties: [],
    amount: 0,
    // immunity: [],
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
    // | "offer_immunity"
    // | "request_immunity"
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
    offer_amount: (
      <Amount
        offer={offer}
        updateOffer={updateOffer}
        type={"offer"}
        balance={currentPlayer.balance}
      />
    ),
    offer_properties: (
      <Properties
        offer={offer}
        updateOffer={updateOffer}
        properties={currentPlayer?.properties}
        type="offer"
      />
    ),
    // offer_immunity: (
    //   <Immunity
    //   // properties={player?.properties}
    //   // offer={offer}
    //   // updateOffer={updateOffer}
    //   />
    // ),
    request_amount: (
      <Amount
        offer={offer}
        updateOffer={updateOffer}
        type="request"
        name={player.name}
        balance={player.balance}
      />
    ),
    request_properties: (
      <Properties
        properties={player?.properties}
        offer={offer}
        updateOffer={updateOffer}
        type="request"
      />
    ),
    // request_immunity: (
    //   <Immunity
    //   // properties={player?.properties}
    //   // offer={offer}
    //   // updateOffer={updateOffer}
    //   />
    // ),
  };
  console.log(offer.request.properties);
  console.log(offer.offer.properties);
  return (
    <>
      <section className={`${josephinNormal.className} w-full px-2`}>
        {view ? (
          <>
            <button
              className={`border py-4 rounded w-full mt-5 text-2xl ${josephinBold.className}`}
              onClick={() => setView(null)}
            >
              Back
            </button>
            {viewComponents[view]}
          </>
        ) : (
          <>
            <header>
              <p
                className={`${josephinBold.className} text-center text-2xl pt-5 px-2`}
              >
                Make an Offer
              </p>
            </header>
            <div
              className={`flex w-full items-center justify-between mt-2 px-3`}
            >
              <h1 className={`text-2xl`}>I&apos;m offering</h1>
              <div className={`flex flex-col gap-y-3`}>
                <button
                  className={` border 
                  ${!offer?.offer?.amount ? "border-white" : `border-red-700`}
                     w-48 p-3 rounded-md`}
                  onClick={() => setView("offer_amount")}
                >
                  {!offer?.offer?.amount ? "Cash" : `$${offer?.offer?.amount}`}
                </button>
                <button
                  onClick={() => setView("offer_properties")}
                  className={` border border-white p-3 rounded-md
                  ${
                    offer?.offer?.properties.length === 0
                      ? "border-white"
                      : `border-red-700`
                  }
                    p-3 rounded-md`}
                >
                  {offer.offer.properties.length > 0 &&
                    offer.offer.properties.length}{" "}
                  Properties
                </button>
                {/* <button
                  onClick={() => setView("offer_immunity")}
                  className={` border border-white p-3 rounded-md`}
                >
                  Immunity
                </button> */}
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
                  className={`
                   
                  ${
                    !offer?.request?.amount
                      ? "border-white"
                      : `border-green-700`
                  }
                   
                    border p-3 rounded-md w-48`}
                >
                  {!offer?.request?.amount
                    ? "Cash"
                    : `$${offer.request.amount}`}
                </button>
                <button
                  className={` 
                  ${
                    offer?.request?.properties.length === 0
                      ? "border-white"
                      : `border-green-700`
                  }
                    border p-3 rounded-md`}
                  onClick={() => setView("request_properties")}
                >
                  {offer.request.properties.length > 0 &&
                    offer.request.properties.length}{" "}
                  Properties
                </button>
                {/* <button
                  onClick={() => setView("request_immunity")}
                  className={`
                  ${
                    offer?.request?.immunity.length === 0
                      ? "border-white"
                      : `border-green-700`
                  }
                    border border-white p-3 rounded-md`}
                >
                  Immunity
                </button> */}
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default MakeOffer;
