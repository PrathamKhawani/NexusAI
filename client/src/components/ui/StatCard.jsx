import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const StatCard = ({ label, value, icon: Icon, color = "cyan", unit = "", delay = 0 }) => {
    const [display, setDisplay] = useState(0);

    const colorMap = {
        cyan: { text: "text-[var(--neon-cyan)]", border: "border-[var(--neon-cyan)]", glow: "shadow-[0_0_12px_rgba(0,245,255,0.3)]" },
        purple: { text: "text-[var(--neon-purple)]", border: "border-[var(--neon-purple)]", glow: "shadow-[0_0_12px_rgba(191,0,255,0.3)]" },
        green: { text: "text-[var(--neon-green)]", border: "border-[var(--neon-green)]", glow: "shadow-[0_0_12px_rgba(0,255,136,0.3)]" },
        pink: { text: "text-[var(--neon-pink)]", border: "border-[var(--neon-pink)]", glow: "shadow-[0_0_12px_rgba(255,0,110,0.3)]" },
    };

    const c = colorMap[color] || colorMap.cyan;

    // Animated counter
    useEffect(() => {
        const numVal = typeof value === 'number' ? value : parseInt(value) || 0;
        const duration = 1200;
        const steps = 40;
        const step = numVal / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= numVal) { setDisplay(numVal); clearInterval(timer); }
            else setDisplay(Math.floor(current));
        }, duration / steps);
        return () => clearInterval(timer);
    }, [value]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay }}
            className={`stat-card ${c.glow}`}
        >
            <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-mono tracking-widest uppercase ${c.text} opacity-70`}>{label}</span>
                {Icon && <Icon size={18} className={`${c.text} opacity-50`} />}
            </div>
            <div className={`text-3xl font-bold font-mono ${c.text}`}>
                {display.toLocaleString()}<span className="text-base ml-1 opacity-60">{unit}</span>
            </div>
        </motion.div>
    );
};

export default StatCard;
