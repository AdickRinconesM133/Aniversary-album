"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react";
import type { PhotoItem } from "@/lib/types";

interface PhotoGridProps {
    photos: PhotoItem[];
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [visibleCount, setVisibleCount] = useState(8);
    const triggerRef = useRef<HTMLElement | null>(null);
    const lightboxRef = useRef<HTMLDivElement>(null);

    const showNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex + 1) % photos.length);
        }
    }, [selectedIndex, photos.length]);

    const showPrev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
        }
    }, [selectedIndex, photos.length]);

    const closeLightbox = useCallback(() => {
        setSelectedIndex(null);
        triggerRef.current?.focus();
        triggerRef.current = null;
    }, []);

    useEffect(() => {
        if (selectedIndex === null) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "Escape":
                    closeLightbox();
                    break;
                case "ArrowLeft":
                    setSelectedIndex((prev) =>
                        prev !== null ? (prev - 1 + photos.length) % photos.length : null
                    );
                    break;
                case "ArrowRight":
                    setSelectedIndex((prev) =>
                        prev !== null ? (prev + 1) % photos.length : null
                    );
                    break;
                case "Tab":
                    e.preventDefault();
                    if (lightboxRef.current) {
                        const focusable = lightboxRef.current.querySelectorAll<HTMLElement>(
                            'button, [tabindex]:not([tabindex="-1"])'
                        );
                        const first = focusable[0];
                        const last = focusable[focusable.length - 1];
                        if (e.shiftKey) {
                            if (document.activeElement === first) last?.focus();
                            else (document.activeElement as HTMLElement)?.previousElementSibling?.closest<HTMLElement>('button')?.focus();
                        } else {
                            if (document.activeElement === last) first?.focus();
                        }
                    }
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, photos.length, closeLightbox]);

    useEffect(() => {
        if (selectedIndex !== null) {
            lightboxRef.current?.focus();
        }
    }, [selectedIndex]);

    const openLightbox = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
        triggerRef.current = e.currentTarget;
        setSelectedIndex(index);
    };

    const loadMore = () => {
        setVisibleCount(prev => prev + 8);
    };

    const visiblePhotos = photos.slice(0, visibleCount);

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[250px]">
                {visiblePhotos.map((photo, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: (index % 8) * 0.05 }}
                        onClick={(e) => openLightbox(index, e)}
                        tabIndex={0}
                        role="button"
                        aria-label={photo.caption || "Ver foto"}
                        className={`relative rounded-3xl overflow-hidden group shadow-lg cursor-pointer ${photo.span || "col-span-1 row-span-1"}`}
                    >
                        {photo.type === 'video' ? (
                            <div className="absolute inset-0 w-full h-full bg-black">
                                <video
                                    src={photo.url}
                                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                                    preload="metadata"
                                    muted
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                                        <Play className="text-white fill-white" size={24} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <img
                                src={photo.url}
                                alt={photo.caption || "Momento especial"}
                                loading="lazy"
                                decoding="async"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        )}

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                            <p className="text-white text-base font-light italic">
                                {photo.caption}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {visibleCount < photos.length && (
                <div className="flex justify-center mt-12">
                    <button
                        onClick={loadMore}
                        aria-label="Cargar más fotos"
                        className="px-8 py-3 rounded-full border border-black/10 text-black/40 hover:text-black hover:border-black/30 transition-all uppercase text-[10px] tracking-[0.3em]"
                    >
                        Cargar más momentos
                    </button>
                </div>
            )}

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        ref={lightboxRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Visor de fotos"
                        tabIndex={-1}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeLightbox}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 outline-none"
                    >
                        <button
                            onClick={closeLightbox}
                            aria-label="Cerrar"
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[110]"
                        >
                            <X size={40} />
                        </button>

                        <button
                            onClick={(e) => showPrev(e)}
                            aria-label="Foto anterior"
                            className="absolute left-4 md:left-12 text-white/30 hover:text-white transition-colors z-[110] bg-white/5 p-4 rounded-full hover:bg-white/10"
                        >
                            <ChevronLeft size={48} />
                        </button>

                        <button
                            onClick={(e) => showNext(e)}
                            aria-label="Foto siguiente"
                            className="absolute right-4 md:right-12 text-white/30 hover:text-white transition-colors z-[110] bg-white/5 p-4 rounded-full hover:bg-white/10"
                        >
                            <ChevronRight size={48} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center"
                        >
                            <div className="relative w-full h-[75vh] flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    {photos[selectedIndex].type === 'video' ? (
                                        <motion.video
                                            key={selectedIndex}
                                            src={photos[selectedIndex].url}
                                            controls
                                            autoPlay
                                            preload="auto"
                                            className="max-w-full max-h-full rounded-lg shadow-2xl"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.05 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    ) : (
                                        <motion.img
                                            key={selectedIndex}
                                            src={photos[selectedIndex].url}
                                            alt={photos[selectedIndex].caption}
                                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.05 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
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
