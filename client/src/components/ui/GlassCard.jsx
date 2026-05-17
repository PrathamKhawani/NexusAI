import { motion } from "framer-motion";

const GlassCard = ({ children, className = "", delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay }}
            className={`
        backdrop-blur-xl bg-white/10 border border-white/20
        shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
        rounded-2xl p-6
        ${className}
      `}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
