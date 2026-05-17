import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home, LogIn, UserPlus, LayoutDashboard, LogOut,
    Newspaper, Wrench, Bookmark, User, Menu, X
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import GlitchText from "../ui/GlitchText";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const isAuthenticated = !!user;
    const [mobileOpen, setMobileOpen] = useState(false);

    const publicNav = [
        { name: "Home", path: "/", icon: Home },
        { name: "News", path: "/news", icon: Newspaper },
        { name: "Tools", path: "/tools", icon: Wrench },
        { name: "Login", path: "/login", icon: LogIn },
        { name: "Register", path: "/register", icon: UserPlus },
    ];

    const authNav = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "News", path: "/news", icon: Newspaper },
        { name: "Tools", path: "/tools", icon: Wrench },
        { name: "Bookmarks", path: "/bookmarks", icon: Bookmark },
        { name: "Profile", path: "/profile", icon: User },
    ];

    const navItems = isAuthenticated ? authNav : publicNav;

    const handleLogout = () => {
        logout();
        navigate("/login");
        setMobileOpen(false);
    };

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="cyber-nav fixed top-0 left-0 right-0 z-50 px-4 py-3"
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2"
                    aria-label="NexusAI Home"
                >
                    <span className="w-8 h-8 flex items-center justify-center border border-[var(--neon-cyan)] rounded text-[var(--neon-cyan)] text-xs font-mono font-bold">
                        NX
                    </span>
                    <GlitchText
                        text="NexusAI"
                        tag="span"
                        className="text-xl font-bold text-[var(--neon-cyan)] font-mono hidden sm:inline"
                    />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1" role="list">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path} role="listitem">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono tracking-wider uppercase transition-colors rounded
                                        ${isActive
                                            ? 'text-[var(--neon-cyan)] border-b border-[var(--neon-cyan)]'
                                            : 'text-[var(--text-muted)] hover:text-[var(--neon-cyan)]'
                                        }`}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    <Icon size={14} />
                                    <span>{item.name}</span>
                                </motion.div>
                            </Link>
                        );
                    })}

                    {isAuthenticated && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono tracking-wider uppercase text-[var(--neon-red)] hover:text-[var(--neon-red)] transition-colors border border-[var(--neon-red)]/30 hover:border-[var(--neon-red)] rounded ml-2"
                            aria-label="Logout"
                        >
                            <LogOut size={14} />
                            <span>Logout</span>
                        </motion.button>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden text-[var(--neon-cyan)] p-2"
                    onClick={() => setMobileOpen(o => !o)}
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-[rgba(0,245,255,0.1)] mt-3 pt-3 pb-4 px-4 space-y-1"
                        role="menu"
                    >
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    role="menuitem"
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-2 px-3 py-2.5 text-sm font-mono tracking-wider rounded
                                        ${isActive ? 'text-[var(--neon-cyan)] bg-[rgba(0,245,255,0.05)]' : 'text-[var(--text-muted)]'}`}
                                >
                                    <Icon size={16} />
                                    {item.name}
                                </Link>
                            );
                        })}
                        {isAuthenticated && (
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-mono tracking-wider text-[var(--neon-red)] border border-[var(--neon-red)]/30 rounded"
                                role="menuitem"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
