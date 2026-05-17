import { motion } from "framer-motion";

const FloatingInput = ({ label, id, type = "text", value, onChange, placeholder = " ", required = false }) => {
    return (
        <div className="relative mb-6">
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                className="
          block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-100 bg-transparent rounded-lg border-1 border-gray-600 
          appearance-none focus:outline-none focus:ring-0 focus:border-purple-500 peer
        "
                placeholder={placeholder}
                required={required}
            />
            <label
                htmlFor={id}
                className="
          absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#0a0a0f] px-2 
          peer-focus:px-2 peer-focus:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1
        "
            >
                {label}
            </label>
            <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: "0%" }}
                whileFocus={{ width: "100%" }}
                transition={{ duration: 0.3 }}
            />
        </div>
    );
};

export default FloatingInput;
