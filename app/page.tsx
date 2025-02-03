import CustomLink from "@/components/ui/cusotm-link";
import CustomButton from "@/components/ui/button-link";
// import { josephinBold } from "@/components/ui/fonts";
import InstallButton from "@/components/ui/install-app-button";
import Link from "next/link";
import { josephinLight, josephinNormal } from "@/components/ui/fonts";

const MonopolyPage = () => {
  return (
    <>
      <div className={`relative h-screen`}>
        <CustomLink href="/" text="E-Money" className="top-2 left-2" />
        <Link
          href="/my-rooms"
          className={` ${josephinNormal.className} text-xl top-2 right-1/2 transform translate-x-1/2 color absolute`}
        >
          My Rooms
        </Link>
        <InstallButton className="top-2 right-2 absolute" />
        <div
          className={`
           
            flex flex-col items-center justify-center gap-y-4 h-full `}
        >
          <CustomButton href="/join" text="Join Room" />
          <CustomButton href="/create" text="Create Room" />
        </div>
      </div>
    </>
  );
};

export default MonopolyPage;
