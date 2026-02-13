'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/UIContext";
import { ANNIVERSARY_DATE } from "@/lib/constants";

export default function Countdown() {
    const { showCountdown } = useUI();
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const currentYear = now.getFullYear();
            const targetMonth = ANNIVERSARY_DATE.getMonth();
            const targetDay = ANNIVERSARY_DATE.getDate();
            let targetDate = new Date(currentYear, targetMonth, targetDay);

            if (now > targetDate) {
                targetDate = new Date(currentYear + 1, targetMonth, targetDay);
            }

            const difference = targetDate.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-white select-none">
            <AnimatePresence>
                {showCountdown && (
                    <motion.div
                        key="countdown-box"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2, ease: "easeOut" } }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="text-center p-8 md:p-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[4rem] shadow-2xl min-w-[320px] md:min-w-[700px]"
                    >
                        <div className="flex gap-4 md:gap-12 font-[family-name:var(--font-romantic)]">
                            <TimeUnit value={timeLeft.days} label="Días" />
                            <TimeUnit value={timeLeft.hours} label="Horas" />
                            <TimeUnit value={timeLeft.minutes} label="Minutos" />
                            <TimeUnit value={timeLeft.seconds} label="Segundos" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
    return (
        <div>
            <div className="flex flex-col items-center w-20 md:w-36">
                <span className="text-6xl md:text-9xl drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">{value.toString().padStart(2, "0")}</span>
                <span className="text-xs md tracking-widest uppercase opacity-60 font-sans">{label}</span>
            </div>
        </div>
    );
}
