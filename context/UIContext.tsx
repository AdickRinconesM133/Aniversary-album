'use client';

import React, { createContext, useContext, useState } from "react";

interface UIContextType {
    showCountdown: boolean;
    setShowCountdown: (show: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [showCountdown, setShowCountdown] = useState(true);

    return (
        <UIContext.Provider value={{ showCountdown, setShowCountdown }}>
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