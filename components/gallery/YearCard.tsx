"use client";

import React from "react";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

interface YearCardProps {
    year: string;
    isLocked: boolean;
    coverImage?: string;
    lockedIcon?: React.ReactNode;
    onClick: () => void;
}

export default function YearCard({ year, isLocked, coverImage, lockedIcon, onClick }: YearCardProps) {
    return (
        <motion.div
            whileHover={!isLocked ? { y: -10, scale: 1.02 } : {}}
            className={`relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer shadow-xl group ${isLocked ? "cursor-not-allowed opacity-60" : ""
                }`}
            onClick={!isLocked ? onClick : undefined}
        >
            {isLocked ? (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    {lockedIcon || <Lock className="text-gray-400 w-12 h-12" />}
                </div>
            ) : (
                <img
                    src={coverImage || "/images/placeholder.jpg"}
                    alt={year}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            <div className="absolute bottom-8 left-8">
                <h3 className="text-white text-5xl md:text-6xl font-[family-name:var(--font-romantic)]">
                    {year}
                </h3>
                {!isLocked && (
                    <p className="text-white/60 text-xs tracking-widest uppercase mt-2">
                        Ver Momentos
                    </p>
                )}
            </div>
        </motion.div>
    );
}