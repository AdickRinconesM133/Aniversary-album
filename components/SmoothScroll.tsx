"use client";

import { useEffect, useRef, useState, createContext, useContext } from "react";
import Lenis from "lenis";
import { useUI } from "@/context/UIContext";

const LenisContext = createContext<Lenis | null>(null);

export const useLenisContext = () => useContext(LenisContext);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const [lenis, setLenis] = useState<Lenis | null>(null);
    const rafIdRef = useRef<number>(0);
    const { isLocked } = useUI();

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            return;
        }

        const instance = new Lenis({
            duration: 1.5,
            lerp: 0.05,
            wheelMultiplier: 0.7,
            smoothWheel: true,
        });

        function raf(time: number) {
            instance.raf(time);
            rafIdRef.current = requestAnimationFrame(raf);
        }

        rafIdRef.current = requestAnimationFrame(raf);
        setLenis(instance);

        return () => {
            cancelAnimationFrame(rafIdRef.current);
            instance.destroy();
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        if (!lenis) return;

        if (isLocked) {
            lenis.stop();
            document.body.style.overflow = 'hidden';
        } else {
            lenis.start();
            document.body.style.overflow = 'auto';
        }
    }, [lenis, isLocked]);

    return (
        <LenisContext.Provider value={lenis}>
            {children}
        </LenisContext.Provider>
    );
}
