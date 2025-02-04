import CustomLink from "@/components/ui/cusotm-link";
import CustomButton from "@/components/ui/button-link";
import InstallButton from "@/components/ui/install-app-button";
import Link from "next/link";
import { IoDiceOutline } from "react-icons/io5";
import { GrHelpBook } from "react-icons/gr";

const MonopolyPage = () => {
  return (
    <>
      <div className={`relative h-screen`}>
        <CustomLink href="/" text="E-Money" className="top-2 left-2" />
        <Link href={`/help`}>
          <GrHelpBook
            className={`top-[.6rem] right-10 absolute color text-[1.4rem] leading-3`}
          />
        </Link>
        <Link href={`/my-rooms`}>
          <IoDiceOutline className={`top-2 right-2 absolute color text-2xl`} />
        </Link>
        <InstallButton className="top-2 right-[4.4rem] absolute" />
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
