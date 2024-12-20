import Image from "next/image";

const PropertiesForSale = () => {
  return (
    <>
      <div className="w-16 h-16 relative">
        <Image
          src="/property-images/baltic-avenue-front.png"
          alt="Properties for Sale"
          className={`object-contain`}
          fill
        />
      </div>
    </>
  );
};

export default PropertiesForSale;
