"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, ArrowLeft } from "lucide-react";
import YearCard from "./YearCard";
import PhotoGrid from "./PhotoGrid";
import Link from "next/link";

export default function GalleryManager() {
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [photosData, setPhotosData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const years = [
        { year: "2025", isLocked: false, cover: "/images/monet.jpg" },
        {
            year: "2026",
            isLocked: true,
            lockedIcon: <Plane size={55} className="text-gray-400 rotate-[25deg]" />
        },
        { year: "2027", isLocked: true },
    ];

    useEffect(() => {
        async function fetchPhotos() {
            try {
                const res = await fetch('/api/photos');
                const data = await res.json();
                if (data.photos) {
                    setPhotosData(data.photos);
                }
            } catch (err) {
                console.error("Error fetching photos:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchPhotos();
    }, []);

    // Agrupamos las fotos por mes para el año seleccionado
    const getGroupedPhotos = (year: string) => {
        const groups: { [key: string]: { name: string, number: number, photos: any[] } } = {};

        photosData
            .filter(p => p.year === year)
            .forEach(p => {
                if (!groups[p.monthName]) {
                    groups[p.monthName] = {
                        name: p.monthName,
                        number: p.monthNumber,
                        photos: []
                    };
                }
                groups[p.monthName].photos.push({
                    url: p.url,
                    caption: `Momento de ${p.monthName}`,
                    span: "col-span-1 row-span-1"
                });
            });

        // Ordenamos los grupos de meses cronológicamente (Enero a Diciembre)
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
                                <button className="text-black/40 hover:text-black uppercase text-xs tracking-widest flex items-center gap-2">
                                    <ArrowLeft size={16} /> Volver al Inicio
                                </button>
                            </Link>
                            <h2 className="text-black text-2xl tracking-[0.3em] uppercase font-light">
                                Nuestra Historia
                            </h2>
                            <div className="w-24" />
                        </div>

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
                            <div className="h-64 flex items-center justify-center text-gray-300 italic">Cargando vuestros recuerdos...</div>
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
