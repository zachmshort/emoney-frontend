"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MdOutlineInstallDesktop,
  MdOutlineInstallMobile,
} from "react-icons/md";

const FloatingInstallButton = ({ className }: { className?: string }) => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone) {
    return null;
  }

  return (
    <Link href="/install" className={`${className}`}>
      <MdOutlineInstallMobile className={`block sm:hidden color text-2xl`} />
      <MdOutlineInstallDesktop className={`hidden sm:block color text-2xl`} />
    </Link>
  );
};

export default FloatingInstallButton;
