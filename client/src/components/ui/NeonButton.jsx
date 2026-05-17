import { motion } from "framer-motion";

const NeonButton = ({
    children, onClick, type = "button", disabled = false,
    variant = "cyan", size = "md", className = "", fullWidth = false,
}) => {
    const variantClass = {
        cyan: "",
        purple: "neon-btn-purple",
        green: "neon-btn-green",
    }[variant] || "";

    const sizeClass = {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-5 py-2.5",
        lg: "text-base px-8 py-3",
    }[size] || "text-sm px-5 py-2.5";

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.03 }}
            whileTap={{ scale: disabled ? 1 : 0.97 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`neon-btn ${variantClass} ${sizeClass} ${fullWidth ? 'w-full' : ''} ${className} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
            <span>{children}</span>
        </motion.button>
    );
};

export default NeonButton;
