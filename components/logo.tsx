import Link from "next/link";
import { sulpherLight } from "./fonts";

const Logo = () => {
  return (
    <>
      <Link href="/monopoly">
        <h1
          className={`${sulpherLight.className} fixed top-1 left-1 font-light`}
        >
          E-Money
        </h1>
      </Link>
    </>
  );
};

export default Logo;
