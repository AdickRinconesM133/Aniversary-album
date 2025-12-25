"use client";

import { useEffect, createContext, useContext } from "react";
import Lenis from "lenis";
import { useUI } from "@/context/UIContext";

// 1. Creamos un contexto para Lenis
const LenisContext = createContext<Lenis | null>(null);

export const useLenisContext = () => useContext(LenisContext);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    let lenisInstance: Lenis | null = null;

    const { isLocked } = useUI();

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.5,
            lerp: 0.05,
            wheelMultiplier: 0.7,
            smoothWheel: true,
        });

        if (isLocked) {
            lenis.stop();
            document.body.style.overflow = 'hidden';
        } else {
            lenis.start();
            document.body.style.overflow = 'auto';
        }

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
        lenisInstance = lenis;

        return () => {
            lenis.destroy();
            document.body.style.overflow = 'auto';
        };
    }, [isLocked]);

    return (
        <LenisContext.Provider value={lenisInstance}>
            {children}
        </LenisContext.Provider>
    );
}