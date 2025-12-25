'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MessagePanel() {
    return (
        <section id='message-panel' className="relative min-h-[80vh] bg-white w-full py-24 px-6 flex flex-col items-center justify-center z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
            <div className="w-16 h-[1px] bg-black/10 mb-12" />
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="max-w-3xl text-center"
            >
                <h2 className="font-[family-name:var(--font-romantic)] text-6xl md:text-8xl text-black mb-8">
                    ¡Feliz Aniversario mi niña preciosa!
                </h2>
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-light font-sans italic">
                    Gracias por ser mi compañera de vida. Te amo más de lo que puedes imaginar.
                </p>
                <Link href="/album">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-16 px-10 py-4 bg-black text-white rounded-full tracking-widest text-xs uppercase hover:bg-black/80 transition-colors shadow-xl"
                    >
                        Ver Álbum de Fotos
                    </motion.button>
                </Link>

                <div className="w-16 h-[1px] bg-black/10 mt-12" />
            </motion.div>
        </section>
    );
}
