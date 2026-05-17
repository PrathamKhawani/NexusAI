import { motion } from "framer-motion";

const CyberCard = ({ children, className = "", delay = 0, glowColor = "cyan", onClick }) => {
    const glowClass = {
        cyan: "card-glow-cyan",
        purple: "card-glow-purple",
        green: "card-glow-green",
    }[glowColor] || "card-glow-cyan";

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay, ease: [0.23, 1, 0.32, 1] }}
            className={`cyber-card ${glowClass} ${className} ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className="scanlines" aria-hidden="true" />
            {children}
        </motion.div>
    );
};

export default CyberCard;
