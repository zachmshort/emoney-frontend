import Link from "next/link";
import { josephinLight } from "./fonts";

const CustomLink = ({
  text,
  href,
  className,
}: {
  text: string;
  href: string;
  className?: string;
}) => {
  return (
    <>
      <Link href={`${href}`}>
        <div
          className={`${josephinLight.className} fixed font text-xl ${className}`}
        >
          {text}
        </div>
      </Link>
    </>
  );
};

export default CustomLink;
