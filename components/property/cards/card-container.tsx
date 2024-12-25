import { josephinBold } from "@/components/ui/fonts";

const PropertyCardContainer = ({
  onClick,
  className,
  children,
}: {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <button
        className={`bg-white border p-4 text-black border-black property-card-aspect-ratio w-64 ${josephinBold.className} ${className}`}
        onClick={onClick}
      >
        <div className={`border border-black h-full p-2 relative`}>
          {children}
        </div>
      </button>
    </>
  );
};

export default PropertyCardContainer;
