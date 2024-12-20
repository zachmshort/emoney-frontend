"use client";
import { useState } from "react";
import ThreeScene from "@/components/three-scene";
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <main style={{ position: "relative", height: "100vh", width: "100%" }}>
        {loading && (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        )}
        <Link href="/">
          <ThreeScene objToRender="monopoly" setLoading={setLoading} />
        </Link>
      </main>
    </>
  );
}
