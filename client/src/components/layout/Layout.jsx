import Navbar from "./Navbar";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";

const Layout = ({ children }) => {
    return (
        <HelmetProvider>
            {/* Animated cyber grid background */}
            <div className="cyber-grid-bg" aria-hidden="true" />

            <div className="relative min-h-screen flex flex-col">
                <Navbar />
                <main
                    id="main-content"
                    className="flex-1 pt-20 px-4 pb-12 max-w-7xl mx-auto w-full"
                    role="main"
                >
                    {children}
                </main>

                <footer className="border-t border-[rgba(0,245,255,0.1)] py-6 text-center" role="contentinfo">
                    <p className="text-xs font-mono text-[var(--text-muted)] tracking-widest">
                        <span className="text-[var(--neon-cyan)]">NEXUSAI</span> &nbsp;|&nbsp; Neural Intelligence Hub &nbsp;|&nbsp; MERN Stack &copy; {new Date().getFullYear()}
                    </p>
                </footer>
            </div>

            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#0d1117',
                        color: '#e2e8f0',
                        border: '1px solid rgba(0,245,255,0.3)',
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: '0.85rem',
                    },
                    success: { iconTheme: { primary: '#00ff88', secondary: '#0d1117' } },
                    error: { iconTheme: { primary: '#ff003c', secondary: '#0d1117' } },
                }}
            />
        </HelmetProvider>
    );
};

export default Layout;
