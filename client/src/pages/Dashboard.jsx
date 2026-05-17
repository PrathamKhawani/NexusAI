import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Wrench, Bookmark, Zap, TrendingUp, Clock, ChevronRight, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/layout/PageTransition";
import StatCard from "../components/ui/StatCard";
import CyberCard from "../components/ui/CyberCard";
import NeonButton from "../components/ui/NeonButton";
import SEOHead from "../components/ui/SEOHead";
import axios from "axios";

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, loading, fetchUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [tools, setTools] = useState([]);
    const [activity, setActivity] = useState([]);
    const [bookmarkCount, setBookmarkCount] = useState(0);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) navigate("/login");
    }, [user, loading, navigate]);

    useEffect(() => {
        if (!user) return;
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const fetchAll = async () => {
            try {
                const [postsRes, toolsRes, actRes, bmRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/posts?limit=4&featured=true"),
                    axios.get("http://localhost:5000/api/tools?limit=3&sort=upvotes"),
                    axios.get("http://localhost:5000/api/activity/me?limit=6", { headers }),
                    axios.get("http://localhost:5000/api/bookmarks/me", { headers }),
                ]);
                setPosts(postsRes.data.posts || []);
                setTools(toolsRes.data.tools || []);
                setActivity(actRes.data.activities || []);
                setBookmarkCount(bmRes.data.bookmarks?.length || 0);
                if (fetchUser) fetchUser(); // Ensure user stats (like XP) are perfectly synced
            } catch (e) {
                console.error(e);
            } finally {
                setDataLoading(false);
            }
        };
        fetchAll();
    }, [user]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-2 border-[var(--neon-cyan)] border-t-transparent rounded-full animate-spin mx-auto mb-4" aria-label="Loading..." />
                <p className="font-mono text-xs text-[var(--neon-cyan)] tracking-widest animate-pulse">LOADING NEURAL GRID...</p>
            </div>
        </div>
    );

    if (!user) return null;

    const xpLevel = Math.floor((user.xpPoints || 0) / 100);
    const xpProgress = ((user.xpPoints || 0) % 100);

    const actionColors = {
        login: 'var(--neon-green)', logout: 'var(--neon-red)', bookmark_add: 'var(--neon-cyan)',
        tool_add: 'var(--neon-purple)', tool_rate: 'var(--neon-yellow)', upvote_tool: 'var(--neon-pink)',
        post_view: 'var(--neon-blue)', bookmark_remove: 'var(--neon-red)', search: 'var(--text-muted)',
    };

    return (
        <PageTransition>
            <SEOHead
                title="Dashboard"
                description="Your NovaAI neural intelligence dashboard. View AI news, tools, XP progress, and activity timeline."
                canonicalPath="/dashboard"
                noIndex={true}
                breadcrumbs={[{ name: "Home", url: "/" }, { name: "Dashboard", url: "/dashboard" }]}
            />

            <div className="space-y-8">
                {/* ── Header ── */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--neon-cyan)] font-mono tracking-widest">
                            NEURAL_DASHBOARD
                        </h1>
                        <p className="text-sm font-mono text-[var(--text-muted)] mt-1">
                            OPERATOR: <span className="text-[var(--neon-green)]">{user.name?.toUpperCase()}</span> &nbsp;|&nbsp;
                            RANK: <span className="text-[var(--neon-purple)]">LVL {xpLevel}</span>
                        </p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <Link to="/news">
                            <NeonButton size="sm" variant="cyan">⚡ News Feed</NeonButton>
                        </Link>
                        <Link to="/tools">
                            <NeonButton size="sm" variant="purple">Browse Tools</NeonButton>
                        </Link>
                        <Link to="/profile">
                            <NeonButton size="sm" variant="green">Edit Profile</NeonButton>
                        </Link>
                    </div>
                </header>

                {/* ── XP Bar ── */}
                <CyberCard className="py-4" delay={0.05}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-[var(--neon-green)] tracking-widest">XP PROGRESS — LEVEL {xpLevel}</span>
                        <span className="text-xs font-mono text-[var(--text-muted)]">{user.xpPoints || 0} XP &nbsp;|&nbsp; STREAK: <span className="text-[var(--neon-yellow)]">{user.streak || 0}🔥</span></span>
                    </div>
                    <div className="xp-bar-track">
                        <motion.div
                            className="xp-bar-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${xpProgress}%` }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                        />
                    </div>
                    <p className="text-xs text-[var(--text-dim)] font-mono mt-1">{xpProgress}/100 XP to Level {xpLevel + 1}</p>
                </CyberCard>

                {/* ── KPI Stats ── */}
                <section aria-labelledby="stats-heading">
                    <h2 id="stats-heading" className="sr-only">Stats</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard label="XP Points" value={user.xpPoints || 0} icon={Zap} color="cyan" delay={0.1} />
                        <StatCard label="AI Tools" value={tools.length > 0 ? 12 : 0} icon={Wrench} color="purple" delay={0.15} />
                        <StatCard label="Bookmarks" value={bookmarkCount} icon={Bookmark} color="green" delay={0.2} />
                        <StatCard label="Streak" value={user.streak || 0} unit="days" icon={TrendingUp} color="pink" delay={0.25} />
                    </div>
                </section>

                {/* ── Featured AI News + Activity ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* News Widget */}
                    <section className="lg:col-span-2" aria-labelledby="news-heading">
                        <div className="section-header mb-4">
                            <Brain size={16} className="text-[var(--neon-cyan)]" aria-hidden="true" />
                            <h2 id="news-heading" className="text-sm font-mono tracking-[0.2em] uppercase text-[var(--neon-cyan)]">Featured AI News</h2>
                            <div className="section-header-line" aria-hidden="true" />
                            <Link to="/news" className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--neon-cyan)] whitespace-nowrap">
                                All News →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {dataLoading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-16 bg-[var(--cyber-panel)] rounded animate-pulse border border-[rgba(0,245,255,0.05)]" />
                                ))
                            ) : posts.length > 0 ? posts.map((post, i) => (
                                <motion.article
                                    key={post._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * i }}
                                    className="cyber-card py-3 px-4 cursor-pointer"
                                    onClick={() => navigate('/news')}
                                    aria-label={post.title}
                                >
                                    <div className="scanlines" aria-hidden="true" />
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="cyber-badge text-[var(--neon-cyan)]">{post.category}</span>
                                                <span className="text-xs font-mono text-[var(--text-dim)]">{post.source}</span>
                                            </div>
                                            <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">{post.title}</h3>
                                        </div>
                                        <ChevronRight size={14} className="text-[var(--text-dim)] shrink-0 mt-1" aria-hidden="true" />
                                    </div>
                                </motion.article>
                            )) : (
                                <div className="cyber-card text-center py-8 text-[var(--text-muted)] font-mono text-sm">
                                    <div className="scanlines" aria-hidden="true" />
                                    No news loaded yet — <Link to="/news" className="text-[var(--neon-cyan)]">visit News Feed</Link>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Activity Timeline */}
                    <section aria-labelledby="activity-heading">
                        <div className="section-header mb-4">
                            <Clock size={16} className="text-[var(--neon-purple)]" aria-hidden="true" />
                            <h2 id="activity-heading" className="text-sm font-mono tracking-[0.2em] uppercase text-[var(--neon-purple)]">Activity Log</h2>
                            <div className="section-header-line" style={{ background: "linear-gradient(90deg, rgba(191,0,255,0.4), transparent)" }} aria-hidden="true" />
                        </div>
                        <CyberCard glowColor="purple" className="py-3 px-3">
                            {dataLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="h-8 mb-2 bg-[var(--cyber-surface)] rounded animate-pulse" />
                                ))
                            ) : activity.length > 0 ? (
                                <ul className="space-y-2">
                                    {activity.map((act, i) => (
                                        <motion.li
                                            key={act._id || i}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * i }}
                                            className="flex items-center gap-2 py-1.5 border-b border-[rgba(255,255,255,0.03)] last:border-0"
                                        >
                                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: actionColors[act.action] || 'var(--text-muted)', boxShadow: `0 0 6px ${actionColors[act.action] || 'transparent'}` }} aria-hidden="true" />
                                            <span className="text-xs font-mono text-[var(--text-muted)] flex-1 truncate">{act.action?.replace(/_/g, " ")}</span>
                                            {act.xpEarned > 0 && <span className="text-xs font-mono text-[var(--neon-green)] shrink-0">+{act.xpEarned}xp</span>}
                                        </motion.li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs font-mono text-[var(--text-muted)] text-center py-6">No activity yet — start exploring!</p>
                            )}
                        </CyberCard>
                    </section>
                </div>

                {/* ── Featured AI Tools ── */}
                <section aria-labelledby="tools-heading">
                    <div className="section-header mb-4">
                        <Wrench size={16} className="text-[var(--neon-green)]" aria-hidden="true" />
                        <h2 id="tools-heading" className="text-sm font-mono tracking-[0.2em] uppercase text-[var(--neon-green)]">Top AI Tools</h2>
                        <div className="section-header-line" style={{ background: "linear-gradient(90deg, rgba(0,255,136,0.4), transparent)" }} aria-hidden="true" />
                        <Link to="/tools" className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--neon-green)] whitespace-nowrap">
                            All Tools →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {dataLoading ? Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-28 bg-[var(--cyber-panel)] rounded animate-pulse border border-[rgba(0,245,255,0.05)]" />
                        )) : tools.map((tool, i) => (
                            <motion.article
                                key={tool._id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.08 * i }}
                                className="cyber-card card-glow-green cursor-pointer"
                                onClick={() => window.open(tool.url, '_blank', 'noopener,noreferrer')}
                                aria-label={`${tool.name} - ${tool.category}`}
                            >
                                <div className="scanlines" aria-hidden="true" />
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-[var(--neon-green)] text-sm">{tool.name}</h3>
                                    <span className="cyber-badge text-[var(--neon-yellow)] shrink-0 ml-2">⭐ {tool.rating}</span>
                                </div>
                                <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2 mb-2">{tool.description}</p>
                                <div className="flex gap-2">
                                    <span className="cyber-badge text-[var(--neon-purple)]">{tool.category}</span>
                                    <span className="cyber-badge text-[var(--text-muted)]">{tool.pricing}</span>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </section>

            </div>
        </PageTransition>
    );
};

export default Dashboard;
