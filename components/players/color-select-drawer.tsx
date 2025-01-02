"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { sulpherBold } from "@/components/ui/fonts";
import { useState } from "react";

const colors = [
  // Blues
  { hex: "#93c5fd" }, // Blue 300
  { hex: "#60a5fa" }, // Blue 400
  { hex: "#3b82f6" }, // Blue 500
  { hex: "#2563eb" }, // Blue 600
  { hex: "#1d4ed8" }, // Blue 700

  // Greens
  { hex: "#6ee7b7" }, // Teal 300
  { hex: "#2dd4bf" }, // Teal 400
  { hex: "#4ade80" }, // Green 400
  { hex: "#22c55e" }, // Green 500
  { hex: "#16a34a" }, // Green 600

  // Yellows and Oranges
  { hex: "#fde047" }, // Yellow 300
  { hex: "#fbbf24" }, // Yellow 400
  { hex: "#eab308" }, // Amber 500
  { hex: "#f59e0b" }, // Amber 400
  { hex: "#fb923c" }, // Orange 400

  // Reds and Pinks
  { hex: "#f87171" }, // Red 400
  { hex: "#ef4444" }, // Red 500
  { hex: "#f43f5e" }, // Rose 500
  { hex: "#ec4899" }, // Pink 500
  { hex: "#b91c1c" }, // Red 700

  // Purples
  { hex: "#c084fc" }, // Purple 300
  { hex: "#a78bfa" }, // Violet 400
  { hex: "#8b5cf6" }, // Violet 500
  { hex: "#d946ef" }, // Fuchsia 500
  { hex: "#6d28d9" }, // Violet 700

  // Browns and Auburns
  { hex: "#d97706" }, // Amber Brown 300
  { hex: "#bb764c" }, // Copper Brown 400
  { hex: "#a05a2c" }, // Auburn 500
  { hex: "#b45309" }, // Brown 600
  { hex: "#92400e" }, // Brown 700

  // Dark Shades
  { hex: "#6b7280" }, // Neutral Gray 500
  { hex: "#4b5563" }, // Slate 600
  { hex: "#374151" }, // Cool Gray 700
  { hex: "#1f2937" }, // Gray 800
  { hex: "#111827" }, // Black 900
];

interface ColorSelectProps {
  onColorSelect: (color: string) => void;
}

export function ColorSelect({ onColorSelect }: ColorSelectProps) {
  const [selectedColor, setSelectedColor] = useState<{
    hex: string;
  } | null>(null);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          className={`w-64 p-4 border rounded text-2xl text-start mt-4 `}
          style={{ backgroundColor: selectedColor?.hex || "#000" }}
        >
          {!selectedColor ? (
            <div className={`text-slate-400`}>Select Color</div>
          ) : (
            <div className={`h-8`}></div>
          )}
        </button>
      </DrawerTrigger>
      <DrawerContent
        className={`${sulpherBold.className} bg-black text-white h-full overflow-y-auto  px-2`}
      >
        <DrawerHeader>
          <DrawerTitle className={`hidden`}>Select Color</DrawerTitle>
        </DrawerHeader>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {colors.map((color, index) => (
            <DrawerClose
              className="p-1 rounded border aspect-square w-full"
              style={{ backgroundColor: color.hex }}
              key={index}
              onClick={() => {
                setSelectedColor(color);
                onColorSelect(color.hex);
              }}
            />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
