import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CookingTimerProps {
    defaultMinutes?: number;
    stepName?: string;
}

const CookingTimer: React.FC<CookingTimerProps> = ({ defaultMinutes = 15, stepName }) => {
    const [time, setTime] = useState(defaultMinutes * 60);
    const [active, setActive] = useState(false);
    const startTime = defaultMinutes * 60;

    useEffect(() => {
        let id: number;
        if (active && time > 0) {
            id = window.setInterval(() => setTime(t => t - 1), 1000);
        } else if (time === 0 && active) {
            setActive(false);
            // Sound
            try {
                const a = new AudioContext();
                const o = a.createOscillator();
                o.connect(a.destination);
                o.frequency.value = 880;
                o.start();
                o.stop(a.currentTime + 0.5);
            } catch (e) { }
        }
        return () => window.clearInterval(id);
    }, [active, time]);

    const m = Math.floor(time / 60);
    const s = time % 60;

    return (
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-300 rounded-xl p-5">
            {stepName && <h3 className="text-blue-700 font-bold text-center mb-3">{stepName}</h3>}

            {/* Big Time Display */}
            <div className={`text-center py-6 rounded-lg mb-4 ${time === 0 ? 'bg-green-500' : 'bg-blue-600'}`}>
                <span className="text-5xl font-mono font-bold text-white">
                    {time === 0 ? "SELESAI!" : `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-blue-200 rounded-full mb-4 overflow-hidden">
                <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${startTime > 0 ? ((startTime - time) / startTime * 100) : 0}%` }}
                />
            </div>

            {/* Adjust Buttons */}
            <div className="grid grid-cols-4 gap-1 mb-3">
                <Button variant="outline" size="sm" disabled={active} onClick={() => setTime(t => Math.max(60, t - 300))}>-5m</Button>
                <Button variant="outline" size="sm" disabled={active} onClick={() => setTime(t => Math.max(60, t - 60))}>-1m</Button>
                <Button variant="outline" size="sm" disabled={active} onClick={() => setTime(t => t + 60)}>+1m</Button>
                <Button variant="outline" size="sm" disabled={active} onClick={() => setTime(t => t + 300)}>+5m</Button>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-2">
                <Button
                    onClick={() => {
                        if (time === 0) setTime(startTime);
                        setActive(!active);
                    }}
                    className={active ? "bg-orange-500" : time === 0 ? "bg-green-600" : "bg-blue-600"}
                >
                    {active ? "PAUSE" : time === 0 ? "ULANGI" : "MULAI"}
                </Button>
                <Button variant="outline" onClick={() => { setActive(false); setTime(startTime); }}>
                    RESET
                </Button>
            </div>
        </div>
    );
};

export default CookingTimer;
