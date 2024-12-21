import Link from "next/link";
import { sulpherLight } from "./fonts";

const Logo = () => {
  return (
    <>
      <Link href="/">
        <div
          className={`${sulpherLight.className} fixed top-2 left-2 font text-xl`}
        >
          E-Money
        </div>
      </Link>
    </>
  );
};

export default Logo;
