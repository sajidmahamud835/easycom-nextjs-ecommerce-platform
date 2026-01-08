"use client";

import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Loader2, Gift, X } from "lucide-react";
import { spinJackpot } from "@/actions/jackpot";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

interface JackpotWheelProps {
    onExplore: () => void;
    onClose: () => void;
}

export default function JackpotWheel({ onExplore, onClose }: JackpotWheelProps) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState<any>(null);
    const controls = useAnimation();

    const handleSpin = async () => {
        if (isSpinning) return;
        setIsSpinning(true);

        // Initial "fake" spin to build tension
        await controls.start({
            rotate: 360 * 5,
            transition: { duration: 2, ease: "linear", repeat: Infinity },
        });

        // Call server
        const data = await spinJackpot();

        // Stop infinite spin
        controls.stop();

        if (data.success) {
            // Calculate target rotation based on server result 'angle'
            // Add extra rotations for effect
            const targetRotation = 360 * 5 + (data.angle || 0);

            await controls.start({
                rotate: targetRotation,
                transition: { duration: 3, ease: "easeOut" },
            });

            if (data.win) {
                triggerConfetti();
            }
            setResult(data);
        } else {
            // Handle error (e.g. cooldown) - Stop spin
            setIsSpinning(false);
            setResult({ message: data.message }); // Show error message
        }

        setIsSpinning(false);
    };

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        }

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    }

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-2xl relative w-full max-w-md mx-auto">
            <button onClick={onClose} className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center mb-6">
                <h2 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    DAILY JACKPOT
                </h2>
                <p className="text-sm text-gray-500">Spin to win up to 50% OFF!</p>
            </div>

            <div className="relative w-64 h-64 mb-8">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 w-4 h-8 bg-red-500 clip-path-polygon-[50%_100%,0_0,100%_0] drop-shadow-md" />

                {/* Wheel - Simple CSS Conic Gradient for visuals */}
                <motion.div
                    animate={controls}
                    className="w-full h-full rounded-full border-4 border-gray-800 shadow-inner overflow-hidden relative"
                    style={{
                        background: `conic-gradient(
              #ff0000 0deg 45deg,    /* Jackpot */
              #f3f4f6 45deg 90deg,   /* Miss */
              #3b82f6 90deg 135deg,  /* Small */
              #f3f4f6 135deg 180deg, /* Miss */
              #8b5cf6 180deg 225deg, /* Big */
              #f3f4f6 225deg 270deg, /* Miss */
              #3b82f6 270deg 315deg, /* Small */
              #f3f4f6 315deg 360deg  /* Miss */
            )`,
                    }}
                >
                    {/* Visual labels can be absolutely positioned if needed */}
                </motion.div>

                {/* Center Cap */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200">
                    <Gift className="w-6 h-6 text-purple-600" />
                </div>
            </div>

            {!result ? (
                <Button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 text-lg shadow-lg transform active:scale-95 transition-all"
                >
                    {isSpinning ? (
                        <>
                            <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                            Spinning...
                        </>
                    ) : (
                        "SPIN NOW"
                    )}
                </Button>
            ) : (
                <div className="text-center w-full animate-in fade-in zoom-in duration-300">
                    {result.win ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                            <h3 className="text-xl font-bold text-green-700 mb-1">YOU WON! 🎉</h3>
                            <p className="text-sm text-green-600 mb-2">Use code at checkout:</p>
                            <div className="bg-white border-dashed border-2 border-green-300 rounded-lg p-3 text-2xl font-mono font-bold text-gray-800 select-all cursor-pointer hover:bg-green-50 transition-colors"
                                onClick={() => { navigator.clipboard.writeText(result.prize.code) }}>
                                {result.prize.code}
                            </div>
                            <p className="text-xs text-green-500 mt-2">Expires in 24 hours</p>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                            <h3 className="text-lg font-bold text-gray-700">Better luck next time!</h3>
                            <p className="text-sm text-gray-500">{result.message}</p>
                        </div>
                    )}

                    <Button variant="outline" onClick={onExplore} className="w-full">
                        Continue Shopping
                    </Button>
                </div>
            )}
        </div>
    );
}
