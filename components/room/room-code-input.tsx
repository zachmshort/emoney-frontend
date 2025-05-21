import { josephinBold } from "../ui/fonts";
import { InputHTMLAttributes } from "react";

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const BaseRoomInput = ({ className = "", ...props }: BaseInputProps) => {
  return (
    <input
      {...props}
      className={`${josephinBold.className} border p-4 bg-inherit rounded text-2xl w-64 mt-4 ${className}`}
    />
  );
};

