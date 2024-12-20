"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { sulpherBold } from "./fonts";
import { useState } from "react";

const colors = [
  { name: "Dark Blue", value: "bg-blue-700", hex: "#1d4ed8" },
  { name: "Grey", value: "bg-neutral-500", hex: "#737373" },
  { name: "Green", value: "bg-emerald-300", hex: "#6ee7b7" },
  { name: "Light Blue", value: "bg-sky-400", hex: "#38bdf8" },
  { name: "Purple", value: "bg-violet-500", hex: "#8b5cf6" },
  { name: "Orange", value: "bg-orange-500", hex: "#f97316" },
  { name: "Red", value: "bg-red-500", hex: "#ef4444" },
  { name: "Pink", value: "bg-pink-500", hex: "#ec4899" },
  { name: "Yellow", value: "bg-yellow-500", hex: "#eab308" },
];

interface ColorSelectProps {
  onColorSelect: (color: string) => void;
}

export function ColorSelect({ onColorSelect }: ColorSelectProps) {
  const [selectedColor, setSelectedColor] = useState<{
    name: string;
    value: string;
    hex: string;
  } | null>(null);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          className={`w-64 p-4 border rounded-lg text-2xl text-start mt-4`}
        >
          {!selectedColor ? (
            <div className={`text-slate-400`}>Select Color</div>
          ) : (
            <div className={`flex items-center justify-start gap-x-3`}>
              <div
                className={`w-3 h-3 rounded-full ${selectedColor.value}`}
              ></div>
              {selectedColor.name}
            </div>
          )}
        </button>
      </DrawerTrigger>
      <DrawerContent
        className={`${sulpherBold.className} bg-black text-white h-[70vh]`}
      >
        <DrawerHeader>
          <DrawerTitle className={`text-black`}>Select Color</DrawerTitle>
          <div className={`flex flex-col items-evenly gap-y-4 justify-center`}>
            {colors.map((color, index) => (
              <DrawerClose
                className={`flex items-center justify-start gap-x-3`}
                key={index}
                onClick={() => {
                  setSelectedColor(color);
                  onColorSelect(color.hex);
                }}
              >
                <div className={`w-3 h-3 rounded-full ${color.value}`}></div>
                <div className={`text-2xl`}>{color.name}</div>
              </DrawerClose>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
