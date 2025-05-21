"use client";
import { ButtonHTMLAttributes } from "react";
import { josephinBold } from "./fonts";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

const Button = ({ className = "", ...props }: ButtonProps) => {
  return (
    <button
      className={`border font rounded-sm px-4 py-5 border-yellow-200 w-64 text-2xl ${josephinBold.className} ${className}`}
      {...props}
    />
  );
};

export default Button;
