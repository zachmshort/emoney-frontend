import Link from "next/link";
import { sulpherLight } from "./fonts";

const Logo = () => {
  return (
    <>
      <Link href="/">
        <div
          className={`${sulpherLight.className} fixed top-1 left-1 font-light font`}
        >
          E-Money
        </div>
      </Link>
    </>
  );
};

export default Logo;
