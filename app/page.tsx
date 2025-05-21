import CustomLink from "@/components/ui/cusotm-link";
import InstallButton from "@/components/ui/install-app-button";
import { IoDiceOutline } from "react-icons/io5";
import { GrHelpBook } from "react-icons/gr";
import Link from "@/components/ui/link";
import NextLink from "next/link";

const MonopolyPage = () => {
  return (
      <div className={`relative h-screen`}>
        <Header />
        <JoinOrCreateRoom />
      </div>
  );
};

export default MonopolyPage;

const JoinOrCreateRoom = ()=> {
  return (
   <div
          className={`
           
            flex flex-col items-center justify-center gap-y-4 h-full `}
        >
          <Link href="/join">Join Room</Link>
          <Link href="/create">Create Room</Link>
        </div>

  )
}

const Header = ()=> {
  return (
    <>
      <CustomLink href="/" text="E-Money" className="top-2 left-2" />
        <HelpButton />
        <InstallButton className="top-2 right-[4.4rem] absolute" />
        <MyExistingRoomsButton />
</>

  )
}

const MyExistingRoomsButton = ()=> {
  return (
<NextLink href={`/my-rooms`}>
          <IoDiceOutline className={`top-2 right-2 absolute color text-2xl`} />
        </NextLink>

  )
}

const HelpButton = () => { 
return (
 <NextLink href={`/help`}>
          <GrHelpBook
            className={`top-[.6rem] right-10 absolute color text-[1.4rem] leading-3`}
          />
        </NextLink>

)}
