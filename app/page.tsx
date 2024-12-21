import { sulpherBold } from "@/components/fonts";
import Logo from "@/components/logo";
import Link from "next/link";

const MonopolyPage = () => {
  return (
    <>
      <div className={`relative h-screen`}>
        <Logo />
        <div
          className={`${sulpherBold.className} flex flex-col items-center justify-center gap-y-5 h-full `}
        >
          <Link
            href="/join"
            prefetch={true}
            className={`border font rounded-lg p-4 border-yellow-200 w-64  text-black text-2xl`}
          >
            Join Room
          </Link>
          <Link
            href={`/create`}
            className={`border font rounded-lg p-4 border-yellow-200 w-64  text-black text-2xl`}
          >
            Create Room
          </Link>
        </div>
      </div>
    </>
  );
};

export default MonopolyPage;
