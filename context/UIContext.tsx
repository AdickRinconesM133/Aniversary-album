'use client';

import React, { createContext, useContext, useState, useEffect } from "react";

interface UIContextType {
    showCountdown: boolean;
    setShowCountdown: (show: boolean) => void;
    isLocked: boolean;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [showCountdown, setShowCountdown] = useState(true);

    // Calculamos si está bloqueado (antes del 25 de Diciembre 2025)
    // Usamos useEffect para que el cálculo ocurra en el cliente
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        const checkLock = () => {
            const now = new Date();
            const anniversary = new Date('2025-12-25T00:00:00');
            setIsLocked(now < anniversary);
        };

        checkLock();
        const interval = setInterval(checkLock, 1000); // Re-verificar cada segundo
        return () => clearInterval(interval);
    }, []);

    return (
        <UIContext.Provider value={{ showCountdown, setShowCountdown, isLocked }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error("useUI must be used within a UIProvider");
    }
    return context;
}