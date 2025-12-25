'use client';

import React from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useLenisContext } from "./SmoothScroll";

export default function ScrollIndicator() {
    const lenis = useLenisContext();

    const scrollToMessagePanel = () => {
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
        <div className="fixed bottom-10 right-10 z-50">
            <motion.button
                onClick={scrollToMessagePanel}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-lg text-white/70 pointer-events-auto cursor-pointer"
            >
                <ChevronDown size={28} />
            </motion.button>
        </div>
    );
}