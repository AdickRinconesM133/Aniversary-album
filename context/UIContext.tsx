'use client';

import React, { createContext, useContext, useState, useEffect } from "react";
import { ANNIVERSARY_DATE } from "@/lib/constants";

interface UIContextType {
    showCountdown: boolean;
    setShowCountdown: (show: boolean) => void;
    isLocked: boolean;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [showCountdown, setShowCountdown] = useState(true);
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        const now = new Date();
        const diff = ANNIVERSARY_DATE.getTime() - now.getTime();

        if (diff <= 0) {
            setIsLocked(false);
            return;
        }

        setIsLocked(true);
        const timeout = setTimeout(() => {
            setIsLocked(false);
        }, diff);

        return () => clearTimeout(timeout);
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
