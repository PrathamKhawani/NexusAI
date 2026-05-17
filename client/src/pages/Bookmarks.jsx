import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, Wrench, Newspaper, Trash2, ExternalLink, Star } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/layout/PageTransition";
import CyberCard from "../components/ui/CyberCard";
import NeonButton from "../components/ui/NeonButton";
import SEOHead from "../components/ui/SEOHead";

const Bookmarks = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);
    const [filter, setFilter] = useState("all");  // "all" | "post" | "tool"
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => { if (!loading && !user) navigate("/login"); }, [user, loading, navigate]);

    useEffect(() => {
        if (!user) return;
        const token = localStorage.getItem("token");
        const params = filter !== "all" ? `?itemType=${filter}` : "";
        axios.get(`http://localhost:5000/api/bookmarks/me${params}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(({ data }) => setBookmarks(data.bookmarks || []))
            .catch(console.error)
            .finally(() => setDataLoading(false));
    }, [user, filter]); // eslint-disable-line

    const handleRemove = async (bookmarkId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`http://localhost:5000/api/bookmarks/${bookmarkId}`, { headers: { Authorization: `Bearer ${token}` } });
            setBookmarks(prev => prev.filter(b => b._id !== bookmarkId));
            toast.success("Bookmark removed");
        } catch (e) { toast.error("Failed to remove bookmark"); }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-[var(--neon-cyan)] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const posts = bookmarks.filter(b => b.itemType === "Post" || b.itemType === "post");
    const tools = bookmarks.filter(b => b.itemType === "AiTool" || b.itemType === "tool");
    const displayed = filter === "all" ? bookmarks : (filter === "post" ? posts : tools);

    return (
        <PageTransition>
            <SEOHead
                title="My Bookmarks"
                description="Your saved AI news articles and AI tools on NexusAI."
                canonicalPath="/bookmarks"
                noIndex={true}
                breadcrumbs={[{ name: "Home", url: "/" }, { name: "Dashboard", url: "/dashboard" }, { name: "Bookmarks", url: "/bookmarks" }]}
            />

            <div className="space-y-6">
                {/* Header */}
                <header>
                    <h1 className="text-2xl font-bold text-[var(--neon-cyan)] font-mono tracking-widest">SAVED_SIGNALS</h1>
                    <p className="text-xs font-mono text-[var(--text-muted)] mt-1 tracking-widest">
                        {posts.length} NEWS &nbsp;|&nbsp; {tools.length} TOOLS &nbsp;|&nbsp; {bookmarks.length} TOTAL BOOKMARKS
                    </p>
                </header>

                {/* Filter Tabs */}
                <nav aria-label="Bookmark filter" className="flex gap-3 flex-wrap">
                    {[
                        { key: "all", label: "All", icon: Bookmark, count: bookmarks.length },
                        { key: "post", label: "News", icon: Newspaper, count: posts.length },
                        { key: "tool", label: "Tools", icon: Wrench, count: tools.length },
                    ].map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button key={tab.key} onClick={() => setFilter(tab.key)}
                                className={`neon-btn flex items-center gap-2 text-xs px-4 py-2 ${filter === tab.key ? 'bg-[var(--neon-cyan)] !text-[var(--cyber-black)]' : ''}`}
                                aria-pressed={filter === tab.key}
                            >
                                <Icon size={13} />
                                <span>{tab.label} ({tab.count})</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Bookmarks Grid */}
                <section aria-label="Bookmarked items" aria-live="polite">
                    {dataLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 bg-[var(--cyber-panel)] rounded animate-pulse border border-[rgba(0,245,255,0.05)]" aria-hidden="true" />)}
                        </div>
                    ) : displayed.length === 0 ? (
                        <div className="cyber-card text-center py-20">
                            <div className="scanlines" aria-hidden="true" />
                            <Bookmark size={40} className="mx-auto mb-4 text-[var(--text-dim)]" aria-hidden="true" />
                            <p className="font-mono text-[var(--text-muted)] mb-4">NO SAVED SIGNALS IN THIS FREQUENCY</p>
                            <div className="flex justify-center gap-3">
                                <NeonButton size="sm" variant="cyan" onClick={() => navigate("/news")}>Browse News</NeonButton>
                                <NeonButton size="sm" variant="purple" onClick={() => navigate("/tools")}>Browse Tools</NeonButton>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {displayed.map((bm, i) => {
                                const item = bm.itemId;
                                const isPost = bm.itemType === "Post" || bm.itemType === "post";
                                return (
                                    <motion.article
                                        key={bm._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: 0.04 * i }}
                                        className={`cyber-card flex flex-col h-full ${isPost ? 'card-glow-cyan' : 'card-glow-purple'}`}
                                        aria-label={item?.title || item?.name}
                                    >
                                        <div className="scanlines" aria-hidden="true" />

                                        {/* Type badge */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`cyber-badge flex items-center gap-1 ${isPost ? 'text-[var(--neon-cyan)]' : 'text-[var(--neon-purple)]'}`}>
                                                {isPost ? <Newspaper size={10} /> : <Wrench size={10} />}
                                                {isPost ? "NEWS" : "TOOL"}
                                            </span>
                                            {!isPost && item?.rating && (
                                                <span className="flex items-center gap-1 text-xs font-mono text-[var(--neon-yellow)]">
                                                    <Star size={11} fill="currentColor" /> {item.rating}
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h2 className="font-bold text-[var(--text-primary)] text-sm leading-snug mb-2 flex-1">
                                            {item?.title || item?.name || "Untitled"}
                                        </h2>

                                        {/* Summary/Description */}
                                        {(item?.summary || item?.description) && (
                                            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4 line-clamp-2">
                                                {item.summary || item.description}
                                            </p>
                                        )}

                                        {/* Meta */}
                                        <div className="flex items-center gap-2 mb-3">
                                            {item?.category && <span className="cyber-badge text-[var(--text-muted)]">{item.category}</span>}
                                            {!isPost && item?.pricing && <span className="cyber-badge text-[var(--neon-green)]">{item.pricing}</span>}
                                        </div>

                                        {/* Saved date */}
                                        <p className="text-xs font-mono text-[var(--text-dim)] mb-3">
                                            Saved {new Date(bm.createdAt).toLocaleDateString()}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.04)] mt-auto">
                                            <button onClick={() => handleRemove(bm._id)}
                                                className="flex items-center gap-1 text-xs font-mono text-[var(--neon-red)] hover:opacity-80 transition-opacity"
                                                aria-label={`Remove bookmark for ${item?.title || item?.name}`}
                                            >
                                                <Trash2 size={13} /> Remove
                                            </button>
                                            {item?.url && (
                                                <a href={item.url} target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors"
                                                    aria-label={`Visit ${item?.title || item?.name}`}
                                                >
                                                    Visit <ExternalLink size={12} />
                                                </a>
                                            )}
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </PageTransition>
    );
};

export default Bookmarks;
