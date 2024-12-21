"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const FloatingInstallButton = ({ className }: { className?: string }) => {
  const [isStandalone, setIsStandalone] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [velocity, setVelocity] = useState({ x: 3, y: 2 });
  const [isCaught, setIsCaught] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    const updatePhysics = (timestamp: number) => {
      if (!buttonRef.current || isCaught) {
        frameRef.current = requestAnimationFrame(updatePhysics);
        return;
      }

      const deltaTime = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      // Get viewport and button dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const buttonRect = buttonRef.current.getBoundingClientRect();

      // Update position based on velocity with springy motion
      let newX = position.x + velocity.x * deltaTime * 120;
      let newY = position.y + velocity.y * deltaTime * 120;
      let newVelX = velocity.x;
      let newVelY = velocity.y;

      // Springy boundary collisions
      const bounceFactor = 0.95;
      const energyPreservation = 1.02;

      if (newX <= 0) {
        newVelX = Math.abs(velocity.x) * bounceFactor * energyPreservation;
        newX = 0;
      } else if (newX + buttonRect.width >= viewportWidth) {
        newVelX = -Math.abs(velocity.x) * bounceFactor * energyPreservation;
        newX = viewportWidth - buttonRect.width;
      }

      if (newY <= 0) {
        newVelY = Math.abs(velocity.y) * bounceFactor * energyPreservation;
        newY = 0;
      } else if (newY + buttonRect.height >= viewportHeight) {
        newVelY = -Math.abs(velocity.y) * bounceFactor * energyPreservation;
        newY = viewportHeight - buttonRect.height;
      }

      const otherButtons = document.querySelectorAll(
        'a[href="/join"], a[href="/create", a[href="/"]]'
      );

      otherButtons.forEach((button) => {
        const btnRect = button.getBoundingClientRect();
        if (
          isColliding(
            {
              x: newX,
              y: newY,
              width: buttonRect.width,
              height: buttonRect.height,
            },
            {
              x: btnRect.x,
              y: btnRect.y,
              width: btnRect.width,
              height: btnRect.height,
            }
          )
        ) {
          const centerX1 = newX + buttonRect.width / 2;
          const centerY1 = newY + buttonRect.height / 2;
          const centerX2 = btnRect.x + btnRect.width / 2;
          const centerY2 = btnRect.y + btnRect.height / 2;

          const dx = centerX1 - centerX2;
          const dy = centerY1 - centerY2;

          const length = Math.sqrt(dx * dx + dy * dy) || 1;
          const normalX = dx / length;
          const normalY = dy / length;

          const springiness = 1.5;
          newVelX = normalX * Math.abs(velocity.x) * springiness;
          newVelY = normalY * Math.abs(velocity.y) * springiness;

          const minVelocity = 2;
          if (Math.abs(newVelX) < minVelocity)
            newVelX *= minVelocity / Math.abs(newVelX);
          if (Math.abs(newVelY) < minVelocity)
            newVelY *= minVelocity / Math.abs(newVelY);
        }
      });

      if (Math.random() < 0.03) {
        newVelX += (Math.random() - 0.5) * 1.5;
        newVelY += (Math.random() - 0.5) * 1.5;
      }

      const maxVel = 8;
      const currentSpeed = Math.sqrt(newVelX * newVelX + newVelY * newVelY);
      if (currentSpeed > maxVel) {
        newVelX = (newVelX / currentSpeed) * maxVel;
        newVelY = (newVelY / currentSpeed) * maxVel;
      }

      setPosition({ x: newX, y: newY });
      setVelocity({ x: newVelX, y: newVelY });

      frameRef.current = requestAnimationFrame(updatePhysics);
    };

    frameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [position, velocity, isCaught]);

  const isColliding = (rect1: Rect, rect2: Rect): boolean => {
    return !(
      rect1.x + rect1.width < rect2.x ||
      rect2.x + rect2.width < rect1.x ||
      rect1.y + rect1.height < rect2.y ||
      rect2.y + rect2.height < rect1.y
    );
  };

  const handleClick = () => {
    setIsCaught(true);
    setPosition({
      x: window.innerWidth - (buttonRef.current?.offsetWidth || 0) - 20,
      y: 20,
    });
    setVelocity({ x: 0, y: 0 });
  };

  if (isStandalone) {
    return null;
  }

  return (
    <div
      ref={buttonRef}
      className={`fixed select-none z-50 ${
        isCaught ? "hover:scale-105 transition-transform" : ""
      }`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isCaught
          ? "transform 0.3s ease-out"
          : "transform 0.05s linear",
      }}
      onClick={!isCaught ? handleClick : undefined}
    >
      <Link
        className={`
          block
          px-4 py-2
          rounded-full
          shadow-lg
          text-white
          font-medium
          transition-all
          duration-200
          font
          ${className || ""}
        `}
        href="/install"
        onClick={(e) => !isCaught && e.preventDefault()}
      >
        {isCaught ? "Install App" : "Try to catch me!"}
      </Link>
    </div>
  );
};

export default FloatingInstallButton;
