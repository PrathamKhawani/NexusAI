import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "../components/layout/PageTransition";
import GlitchText from "../components/ui/GlitchText";
import NeonButton from "../components/ui/NeonButton";
import SEOHead from "../components/ui/SEOHead";
import { Zap, Shield, Globe, Brain, Cpu, Database, TrendingUp, Bot } from "lucide-react";

const FEATURES = [
    { icon: Brain, label: "AI News Feed", desc: "Curated, real-time intelligence on GPT models, robotics, and frontier research — filtered by category.", color: "var(--neon-cyan)" },
    { icon: Cpu, label: "AI Tools Directory", desc: "Browse and rate 100+ AI tools. From LLMs to image gen, code assistants to voice cloning.", color: "var(--neon-purple)" },
    { icon: TrendingUp, label: "XP & Streak System", desc: "Earn XP for every interaction. Build a learning streak. Unlock achievements as you explore AI.", color: "var(--neon-green)" },
    { icon: Database, label: "MongoDB Atlas", desc: "Full MERN stack with 5 MongoDB collections: users, posts, tools, activity logs, and bookmarks.", color: "var(--neon-pink)" },
    { icon: Shield, label: "JWT Auth", desc: "Stateless, secure JWT-based authentication with bcrypt password hashing and role-based access.", color: "var(--neon-yellow)" },
    { icon: Globe, label: "SEO + AI SEO", desc: "Structured data (JSON-LD), Open Graph, Twitter Cards, FAQ schema, and breadcrumb markup on every page.", color: "var(--neon-blue)" },
];

const FAQ = [
    { q: "What is NovaAI?", a: "NovaAI is an AI-native intelligence platform for discovering cutting-edge AI tools, reading the latest tech news, and tracking your AI learning journey with XP and streaks." },
    { q: "Is NovaAI free?", a: "Yes — completely free. Sign up, explore AI tools, read curated news, bookmark your favorites, and earn XP without any subscription." },
    { q: "What data does NovaAI store?", a: "NovaAI stores user profiles, AI tool ratings, bookmarked articles and tools, activity logs, and news posts — all in MongoDB Atlas cloud." },
];

const LandingPage = () => {
    return (
        <PageTransition>
            <SEOHead
                title="NovaAI — The Neural Intelligence Hub"
                description="Discover the best AI tools, read curated AI and tech news, track your learning with XP streaks, and bookmark your favorite AI resources. Built on MERN stack."
                keywords={["AI tools directory", "AI news", "artificial intelligence platform", "GPT tools", "machine learning news", "AI learning platform"]}
                canonicalPath="/"
                pageType="faq"
                breadcrumbs={[{ name: "Home", url: "/" }]}
            />

            <div className="flex flex-col items-center text-center space-y-20 py-12">

                {/* ── Hero ── */}
                <header className="space-y-8 max-w-4xl" role="banner">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--neon-green)]/40 rounded-full mb-6">
                            <div className="neon-dot" aria-hidden="true" />
                            <span className="text-xs font-mono text-[var(--neon-green)] tracking-widest">LIVE — NEURAL GRID ACTIVE</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                            <GlitchText
                                text="NovaAI"
                                className="text-[var(--neon-cyan)]"
                            />
                        </h1>

                        <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed font-mono">
                            The Neural Intelligence Hub. Discover AI tools, read frontier research, earn XP, and build your AI expertise — all in one platform.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <Link to="/register">
                            <NeonButton size="lg" variant="cyan">
                                ⚡ Enter the Nexus
                            </NeonButton>
                        </Link>
                        <Link to="/tools">
                            <NeonButton size="lg" variant="purple">
                                Browse AI Tools
                            </NeonButton>
                        </Link>
                        <Link to="/news">
                            <NeonButton size="lg" variant="green">
                                Read AI News
                            </NeonButton>
                        </Link>
                    </motion.div>
                </header>

                {/* ── Feature Grid ── */}
                <section className="w-full max-w-6xl" aria-labelledby="features-heading">
                    <div className="section-header justify-center mb-10">
                        <div className="section-header-line" aria-hidden="true" />
                        <h2 id="features-heading" className="text-sm font-mono tracking-[0.3em] uppercase text-[var(--neon-cyan)]">
                            Platform Features
                        </h2>
                        <div className="section-header-line" style={{ background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.4))" }} aria-hidden="true" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
                        {FEATURES.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <motion.article
                                    key={f.label}
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * i, duration: 0.4 }}
                                    className="cyber-card group"
                                    aria-label={f.label}
                                >
                                    <div className="scanlines" aria-hidden="true" />
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="p-2 rounded border border-current/20" style={{ color: f.color }}>
                                            <Icon size={20} />
                                        </span>
                                        <h3 className="font-bold text-sm tracking-wide" style={{ color: f.color }}>{f.label}</h3>
                                    </div>
                                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
                                </motion.article>
                            );
                        })}
                    </div>
                </section>

                {/* ── Tech Stack ── */}
                <section className="w-full max-w-6xl" aria-labelledby="stack-heading">
                    <div className="section-header justify-center mb-8">
                        <div className="section-header-line" aria-hidden="true" />
                        <h2 id="stack-heading" className="text-sm font-mono tracking-[0.3em] uppercase text-[var(--neon-purple)]">
                            MERN Architecture
                        </h2>
                        <div className="section-header-line" style={{ background: "linear-gradient(90deg, transparent, rgba(191,0,255,0.4))" }} aria-hidden="true" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                        <article className="cyber-card card-glow-cyan">
                            <div className="scanlines" aria-hidden="true" />
                            <h3 className="text-[var(--neon-cyan)] font-bold mb-4 font-mono tracking-widest text-sm">FRONTEND_STACK</h3>
                            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                                {[
                                    ["React 19", "Concurrent rendering, latest hooks, optimistic updates"],
                                    ["Framer Motion", "Page transitions, micro-animations, counter effects"],
                                    ["Tailwind CSS", "Utility-first with custom Cyberpunk token system"],
                                    ["react-helmet-async", "Full SEO: JSON-LD schemas, OG, Twitter Cards"],
                                ].map(([key, val]) => (
                                    <li key={key} className="flex gap-2">
                                        <span className="text-[var(--neon-cyan)] font-mono mt-0.5">▹</span>
                                        <span><strong className="text-[var(--text-primary)]">{key}:</strong> {val}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                        <article className="cyber-card card-glow-purple">
                            <div className="scanlines" aria-hidden="true" />
                            <h3 className="text-[var(--neon-purple)] font-bold mb-4 font-mono tracking-widest text-sm">BACKEND_STACK</h3>
                            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                                {[
                                    ["Node.js + Express 5", "MVC RESTful API with 5 route groups and middleware"],
                                    ["MongoDB Atlas", "5 collections: users, posts, tools, activity, bookmarks"],
                                    ["Mongoose", "Schema validation, virtual fields, text-search indexes"],
                                    ["JWT + Bcrypt", "Stateless auth tokens, 10-round password hashing"],
                                ].map(([key, val]) => (
                                    <li key={key} className="flex gap-2">
                                        <span className="text-[var(--neon-purple)] font-mono mt-0.5">▹</span>
                                        <span><strong className="text-[var(--text-primary)]">{key}:</strong> {val}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    </div>
                </section>

                {/* ── FAQ (JSON-LD target) ── */}
                <section className="w-full max-w-3xl text-left" aria-labelledby="faq-heading">
                    <div className="section-header mb-8">
                        <h2 id="faq-heading" className="text-sm font-mono tracking-[0.3em] uppercase text-[var(--neon-green)]">FAQ</h2>
                        <div className="section-header-line" aria-hidden="true" />
                    </div>
                    <div className="space-y-4">
                        {FAQ.map((item, i) => (
                            <motion.details
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 * i }}
                                className="cyber-card group"
                            >
                                <div className="scanlines" aria-hidden="true" />
                                <summary className="cursor-pointer font-mono font-bold text-[var(--neon-cyan)] text-sm tracking-wide list-none flex justify-between items-center">
                                    {item.q}
                                    <span className="text-[var(--text-muted)] text-lg">+</span>
                                </summary>
                                <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">{item.a}</p>
                            </motion.details>
                        ))}
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className="w-full max-w-2xl" aria-labelledby="cta-heading">
                    <div className="cyber-card text-center card-glow-green">
                        <div className="scanlines" aria-hidden="true" />
                        <Bot size={40} className="mx-auto mb-4 text-[var(--neon-green)]" aria-hidden="true" />
                        <h2 id="cta-heading" className="text-2xl font-bold text-[var(--neon-green)] mb-2">Ready to Enter the Nexus?</h2>
                        <p className="text-sm text-[var(--text-muted)] mb-6">Join thousands of AI enthusiasts exploring the future of intelligence.</p>
                        <Link to="/register">
                            <NeonButton size="lg" variant="green">
                                Create Free Account →
                            </NeonButton>
                        </Link>
                    </div>
                </section>

            </div>
        </PageTransition>
    );
};

export default LandingPage;
