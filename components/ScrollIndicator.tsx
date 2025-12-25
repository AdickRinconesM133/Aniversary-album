'use client';

import React from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenisContext } from "./SmoothScroll";
import { useUI } from "@/context/UIContext";

export default function ScrollIndicator() {
    const lenis = useLenisContext();
    const { isLocked } = useUI();

    const scrollToMessagePanel = () => {
        if (isLocked) return;
        if (lenis) {
            lenis.scrollTo("#message-panel", {
                duration: 2.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
        } else {
            document.getElementById("message-panel")?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <AnimatePresence>
            {!isLocked && (
                <div className="fixed bottom-10 right-10 z-50">
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1, y: [0, 10, 0] }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={scrollToMessagePanel}
                        transition={{
                            opacity: { duration: 0.5 },
                            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-lg text-white/70 pointer-events-auto cursor-pointer"
                    >
                        <ChevronDown size={28} />
                    </motion.button>
                </div>
            )}
        </AnimatePresence>
    );
}