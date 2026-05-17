import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Bookmark, BookmarkCheck, ExternalLink, Filter } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/layout/PageTransition";
import CyberCard from "../components/ui/CyberCard";
import NeonButton from "../components/ui/NeonButton";
import NeonInput from "../components/ui/NeonInput";
import SEOHead from "../components/ui/SEOHead";

const CATEGORIES = ["All", "AI", "ML", "Research", "DevTools", "Robotics", "Web3", "Product", "General"];

const CATEGORY_COLORS = {
    AI: "var(--neon-cyan)", ML: "var(--neon-purple)", Research: "var(--neon-blue)",
    DevTools: "var(--neon-green)", Robotics: "var(--neon-pink)", Web3: "var(--neon-yellow)",
    Product: "var(--text-muted)", General: "var(--text-muted)"
};

const NewsFeed = () => {
    const { user, setUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [category, setCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [bookmarked, setBookmarked] = useState({});

    const checkBookmarks = async (loadedPosts) => {
        if (!user) return;
        const token = localStorage.getItem("token");
        try {
            const checks = await Promise.all(loadedPosts.map(p => 
                axios.get(`http://localhost:5000/api/bookmarks/check/${p._id}`, { headers: { Authorization: `Bearer ${token}` } })
            ));
            const newBookmarks = {};
            checks.forEach((res, i) => {
                if (res.data.isBookmarked) newBookmarks[loadedPosts[i]._id] = res.data.bookmarkId;
            });
            setBookmarked(newBookmarks);
        } catch (e) { console.error("Failed to fetch bookmarks"); }
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ limit: 12, page });
            if (category !== "All") params.set("category", category);
            if (search.trim()) params.set("search", search.trim());
            const { data } = await axios.get(`http://localhost:5000/api/posts?${params}`);
            setPosts(data.posts || []);
            setTotalPages(data.pages || 1);
            checkBookmarks(data.posts || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchPosts(); }, [category, page]); // eslint-disable-line

    const handleSearch = (e) => {
        if (e.key === "Enter") { setPage(1); fetchPosts(); }
    };

    const toggleBookmark = async (postId) => {
        if (!user) { toast.error("Login to bookmark articles"); return; }
        const token = localStorage.getItem("token");
        try {
            if (bookmarked[postId]) {
                await axios.delete(`http://localhost:5000/api/bookmarks/${bookmarked[postId]}`, { headers: { Authorization: `Bearer ${token}` } });
                setBookmarked(prev => { const n = { ...prev }; delete n[postId]; return n; });
                if (setUser) setUser(prev => ({ ...prev, xpPoints: Math.max(0, (prev?.xpPoints || 0) - 5) }));
                toast.success("Bookmark removed");
            } else {
                const { data } = await axios.post("http://localhost:5000/api/bookmarks", { itemType: "post", itemId: postId }, { headers: { Authorization: `Bearer ${token}` } });
                setBookmarked(prev => ({ ...prev, [postId]: data.bookmark._id }));
                if (setUser) setUser(prev => ({ ...prev, xpPoints: (prev?.xpPoints || 0) + 5 }));
                toast.success("+5 XP — Article bookmarked!");
            }
        } catch (e) { toast.error(e.response?.data?.errorMessage || "Action failed"); }
    };

    return (
        <PageTransition>
            <SEOHead
                title="AI News Feed"
                description="Read the latest AI and tech news: GPT models, machine learning research, robotics, Web3, and developer tools. Curated by NexusAI."
                keywords={["AI news", "machine learning news", "GPT news", "tech news 2025", "AI research", "robotics news"]}
                canonicalPath="/news"
                breadcrumbs={[{ name: "Home", url: "/" }, { name: "AI News", url: "/news" }]}
            />

            <div className="space-y-6">
                {/* Header */}
                <header>
                    <h1 className="text-2xl font-bold text-[var(--neon-cyan)] font-mono tracking-widest">AI_NEWS_FEED</h1>
                    <p className="text-xs font-mono text-[var(--text-muted)] mt-1 tracking-widest">
                        LIVE INTELLIGENCE STREAM — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </header>

                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <NeonInput
                            id="search"
                            placeholder="Search AI news... (press Enter)"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={handleSearch}
                            icon={Search}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={14} className="text-[var(--text-muted)]" aria-hidden="true" />
                        <span className="text-xs font-mono text-[var(--text-muted)] whitespace-nowrap">Filter:</span>
                    </div>
                </div>

                {/* Category Tabs */}
                <nav aria-label="News categories" className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => { setCategory(cat); setPage(1); }}
                            className={`neon-btn text-xs px-3 py-1 ${category === cat ? 'bg-[var(--neon-cyan)] !text-[var(--cyber-black)]' : ''}`}
                            aria-pressed={category === cat}
                            aria-label={`Filter by ${cat}`}
                        >
                            <span>{cat}</span>
                        </button>
                    ))}
                </nav>

                {/* Posts Grid */}
                <section aria-label="News articles" aria-live="polite">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-48 bg-[var(--cyber-panel)] rounded animate-pulse border border-[rgba(0,245,255,0.05)]" aria-hidden="true" />
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="cyber-card text-center py-16">
                            <div className="scanlines" aria-hidden="true" />
                            <p className="font-mono text-[var(--text-muted)]">NO SIGNALS FOUND IN THIS FREQUENCY</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {posts.map((post, i) => (
                                <motion.article
                                    key={post._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.04 * i }}
                                    className="cyber-card flex flex-col h-full card-glow-cyan group"
                                    aria-label={post.title}
                                >
                                    <div className="scanlines" aria-hidden="true" />

                                    {/* Category + Source */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="cyber-badge" style={{ color: CATEGORY_COLORS[post.category] || 'var(--text-muted)' }}>
                                            {post.category}
                                        </span>
                                        <span className="text-xs font-mono text-[var(--text-dim)]">{post.source}</span>
                                    </div>

                                    {/* Title */}
                                    <h2 className="font-bold text-[var(--text-primary)] text-sm leading-snug mb-2 flex-1">{post.title}</h2>

                                    {/* Summary */}
                                    <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4 line-clamp-3">{post.summary}</p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {post.tags?.slice(0, 3).map(tag => (
                                            <span key={tag} className="text-xs font-mono px-1.5 py-0.5 bg-[rgba(0,245,255,0.05)] border border-[rgba(0,245,255,0.1)] rounded text-[var(--text-muted)]">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-[rgba(255,255,255,0.04)]">
                                        <span className="text-xs font-mono text-[var(--text-dim)]">
                                            {new Date(post.publishedAt).toLocaleDateString()}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => toggleBookmark(post._id)}
                                                className={`p-1.5 rounded border transition-colors ${bookmarked[post._id] ? 'border-[var(--neon-cyan)] text-[var(--neon-cyan)]' : 'border-[rgba(255,255,255,0.1)] text-[var(--text-muted)] hover:text-[var(--neon-cyan)]'}`}
                                                aria-label={bookmarked[post._id] ? "Remove bookmark" : "Add bookmark"}
                                                aria-pressed={!!bookmarked[post._id]}
                                            >
                                                {bookmarked[post._id] ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                                            </button>
                                            {post.url && (
                                                <a
                                                    href={post.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 rounded border border-[rgba(255,255,255,0.1)] text-[var(--text-muted)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)] transition-colors"
                                                    aria-label={`Read full article: ${post.title}`}
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    )}
                </section>

                {/* Pagination */}
                {totalPages > 1 && (
                    <nav aria-label="Pagination" className="flex justify-center gap-3">
                        <NeonButton size="sm" variant="cyan" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                            ← Prev
                        </NeonButton>
                        <span className="px-4 py-2 text-xs font-mono text-[var(--text-muted)]">
                            {page} / {totalPages}
                        </span>
                        <NeonButton size="sm" variant="cyan" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                            Next →
                        </NeonButton>
                    </nav>
                )}
            </div>
        </PageTransition>
    );
};

export default NewsFeed;
