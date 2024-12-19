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
  { name: "Dark Blue", value: "bg-blue-700" },
  { name: "Grey", value: "bg-neutral-500" },
  { name: "Green", value: "bg-emerald-300" },
  { name: "Light Blue", value: "bg-sky-400" },
  { name: "Purple", value: "bg-violet-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Red", value: "bg-red-500" },
  { name: "Pink", value: "bg-pink-500" },
  { name: "Yellow", value: "bg-yellow-500" },
];

export function ColorSelect() {
  const [color, setColor] = useState({ name: "", value: "" });
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          className={`w-64 p-4 border rounded-lg text-2xl text-start mt-4`}
        >
          {!color.name ? (
            <div className={`text-slate-400`}>Select Color</div>
          ) : (
            <div className={`flex items-center justify-start gap-x-3`}>
              <div className={`w-3 h-3 rounded-full ${color.value}`}></div>
              {color.name}
            </div>
          )}
        </button>
      </DrawerTrigger>
      <DrawerContent
        className={`${sulpherBold.className} bg-black text-white h-[70vh]  `}
      >
        <DrawerHeader>
          <DrawerTitle className={`text-black`}>Select Color</DrawerTitle>
          <div className={`flex flex-col items-evenly gap-y-4 justify-center`}>
            {colors.map((color: any, index: number) => (
              <DrawerClose
                className={`flex items-center justify-start gap-x-3`}
                key={index}
                onClick={() => {
                  setColor(color);
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
