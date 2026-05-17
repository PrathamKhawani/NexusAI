import { motion } from "framer-motion";

const AnimatedButton = ({ children, onClick, className = "", type = "button", disabled = false }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
        relative overflow-hidden px-6 py-3 rounded-xl font-semibold text-white
        bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600
        shadow-[0_0_20px_rgba(124,58,237,0.5)]
        hover:shadow-[0_0_30px_rgba(124,58,237,0.8)]
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
        >
            <span className="relative z-10">{children}</span>
            <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
    );
};

export default AnimatedButton;
