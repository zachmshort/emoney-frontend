import { Player, Property } from "@/types/schema";
import { useState } from "react";
import Image from "next/image";
import { MdArrowBackIos } from "react-icons/md";
import { josephinBold } from "../ui/fonts";
import { calculateRent } from "../ui/helper-funcs";
import { toast } from "sonner";
import { DrawerClose } from "../ui/drawer";

interface PayRequestRentProps {
  properties?: Property[];
  type: "SEND" | "REQUEST";
  fromPlayer: Player;
  toPlayer: Player;
  onTransferRequest: (
    amount: number,
    reason: string,
    transferDetails: {
      fromPlayerId: string;
      toPlayerId: string;
    },
    roomId: string
  ) => void;
  roomId: string;
}
interface TransactionDetails {
  amount: number;
  reason: string;
  property: Property;
}
const PayRequestRent = ({
  properties = [],
  type,
  fromPlayer,
  roomId,
  toPlayer,
  onTransferRequest,
}: PayRequestRentProps) => {
  const [currentView, setCurrentView] = useState<
    "colors" | "properties" | "confirmation"
  >("colors");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [transactionDetails, setTransactionDetails] =
    useState<TransactionDetails | null>(null);

  if (!properties || properties.length === 0) {
    return (
      <div className="flex items-start justify-center h-full">
        <p className={`text-sm ${josephinBold.className} text-white`}>
          {type === "REQUEST"
            ? `You don't have any properties to request rent for`
            : `${toPlayer.name} doesn't have any properties to pay rent for`}
        </p>
      </div>
    );
  }

  const handlePropertySelect = (property: Property) => {
    const { amount, reason } = calculateRent(property, properties);

    if (amount === 0) {
      toast.error(reason);
      return;
    }

    const payingPlayer = type === "SEND" ? fromPlayer : toPlayer;
    if (payingPlayer.balance < amount) {
      toast.error(
        `${payingPlayer.name} doesn't have sufficient funds (${amount})`
      );
      return;
    }

    setTransactionDetails({
      amount,
      reason,
      property,
    });
    setCurrentView("confirmation");
  };

  const handleConfirmTransaction = () => {
    if (!transactionDetails) return;

    const transferDetails = {
      fromPlayerId: type === "SEND" ? fromPlayer.id : toPlayer.id,
      toPlayerId: type === "SEND" ? toPlayer.id : fromPlayer.id,
    };

    const formattedReason = `${transactionDetails.reason}`;

    onTransferRequest(
      transactionDetails.amount,
      formattedReason,
      transferDetails,
      roomId
    );
  };

  const getUpdatedBalances = () => {
    if (!transactionDetails) return null;

    const payingPlayer = type === "SEND" ? fromPlayer : toPlayer;
    const receivingPlayer = type === "SEND" ? toPlayer : fromPlayer;

    return {
      payingBalance: payingPlayer.balance - transactionDetails.amount,
      receivingBalance: receivingPlayer.balance + transactionDetails.amount,
      payingPlayerName: payingPlayer.name,
      receivingPlayerName: receivingPlayer.name,
    };
  };

  const handleBack = () => {
    if (currentView === "confirmation") {
      setCurrentView("properties");
      setTransactionDetails(null);
    } else if (currentView === "properties") {
      setCurrentView("colors");
      setSelectedGroup(null);
    }
  };

  const groupedProperties = Object.entries(
    properties.reduce((acc, property) => {
      if (!acc[property.group]) {
        acc[property.group] = [];
      }
      acc[property.group].push(property);
      return acc;
    }, {} as Record<string, Property[]>)
  );

  const PrefetchImages = ({ group }: { group: string }) => {
    const images = groupedProperties
      .find(([g]) => g === group)?.[1]
      .map((property) => property.images[0]);

    return (
      <>
        {images?.map((image) => (
          <link
            key={image}
            rel="prefetch"
            href={`/property-images/${image}.png`}
            as="image"
          />
        ))}
      </>
    );
  };

  const balances = getUpdatedBalances();

  const renderConfirmationView = () => {
    if (!transactionDetails || !balances) return null;

    return (
      <>
        <h1
          className="flex items-center justify-start mb-6"
          onClick={handleBack}
        >
          <MdArrowBackIos />
          <div>Back</div>
        </h1>
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl">Confirm Transaction</h2>
            <div className="bg-gray-800 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span>Amount:</span>
                <span className="text-xl">${transactionDetails.amount}</span>
              </div>
              <div className="text-sm opacity-80">
                {transactionDetails.reason}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg">Updated Balances</h3>
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span>{balances.payingPlayerName}</span>
                <span className="text-red-400">${balances.payingBalance}</span>
              </div>
              <div className="flex justify-between">
                <span>{balances.receivingPlayerName}</span>
                <span className="text-green-400">
                  ${balances.receivingBalance}
                </span>
              </div>
            </div>
          </div>

          <DrawerClose className="w-full">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg mt-4"
              onClick={handleConfirmTransaction}
            >
              Confirm {type === "SEND" ? "Payment" : "Request"}
            </button>
          </DrawerClose>
        </div>
      </>
    );
  };

  return (
    <div className={`space-y-4 text-2xl ml-2 mt-2 ${josephinBold.className}`}>
      {hoveredGroup && <PrefetchImages group={hoveredGroup} />}

      {currentView === "confirmation" ? (
        renderConfirmationView()
      ) : currentView === "properties" ? (
        <>
          <h1 className="flex items-center justify-start" onClick={handleBack}>
            <MdArrowBackIos />
            <div>Back</div>
          </h1>
          <div className="overflow-x-auto flex gap-4">
            {groupedProperties
              .find(([group]) => group === selectedGroup)?.[1]
              .map((property) => (
                <div
                  key={property.id}
                  className={`flex-shrink-0 cursor-pointer ${
                    property.isMortgaged ? "opacity-50" : ""
                  }`}
                  onClick={() => handlePropertySelect(property)}
                >
                  <Image
                    src={`/property-images/${property.images[0]}.png`}
                    alt={property.images[0]}
                    width={200}
                    height={300}
                    className="rounded"
                    priority
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1">
                    {property.isMortgaged && (
                      <div className="text-red-500 text-sm">Mortgaged</div>
                    )}
                    {property.houses > 0 && (
                      <div className="text-green-500 text-sm">
                        {property.houses} House{property.houses > 1 ? "s" : ""}
                      </div>
                    )}
                    {property.hotel > 0 && (
                      <div className="text-blue-500 text-sm">Hotel</div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <>
          <h2>Select a Color</h2>
          <div className="grid grid-cols-4 sm:grid-cols-10 gap-2">
            {groupedProperties.map(([group, props]) => (
              <button
                key={group}
                className="p-2 rounded mb-2 border aspect-square w-full"
                style={{ backgroundColor: props[0].color }}
                onClick={() => {
                  setSelectedGroup(group);
                  setCurrentView("properties");
                }}
                onMouseEnter={() => setHoveredGroup(group)}
                onMouseLeave={() => setHoveredGroup(null)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PayRequestRent;
