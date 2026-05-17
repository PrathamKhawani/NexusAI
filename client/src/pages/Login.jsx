import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/layout/PageTransition";
import NeonButton from "../components/ui/NeonButton";
import NeonInput from "../components/ui/NeonInput";
import CyberCard from "../components/ui/CyberCard";
import SEOHead from "../components/ui/SEOHead";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post("http://localhost:5000/api/users/login", form);
            login(data.user, data.token);
            toast.success("ACCESS GRANTED — Welcome back!");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.response?.data?.errorMessage || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <SEOHead
                title="Login"
                description="Sign in to NovaAI — your AI-native intelligence hub. Access your dashboard, AI news, tools directory, and bookmarks."
                canonicalPath="/login"
                noIndex={true}
                breadcrumbs={[{ name: "Home", url: "/" }, { name: "Login", url: "/login" }]}
            />

            <div className="min-h-[80vh] flex items-center justify-center">
                <CyberCard className="w-full max-w-md" delay={0.1}>
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 border border-[var(--neon-cyan)] rounded mb-4">
                            <LogIn size={20} className="text-[var(--neon-cyan)]" />
                        </div>
                        <h1 className="text-xl font-bold text-[var(--neon-cyan)] font-mono tracking-widest">AUTHENTICATION</h1>
                        <p className="text-xs font-mono text-[var(--text-muted)] mt-1 tracking-widest">NOVAAI_SECURE_ACCESS_v2</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        <NeonInput
                            id="email"
                            label="Email Address"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="user@novaai.app"
                            required
                            autoComplete="email"
                            icon={Mail}
                        />
                        <NeonInput
                            id="password"
                            label="Password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                            icon={Lock}
                        />

                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                            <NeonButton
                                type="submit"
                                disabled={loading}
                                fullWidth
                                size="lg"
                                variant="cyan"
                            >
                                {loading ? "AUTHENTICATING..." : "⚡ ACCESS NEXUS"}
                            </NeonButton>
                        </motion.div>
                    </form>

                    <div className="mt-6 pt-5 border-t border-[rgba(0,245,255,0.1)] text-center">
                        <p className="text-xs font-mono text-[var(--text-muted)]">
                            NEW USER?{" "}
                            <Link to="/register" className="text-[var(--neon-purple)] hover:text-[var(--neon-cyan)] transition-colors">
                                CREATE ACCOUNT →
                            </Link>
                        </p>
                    </div>
                </CyberCard>
            </div>
        </PageTransition>
    );
};

export default Login;
