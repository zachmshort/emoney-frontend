import { Property } from "@/types/schema";
import { josephinBold, josephinLight, josephinNormal } from "../../ui/fonts";
import Image from "next/image";

const CommonPropertyCard = ({ property }: { property: Property }) => {
  return (
    <>
      <header
        className={`h-20 border border-black`}
        style={{ backgroundColor: property.color }}
      >
        <div className={`h-4 flex items-start justify-center w-full`}>
          {property.developmentLevel < 1 ? (
            <h1 className={`text-black text-center  text-[.5rem]`}>
              TITLE DEED
            </h1>
          ) : (
            <div className={``}>
              {property.developmentLevel > 0 &&
                property.developmentLevel < 5 && (
                  <div className="flex gap-1 pt-1">
                    {Array.from({
                      length: property.developmentLevel,
                    }).map((_, index) => (
                      <div key={index}>
                        <Image
                          src="/house.png"
                          width={20}
                          height={20}
                          alt="house"
                        />
                      </div>
                    ))}
                  </div>
                )}

              <div className={`pt-[.2rem]`}>
                {property.developmentLevel === 5 && (
                  <Image src="/hotel.png" width={20} height={20} alt="house" />
                )}
              </div>
            </div>
          )}
        </div>

        <h2
          className={`text-black text-center pt-4 uppercase px-1 flex items-start justify-center text-[1rem] leading-6`}
        >
          {property.name}
        </h2>
      </header>
      <section className={`px-4 text-xs ${josephinNormal.className}`}>
        <h3 className={`pt-3 pb-1 text-center ${josephinBold.className}`}>
          RENT ${property.rentPrices[0]}
        </h3>
        <div
          className={`flex flex-col items-even space-y-[.1rem] justify-center`}
        >
          {["1", "2", "3", "4"].map((house: string, index: number) => (
            <div key={index} className={`flex justify-between  w-full`}>
              <p className={`text-start`}>
                With {house} House{index !== 0 && "s"}
              </p>
              <p className={`text-end`}>${property.rentPrices[index + 1]}</p>
            </div>
          ))}
          <div className={`flex justify-between w-full`}>
            <p>With HOTEL</p>
            <p>${property.rentPrices[5]}</p>
          </div>
        </div>
        <div className={`text-center`}>
          <p className={`pt-2 pb-1`}>Mortgage Value ${property.price / 2}</p>
          <p>Houses Cost ${property.houseCost} each</p>
          <p>Hotels, ${property.houseCost} each</p>
          <p>plus 4 houses</p>
        </div>
      </section>
      <div
        className={`text-[.5rem] leading-3 ${josephinLight.className} text-center w-full absolute bottom-2`}
      >
        <p>If a player own all of the sites of any colour group,</p>
        <p>the rent is doubled on unimproved sites in that group.</p>
      </div>
    </>
  );
};

export default CommonPropertyCard;
