import { Player, Property } from "@/types/schema";
import { useState } from "react";
import Image from "next/image";
import { MdArrowBackIos } from "react-icons/md";
import { josephinBold } from "../fonts";
import { calculateRent } from "../helper-funcs";
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

const PayRequestRent = ({
  properties = [],
  type,
  fromPlayer,
  roomId,
  toPlayer,
  onTransferRequest,
}: PayRequestRentProps) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  if (!properties || properties.length === 0) {
    return (
      <div className="flex items-start justify-center  h-full">
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

    const transferDetails = {
      fromPlayerId: type === "SEND" ? fromPlayer.id : toPlayer.id,
      toPlayerId: type === "SEND" ? toPlayer.id : fromPlayer.id,
    };

    const formattedReason = `${reason} (${
      type === "SEND" ? "Payment to" : "Request from"
    } ${type === "SEND" ? toPlayer.name : fromPlayer.name})`;

    onTransferRequest(amount, formattedReason, transferDetails, roomId);
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

  return (
    <div className={`space-y-4 text-2xl ml-2 mt-2 ${josephinBold.className}`}>
      {hoveredGroup && <PrefetchImages group={hoveredGroup} />}

      {selectedGroup ? (
        <>
          <h1
            className={`flex items-center justify-start`}
            onClick={() => setSelectedGroup(null)}
          >
            <MdArrowBackIos className={``} />
            <div>Back</div>
          </h1>
          <div className="overflow-x-auto flex gap-4">
            {groupedProperties
              .find(([group]) => group === selectedGroup)?.[1]
              .map((property) => (
                <DrawerClose
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
                </DrawerClose>
              ))}
          </div>
        </>
      ) : (
        <>
          <h2 className={``}>Select a Color</h2>
          <div className="grid grid-cols-4 sm:grid-cols-10 gap-2">
            {groupedProperties.map(([group, props]) => (
              <button
                key={group}
                className="p-2 rounded mb-2 border aspect-square w-full"
                style={{ backgroundColor: props[0].color }}
                onClick={() => setSelectedGroup(group)}
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
