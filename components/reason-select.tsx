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

const reasons = [
  { name: "Transfer", value: "transfer" },
  { name: "Rent", value: "rent" },
  { name: "Tax", value: "tax" },
  { name: "Chance", value: "chance" },
  { name: "Fine", value: "fine" },
  { name: "Reward", value: "reward" },
];

export function ReasonSelect() {
  const [selectedReason, setSelectedReason] = useState({ name: "", value: "" });

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          className={`border p-4 bg-inherit rounded-lg text-2xl w-full border-neutral-400 ${sulpherBold.className} shadow-md text-black  mb-4`}
        >
          {!selectedReason.name ? (
            <div className={`text-slate-400 text-start`}>Select Reason</div>
          ) : (
            <div className={`flex items-center justify-start gap-x-3`}>
              {selectedReason.name}
            </div>
          )}
        </button>
      </DrawerTrigger>
      <DrawerContent
        className={`${sulpherBold.className} bg-black text-white h-[70vh]`}
      >
        <DrawerHeader>
          <DrawerTitle>Select Reason</DrawerTitle>
          <div className={`flex flex-col gap-y-4 mt-4`}>
            {reasons.map((reason, index) => (
              <DrawerClose
                className={`flex items-center justify-start gap-x-3`}
                key={index}
                onClick={() => {
                  setSelectedReason(reason);
                }}
              >
                <div className={`text-2xl`}>{reason.name}</div>
              </DrawerClose>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
