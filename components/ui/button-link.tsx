import Link from "next/link";
import { josephinBold } from "./fonts";

const ButtonLink = ({ text, href = "" }: { text: string; href?: string }) => {
  return (
    <>
      <Link
        href={`${href}`}
        className={`border ${josephinBold.className} font rounded-lg px-4 py-5 border-yellow-200 w-64  text-2xl`}
      >
        {text}
      </Link>
    </>
  );
};

export default ButtonLink;
