"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getJackpotStatus } from "@/actions/jackpot";
import JackpotWheel from "./JackpotWheel";
import { Sparkles, Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function JackpotFloatingButton() {
    const [canPlay, setCanPlay] = useState(false);
    const [nextPlayTime, setNextPlayTime] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check status on mount
        getJackpotStatus().then((status) => {
            setCanPlay(status.canPlay);
            setNextPlayTime(status.nextPlayTime);
        });
    }, [isOpen]); // Re-check when dialog closes

    if (!canPlay && !nextPlayTime) return null; // Likely not logged in or error

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <AnimatePresence>
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="fixed bottom-6 right-6 z-50"
                >
                    <DialogTrigger asChild>
                        <button className={`
                        group relative flex items-center gap-2 px-4 py-3 rounded-full shadow-xl 
                        ${canPlay
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105"
                                : "bg-gray-800 text-gray-400 cursor-not-allowed"} 
                        transition-all duration-300 font-bold border-2 border-white/20
                    `}>
                            {canPlay ? (
                                <>
                                    <Sparkles className="w-5 h-5 animate-pulse" />
                                    <span className="hidden md:inline">Daily Spin</span>
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Timer className="w-5 h-5" />
                                    <span className="text-xs">
                                        Next: {nextPlayTime ? new Date(nextPlayTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                    </span>
                                </>
                            )}
                        </button>

                    </DialogTrigger>
                </motion.div>
            </AnimatePresence>

            <DialogContent className="sm:max-w-md bg-transparent border-none shadow-none p-0">
                {canPlay ? (
                    <JackpotWheel onExplore={() => setIsOpen(false)} onClose={() => setIsOpen(false)} />
                ) : (
                    <div className="bg-white p-6 rounded-2xl text-center">
                        <h3 className="font-bold text-lg mb-2">Cooldown Active ⏳</h3>
                        <p className="text-gray-500">You've already spun today. Come back later!</p>
                    </div>
                )}

            </DialogContent>
        </Dialog>
    );
}
