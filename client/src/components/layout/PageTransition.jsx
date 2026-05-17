import { motion, AnimatePresence } from "framer-motion";

const PageTransition = ({ children }) => (
    <AnimatePresence mode="wait">
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        >
            {children}
        </motion.div>
    </AnimatePresence>
);

export default PageTransition;
