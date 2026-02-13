"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, ArrowLeft, RefreshCw } from "lucide-react";
import YearCard from "./YearCard";
import PhotoGrid from "./PhotoGrid";
import PhotoSkeleton from "./PhotoSkeleton";
import Link from "next/link";
import { YEARS_CONFIG } from "@/lib/constants";
import type { PhotoMeta, PhotoItem, MonthGroup, ApiPhotosResponse } from "@/lib/types";

export default function GalleryManager() {
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [photosData, setPhotosData] = useState<PhotoMeta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPhotos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/photos');
            const data: ApiPhotosResponse = await res.json();
            if (data.error) {
                setError(data.error);
            } else if (data.photos) {
                setPhotosData(data.photos);
            }
        } catch (err) {
            setError("No se pudieron cargar las fotos. Verificá tu conexión.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPhotos();
    }, [fetchPhotos]);

    const lockedIcons: Record<string, React.ReactNode> = {
        plane: <Plane size={55} className="text-gray-400 rotate-[25deg]" />,
    };

    const years = YEARS_CONFIG.map(y => {
        const yearLogo = photosData.find(p => p.year === y.year && p.type === 'logo');
        return {
            ...y,
            cover: yearLogo ? yearLogo.url : undefined,
            lockedIcon: y.lockedIcon ? lockedIcons[y.lockedIcon] : undefined
        };
    });

    const getGroupedPhotos = (year: string): MonthGroup[] => {
        const groups: Record<string, MonthGroup> = {};

        photosData
            .filter(p => p.year === year && p.type !== 'logo')
            .forEach(p => {
                if (!groups[p.monthName]) {
                    groups[p.monthName] = {
                        name: p.monthName,
                        number: p.monthNumber,
                        photos: []
                    };
                }
                const photo: PhotoItem = {
                    url: p.url,
                    caption: `Momento de ${p.monthName}`,
                    span: "col-span-1 row-span-1",
                    type: p.type as 'image' | 'video'
                };
                groups[p.monthName].photos.push(photo);
            });

        return Object.values(groups).sort((a, b) => a.number - b.number);
    };

    const groupedPhotos = selectedYear ? getGroupedPhotos(selectedYear) : [];

    return (
        <section className="min-h-screen bg-white py-12 px-6 md:px-20 overflow-hidden">
            <AnimatePresence mode="wait">
                {!selectedYear ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="max-w-7xl mx-auto"
                    >
                        <div className="flex justify-between items-center mb-16">
                            <Link href="/">
                                <button aria-label="Volver al inicio" className="text-black/40 hover:text-black uppercase text-xs tracking-widest flex items-center gap-2">
                                    <ArrowLeft size={16} /> Volver al Inicio
                                </button>
                            </Link>
                            <h2 className="text-black text-2xl tracking-[0.3em] uppercase font-light">
                                Nuestra Historia
                            </h2>
                            <div className="w-24" />
                        </div>

                        {error && (
                            <div className="flex flex-col items-center justify-center py-16 gap-4">
                                <p className="text-red-400 text-sm">{error}</p>
                                <button
                                    onClick={fetchPhotos}
                                    className="flex items-center gap-2 px-6 py-2 rounded-full border border-black/10 text-black/50 hover:text-black hover:border-black/30 transition-all text-xs uppercase tracking-widest"
                                >
                                    <RefreshCw size={14} /> Reintentar
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {years.map((y) => (
                                <YearCard
                                    key={y.year}
                                    year={y.year}
                                    isLocked={y.isLocked}
                                    coverImage={y.cover}
                                    onClick={() => setSelectedYear(y.year)}
                                    lockedIcon={y.lockedIcon}
                                />
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="details"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="max-w-7xl mx-auto"
                    >
                        <button
                            onClick={() => setSelectedYear(null)}
                            aria-label="Volver a los años"
                            className="mb-8 text-black/40 hover:text-black uppercase text-xs tracking-[0.3em] flex items-center gap-2"
                        >
                            <ArrowLeft size={16} /> Volver a los años
                        </button>

                        <div className="text-left mb-24">
                            <h2 className="text-7xl md:text-9xl text-black font-[family-name:var(--font-romantic)]">
                                {selectedYear}
                            </h2>
                            <p className="text-gray-400 uppercase tracking-widest text-sm mt-4">Nuestros mejores momentos</p>
                        </div>

                        {loading ? (
                            <PhotoSkeleton />
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-4">
                                <p className="text-red-400 text-sm">{error}</p>
                                <button
                                    onClick={fetchPhotos}
                                    className="flex items-center gap-2 px-6 py-2 rounded-full border border-black/10 text-black/50 hover:text-black hover:border-black/30 transition-all text-xs uppercase tracking-widest"
                                >
                                    <RefreshCw size={14} /> Reintentar
                                </button>
                            </div>
                        ) : groupedPhotos.length > 0 ? (
                            <div className="space-y-24">
                                {groupedPhotos.map((group) => (
                                    <div key={group.name} className="space-y-8">
                                        <div className="flex items-center gap-6">
                                            <h3 className="text-3xl md:text-4xl text-black font-[family-name:var(--font-romantic)]">
                                                {group.name}
                                            </h3>
                                            <div className="h-[1px] flex-grow bg-black/5" />
                                        </div>
                                        <PhotoGrid photos={group.photos} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-300">
                                <p className="font-light italic text-xl">Aún no hay fotos en este año.</p>
                                <p className="text-[10px] mt-4 uppercase tracking-[0.5em] opacity-40">Sube tus fotos a Cloudflare R2</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
