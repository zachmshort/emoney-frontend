import { josephinNormal } from "@/components/ui/fonts";
import { Property } from "@/types/schema";
import Image from "next/image";

const UtilityCard = ({ property }: { property: Property }) => {
  const src = property.name.toLowerCase().replace(" ", "-");
  return (
    <>
      <header
        className={`flex flex-col items-center justify-center w-full h-1/2`}
      >
        <div className={`h-2/3 pt-4`}>
          <Image src={`/${src}.png`} alt="railroad" width={100} height={100} />
        </div>
        <h1
          className={`text-black text-center uppercase px-1 h-16 pt-8 flex items-start justify-center text-lg`}
        >
          {property.name}
        </h1>
      </header>
      <section className={`text-center text-xs ${josephinNormal.className}`}>
        <div className={`py-5`}>
          <p>If one Utility is owned,</p>
          <p>rent is 4 times amount</p>
          <p>shown on dice.</p>
        </div>
        <div>
          <p>If both Utilities are owned,</p>
          <p>rent is 10 times amount</p>
          <p>shown on dice.</p>
        </div>
      </section>
    </>
  );
};

export default UtilityCard;
