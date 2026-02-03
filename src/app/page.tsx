"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Ribbon = {
  id: number;
  offsetX: number;
  duration: number;
};

export default function SorryNishtha() {
  const yesButtonRef = useRef<HTMLButtonElement | null>(null);

  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [accepted, setAccepted] = useState(false);

  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [viewportH, setViewportH] = useState(0);
  const [ribbons, setRibbons] = useState<Ribbon[]>([]);

  // 🚫 Move NO button without overlapping YES
  const moveNoButton = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const maxX = vw / 2 - 100;
    const maxY = vh / 2 - 140;

    let newX = 0;
    let newY = 0;

    // YES button position
    let yesX = 0;
    let yesY = 0;

    if (yesButtonRef.current) {
      const rect = yesButtonRef.current.getBoundingClientRect();
      yesX = rect.left + rect.width / 2 - vw / 2;
      yesY = rect.top + rect.height / 2 - vh / 2;
    }

    const MIN_DISTANCE = 140; // safe gap

    // Try multiple times to find a safe spot
    for (let i = 0; i < 10; i++) {
      const x = Math.floor(Math.random() * maxX * 2) - maxX;
      const y = Math.floor(Math.random() * maxY * 2) - maxY;

      const distance = Math.hypot(x - yesX, y - yesY);

      if (distance > MIN_DISTANCE) {
        newX = x;
        newY = y;
        break;
      }
    }

    setNoPos({ x: newX, y: newY });
  };

  // ✅ YES click
  const handleYesClick = () => {
    if (!yesButtonRef.current) return;

    const rect = yesButtonRef.current.getBoundingClientRect();

    setOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });

    setViewportH(window.innerHeight);

    setRibbons(
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        offsetX: (Math.random() - 0.5) * 360,
        duration: 2 + Math.random() * 1.2,
      })),
    );

    setAccepted(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-purple-300 px-4">
      <div className="bg-white/80 backdrop-blur p-6 sm:p-8 rounded-3xl shadow-2xl text-center w-full max-w-[380px] relative">
        {!accepted ? (
          <>
            <h1 className="text-2xl font-bold mb-3">Hey Nishtha 🥺</h1>
            <p className="mb-8 text-gray-700">
              I am really sorry. Will you forgive me?
            </p>

            <div className="relative flex justify-center gap-4 sm:gap-6 h-32">
              {/* ✅ YES */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  ref={yesButtonRef}
                  onClick={handleYesClick}
                  className="px-8 py-3 sm:px-10 sm:py-4 rounded-2xl text-lg font-semibold
                             bg-gradient-to-r from-emerald-400 to-green-500
                             shadow-lg shadow-green-400/40
                             hover:shadow-xl hover:shadow-green-500/50"
                >
                  Yes 💚
                </Button>
              </motion.div>

              {/* ❌ NO (never overlaps YES) */}
              <motion.div
                onMouseEnter={moveNoButton}
                onTouchStart={moveNoButton}
                onPointerDown={moveNoButton}
                animate={{ x: noPos.x, y: noPos.y }}
                transition={{ type: "spring", stiffness: 350 }}
                className="absolute"
              >
                <Button
                  className="px-8 py-3 sm:px-10 sm:py-4 rounded-2xl text-lg font-semibold
                             bg-gradient-to-r from-red-400 to-rose-500
                             shadow-lg shadow-red-400/40
                             touch-none"
                >
                  No 😤
                </Button>
              </motion.div>
            </div>
          </>
        ) : (
          <>
            {/* 🎉 Ribbons */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              {ribbons.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{
                    x: origin.x,
                    y: origin.y,
                    scale: 0,
                    opacity: 1,
                  }}
                  animate={{
                    x: origin.x + r.offsetX,
                    y: viewportH + 120,
                    rotate: 360,
                    scale: 1,
                  }}
                  transition={{
                    duration: r.duration,
                    ease: "easeOut",
                  }}
                  className="absolute w-3 h-8 bg-pink-400 rounded-full"
                />
              ))}
            </div>

            {/* 💖 Card */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 180 }}
            >
              <Card className="rounded-3xl shadow-2xl border-0 bg-white">
                <CardContent className="p-6 sm:p-8 text-center">
                  <h1 className="text-3xl font-bold mb-3">Party Time 🎉</h1>
                  <p className="text-gray-700 text-lg">
                    Thanks kachu kachu maaf krne ke liye 💖
                    <br />
                    Abki baar last time pakka 😌
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
