import { josephinNormal } from "@/components/ui/fonts";
import { Property } from "@/types/schema";
import Image from "next/image";

const RailroadCard = ({ property }: { property: Property }) => {
  return (
    <>
      <header
        className={`flex flex-col items-center justify-center w-full h-1/2`}
      >
        <div className={`h-2/3 pt-4`}>
          <Image src="/railroad.png" alt="railroad" width={100} height={100} />
        </div>
        <h1
          className={`text-black text-center uppercase px-1 h-16 pt-2 flex items-start justify-center text-lg`}
        >
          {property.name}
        </h1>
      </header>
      <section
        className={`flex flex-col text-sm space-y-1 pt-1 ${josephinNormal.className}`}
      >
        {property.rentPrices.map((rent: number, index: number) => (
          <div key={index} className={`flex justify-between items-center`}>
            <p>{index === 0 ? "RENT" : `If ${index + 1} are owned`}</p>
            <p className={`text-end`}>${rent}</p>
          </div>
        ))}
      </section>
      <div className={`text-cener text-sm pt-4`}>Mortgage Value $100</div>
    </>
  );
};

export default RailroadCard;
