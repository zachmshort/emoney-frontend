"use client";
import { useCallback } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { sulpherBold } from "../fonts";

interface CounterProps {
  title: string;
  subtitle: string;
  value: number;
  onChange: (value: number) => void;
  maximum: number;
}

const Counter: React.FC<CounterProps> = ({
  title,
  subtitle,
  value,
  onChange,
  maximum,
}) => {
  const onAdd = useCallback(() => {
    if (value === maximum) {
    } else {
      onChange(value + 1);
    }
  }, [onChange, value]);

  const onReduce = useCallback(() => {
    if (value === 0) {
      return;
    }

    onChange(value - 1);
  }, [onChange, value]);

  return (
    <div
      className={`${sulpherBold.className} flex flex-row items-center justify-between`}
    >
      <div className="flex flex-col">
        <div className="font-light text-black">{title}</div>
        <div className="font-light text-gray-600">{subtitle}</div>
      </div>
      <div className="flex flex-row items-center gap-4 mb-2">
        <div
          onClick={onReduce}
          className="
            w-10
            h-10
            rounded-full
            border-[1px]
            !border-gray-600
            flex
            items-center
            justify-center
            cursor-pointer
            hover:opacity-80
            transition
            text-black
            shadow-sm
          "
        >
          <AiOutlineMinus />
        </div>
        <div
          className="
            font-extralight
            text-xl
            text-black
          "
        >
          {value}
        </div>
        <div
          onClick={onAdd}
          className="
            w-10
            h-10
            rounded-full
            border-[1px]
            !border-gray-600
            flex
            text-black
            items-center
            justify-center
            cursor-pointer
            hover:opacity-80
            transition
            shadow-sm
          "
        >
          <AiOutlinePlus />
        </div>
      </div>
    </div>
  );
};

export default Counter;
