import { sulpherBold, sulpherLight } from "@/components/fonts";
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
            href="/monopoly/join"
            prefetch={true}
            className={`border p-4 rounded-full w-64 text-xl text-center`}
          >
            Join Room
          </Link>
          <Link
            href={`/monopoly/create`}
            className={`border p-4 rounded-full w-64 text-xl text-center`}
          >
            Create Room
          </Link>
        </div>
      </div>
    </>
  );
};

export default MonopolyPage;
