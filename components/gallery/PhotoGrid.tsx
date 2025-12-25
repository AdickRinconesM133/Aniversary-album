"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Photo {
    url: string;
    caption?: string;
    span?: string;
}

interface PhotoGridProps {
    photos: Photo[];
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedIndex(null);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const showNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex + 1) % photos.length);
        }
    };

    const showPrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
        }
    };

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[250px]">
                {photos.map((photo, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        onClick={() => setSelectedIndex(index)}
                        className={`relative rounded-3xl overflow-hidden group shadow-lg cursor-pointer ${photo.span || "col-span-1 row-span-1"}`}
                    >
                        <img
                            src={photo.url}
                            alt={photo.caption || "Momento especial"}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                            <p className="text-white text-base font-light italic">
                                {photo.caption}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedIndex(null)}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedIndex(null)}
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[110]"
                        >
                            <X size={40} />
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={showPrev}
                            className="absolute left-4 md:left-12 text-white/30 hover:text-white transition-colors z-[110] bg-white/5 p-4 rounded-full hover:bg-white/10"
                        >
                            <ChevronLeft size={48} />
                        </button>

                        <button
                            onClick={showNext}
                            className="absolute right-4 md:right-12 text-white/30 hover:text-white transition-colors z-[110] bg-white/5 p-4 rounded-full hover:bg-white/10"
                        >
                            <ChevronRight size={48} />
                        </button>

                        {/* Photo Container */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center"
                        >
                            <div className="relative w-full h-[75vh] flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={selectedIndex}
                                        src={photos[selectedIndex].url}
                                        alt={photos[selectedIndex].caption}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                    />
                                </AnimatePresence>
                            </div>

                            {photos[selectedIndex].caption && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8 text-center"
                                >
                                    <p className="text-white text-2xl md:text-3xl font-[family-name:var(--font-romantic)]">
                                        {photos[selectedIndex].caption}
                                    </p>
                                    <p className="text-white/40 uppercase tracking-[0.4em] text-[10px] mt-4">
                                        Momentos inolvidables
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
