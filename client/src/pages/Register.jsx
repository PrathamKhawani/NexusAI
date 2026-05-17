import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import PageTransition from "../components/layout/PageTransition";
import NeonButton from "../components/ui/NeonButton";
import NeonInput from "../components/ui/NeonInput";
import CyberCard from "../components/ui/CyberCard";
import SEOHead from "../components/ui/SEOHead";

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        try {
            await axios.post("http://localhost:5000/api/users/register", form);
            toast.success("NODE INITIALIZED — Please login to continue");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.errorMessage || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <SEOHead
                title="Register"
                description="Create your free NovaAI account and join the neural intelligence hub. Discover AI tools, read AI news, earn XP and build your AI knowledge streak."
                canonicalPath="/register"
                noIndex={true}
                breadcrumbs={[{ name: "Home", url: "/" }, { name: "Register", url: "/register" }]}
            />

            <div className="min-h-[80vh] flex items-center justify-center">
                <CyberCard className="w-full max-w-md" delay={0.1}>
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 border border-[var(--neon-purple)] rounded mb-4">
                            <UserPlus size={20} className="text-[var(--neon-purple)]" />
                        </div>
                        <h1 className="text-xl font-bold text-[var(--neon-purple)] font-mono tracking-widest">INITIALIZE NODE</h1>
                        <p className="text-xs font-mono text-[var(--text-muted)] mt-1 tracking-widest">CREATE_NOVAAI_ACCOUNT_v2</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        <NeonInput
                            id="name"
                            label="Display Name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="CyberPilot_42"
                            required
                            autoComplete="name"
                            icon={User}
                        />
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
                            label="Password (min 6 chars)"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            autoComplete="new-password"
                            icon={Lock}
                        />

                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                            <NeonButton
                                type="submit"
                                disabled={loading}
                                fullWidth
                                size="lg"
                                variant="purple"
                            >
                                {loading ? "INITIALIZING..." : "⚡ JOIN NOVAAI"}
                            </NeonButton>
                        </motion.div>
                    </form>

                    <div className="mt-6 pt-5 border-t border-[rgba(191,0,255,0.15)] text-center">
                        <p className="text-xs font-mono text-[var(--text-muted)]">
                            ALREADY A NODE?{" "}
                            <Link to="/login" className="text-[var(--neon-cyan)] hover:text-[var(--neon-purple)] transition-colors">
                                LOGIN →
                            </Link>
                        </p>
                    </div>
                </CyberCard>
            </div>
        </PageTransition>
    );
};

export default Register;
