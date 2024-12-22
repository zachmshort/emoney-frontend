"use client";
import CustomLink from "@/components/ui/cusotm-link";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    interface WindowWithMSStream extends Window {
      MSStream?: unknown;
    }

    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as WindowWithMSStream).MSStream
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("App installed successfully");
    }

    setDeferredPrompt(null);
  };

  if (isStandalone) {
    <div className="font flex justify-center items-center h-screen select-none">
      <CustomLink text="E-Money" href="/" className="top-2 left-2" />
      <Link
        href="/"
        className={`border font rounded-lg p-4 border-yellow-200 w-64  text-black text-2xl`}
      >
        Home
      </Link>
    </div>;
  }

  return (
    <div className="font flex flex-col space-y-3 justify-center items-center h-screen select-none">
      <CustomLink text="E-Money" href="/" className="top-2 left-2" />
      {deferredPrompt && (
        <button
          onClick={handleInstallClick}
          className={`border font rounded-lg p-4 border-yellow-200 w-64  text-black text-2xl`}
        >
          Install
        </button>
      )}
      {!isIOS && (
        <>
          <Link
            href="/"
            className={`border font rounded-lg p-4 border-yellow-200 w-64  text-black text-2xl`}
          >
            Home
          </Link>
        </>
      )}

      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            {" "}
            ⎋{" "}
          </span>
          and then &quot;Add to Home Screen&quot;
          <span role="img" aria-label="plus icon">
            {" "}
            ➕{" "}
          </span>
        </p>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <div>
      <InstallPrompt />
    </div>
  );
}
