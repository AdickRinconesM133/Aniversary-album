'use client';

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/UIContext";

export default function AudioPlayer() {
    const [isMuted, setIsMuted] = useState(true);
    const { setShowCountdown, showCountdown } = useUI();
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.3;
        }
    }, []);

    const toggleMute = () => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.play().catch((error) => {
                    console.error("Error playing audio:", error);
                });
                audioRef.current.muted = false;
            } else {
                audioRef.current.muted = true;
            }
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="fixed top-6 right-6 z-50 flex gap-4">
            <audio ref={audioRef} src="/audio/song.mp3" loop muted={isMuted} />
            <motion.button
                onClick={toggleMute}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg text-white hover:bg-white/20 transition-colors"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={isMuted ? "muted" : "unmuted"}
                        initial={{ opacity: 0, rotate: -45 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 45 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </motion.div>
                </AnimatePresence>
            </motion.button>
            <motion.button
                onClick={() => setShowCountdown(!showCountdown)}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg text-white hover:bg-white/20 transition-colors"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={showCountdown ? "show" : "hide"}
                        initial={{ opacity: 0, rotate: -45 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 45 }}
                        transition={{ duration: 0.2 }}
                    >
                        {showCountdown ? <EyeOff size={24} /> : <Eye size={24} />}
                    </motion.div>
                </AnimatePresence>
            </motion.button>
        </div>
    )
}