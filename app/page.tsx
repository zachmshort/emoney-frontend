import CustomLink from "@/components/ui/cusotm-link";
import CustomButton from "@/components/ui/button-link";
import { josephinBold } from "@/components/ui/fonts";

const MonopolyPage = () => {
  return (
    <>
      <div className={`relative h-screen`}>
        <CustomLink href="/" text="E-Money" className="top-2 left-2" />
        <CustomLink
          href="/install"
          text="Install App"
          className="top-2 right-2"
        />
        <div
          className={`${josephinBold.className} flex flex-col items-center justify-center gap-y-4 h-full `}
        >
          <CustomButton href="/join" text="Join Room" />
          <CustomButton href="/create" text="Create Room" />
        </div>
      </div>
    </>
  );
};

export default MonopolyPage;
