"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device supports mouse
    const hasMouseSupport = window.matchMedia("(pointer: fine)").matches;
    setIsVisible(hasMouseSupport);

    if (!hasMouseSupport) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 24);
      cursorY.set(e.clientY - 24);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener("mousemove", moveCursor);

    // Add hover detection for interactive elements
    const interactiveElements = document.querySelectorAll(
      "a, button, input, textarea, select, [role='button']"
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor ring */}
      <motion.div
        className="pointer-events-none fixed z-[9999] mix-blend-difference"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
      >
        <motion.div
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-green-500"
          animate={{
            scale: isHovering ? 1.3 : 1,
            borderColor: isHovering ? "#79B5EC" : "#24AE7C",
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Trailing particle 1 */}
      <motion.div
        className="pointer-events-none fixed z-[9998] h-2 w-2 rounded-full bg-green-500"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
        animate={{
          x: 20,
          y: 20,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
        }}
      />

      {/* Trailing particle 2 */}
      <motion.div
        className="pointer-events-none fixed z-[9997] h-2 w-2 rounded-full bg-blue-500"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
        animate={{
          x: 30,
          y: 10,
        }}
        transition={{
          type: "spring",
          damping: 35,
          stiffness: 180,
        }}
      />

      {/* Trailing particle 3 */}
      <motion.div
        className="pointer-events-none fixed z-[9996] h-2 w-2 rounded-full bg-green-400"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
        animate={{
          x: 10,
          y: 30,
        }}
        transition={{
          type: "spring",
          damping: 40,
          stiffness: 160,
        }}
      />
    </>
  );
};
