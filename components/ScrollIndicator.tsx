'use client';

import React from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function ScrollIndicator() {
    return (
        <div className="fixed bottom-10 right-10 z-50">
            <motion.div
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-lg text-white/70"
            >
                <ChevronDown size={28} />
            </motion.div>
        </div>
    );
}