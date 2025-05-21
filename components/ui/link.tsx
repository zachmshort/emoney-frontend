import NextLink, {LinkProps} from "next/link"

import { josephinBold } from "./fonts";
import { AnchorHTMLAttributes } from "react";

type ButtonLinkProps = LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    className?: string;
    children?: React.ReactNode;
  };

const Link = ({
  className = "",
  children,
  ...props
}: ButtonLinkProps) => {
  return (
    <NextLink
      {...props}
      className={`border  font rounded-lg px-4 py-5 border-yellow-200 w-64 text-2xl ${josephinBold.className} ${className}`}
    >
      {children}
    </NextLink>
  );
};

export default Link;
