import Image from "next/image";

const FreeParking = () => {
  return (
    <div className={`h-16 w-16 relative`}>
      <Image
        src="/free-parking.png"
        alt="free-parking-image"
        fill
        className={`object-contain`}
      />
    </div>
  );
};

export default FreeParking;
