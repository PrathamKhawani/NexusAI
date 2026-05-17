import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, ThumbsUp, ExternalLink, Plus, X, Bookmark, BookmarkCheck } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/layout/PageTransition";
import CyberCard from "../components/ui/CyberCard";
import NeonButton from "../components/ui/NeonButton";
import NeonInput from "../components/ui/NeonInput";
import SEOHead from "../components/ui/SEOHead";

const CATEGORIES = ["All", "LLM", "Image Gen", "Code", "Voice", "Data", "Productivity", "Video", "Research", "Other"];
const PRICING_COLORS = { Free: "var(--neon-green)", Freemium: "var(--neon-cyan)", Paid: "var(--neon-pink)", "Open Source": "var(--neon-purple)" };

const AITools = () => {
    const { user, setUser } = useAuth();
    const [tools, setTools] = useState([]);
    const [category, setCategory] = useState("All");
    const [sort, setSort] = useState("upvotes");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState({ name: "", description: "", category: "Other", url: "", pricing: "Freemium", tags: "" });
    const [addLoading, setAddLoading] = useState(false);
    const [upvoted, setUpvoted] = useState({});
    const [bookmarked, setBookmarked] = useState({});

    const checkBookmarks = async (loadedTools) => {
        if (!user) return;
        const token = localStorage.getItem("token");
        try {
            const checks = await Promise.all(loadedTools.map(t => 
                axios.get(`http://localhost:5000/api/bookmarks/check/${t._id}`, { headers: { Authorization: `Bearer ${token}` } })
            ));
            const newBookmarks = {};
            checks.forEach((res, i) => {
                if (res.data.isBookmarked) newBookmarks[loadedTools[i]._id] = res.data.bookmarkId;
            });
            setBookmarked(newBookmarks);
        } catch (e) { console.error("Failed to fetch bookmarks"); }
    };

    const fetchTools = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ limit: 12, page, sort });
            if (category !== "All") params.set("category", category);
            if (search.trim()) params.set("search", search.trim());
            const { data } = await axios.get(`http://localhost:5000/api/tools?${params}`);
            setTools(data.tools || []);
            setTotalPages(data.pages || 1);
            checkBookmarks(data.tools || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchTools(); }, [category, sort, page]); // eslint-disable-line

    const handleSearch = (e) => { if (e.key === "Enter") { setPage(1); fetchTools(); } };

    const handleUpvote = async (toolId) => {
        if (!user) { toast.error("Login to upvote tools"); return; }
        const token = localStorage.getItem("token");
        try {
            const { data } = await axios.put(`http://localhost:5000/api/tools/${toolId}/upvote`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setUpvoted(prev => ({ ...prev, [toolId]: data.upvoted }));
            setTools(prev => prev.map(t => t._id === toolId ? { ...t, upvotes: data.upvotes } : t));
            if (data.upvoted) {
                if (setUser) setUser(prev => ({ ...prev, xpPoints: (prev?.xpPoints || 0) + 5 }));
                toast.success("+5 XP — Tool upvoted!");
            } else {
                if (setUser) setUser(prev => ({ ...prev, xpPoints: Math.max(0, (prev?.xpPoints || 0) - 5) }));
                toast.success("Upvote removed");
            }
        } catch (e) { toast.error("Action failed"); }
    };

    const handleBookmark = async (toolId) => {
        if (!user) { toast.error("Login to bookmark tools"); return; }
        const token = localStorage.getItem("token");
        try {
            if (bookmarked[toolId]) {
                await axios.delete(`http://localhost:5000/api/bookmarks/${bookmarked[toolId]}`, { headers: { Authorization: `Bearer ${token}` } });
                setBookmarked(prev => { const next = { ...prev }; delete next[toolId]; return next; });
                if (setUser) setUser(prev => ({ ...prev, xpPoints: Math.max(0, (prev?.xpPoints || 0) - 5) }));
                toast.success("Bookmark removed");
            } else {
                const { data } = await axios.post("http://localhost:5000/api/bookmarks", { itemType: "tool", itemId: toolId }, { headers: { Authorization: `Bearer ${token}` } });
                setBookmarked(prev => ({ ...prev, [toolId]: data.bookmark._id }));
                if (setUser) setUser(prev => ({ ...prev, xpPoints: (prev?.xpPoints || 0) + 5 }));
                toast.success("+5 XP — Tool saved!");
            }
        } catch (e) { toast.error("Action failed"); }
    };

    const handleAddTool = async (e) => {
        e.preventDefault();
        if (!user) { toast.error("Login to add tools"); return; }
        setAddLoading(true);
        const token = localStorage.getItem("token");
        try {
            const payload = { ...addForm, tags: addForm.tags.split(",").map(t => t.trim()).filter(Boolean) };
            await axios.post("http://localhost:5000/api/tools", payload, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("+50 XP — AI Tool added to directory!");
            setShowAddModal(false);
            setAddForm({ name: "", description: "", category: "Other", url: "", pricing: "Freemium", tags: "" });
            setPage(1);
            fetchTools();
        } catch (e) { toast.error(e.response?.data?.errorMessage || "Failed to add tool"); }
        finally { setAddLoading(false); }
    };

    return (
        <PageTransition>
            <SEOHead
                title="AI Tools Directory"
                description="Browse 100+ AI tools: LLMs like ChatGPT and Claude, image generators like Midjourney, coding assistants like GitHub Copilot and Cursor. Upvote, rate, and discover AI tools."
                keywords={["AI tools", "best AI tools 2025", "ChatGPT alternatives", "AI coding tools", "AI image generators", "LLM comparison", "open source AI"]}
                canonicalPath="/tools"
                breadcrumbs={[{ name: "Home", url: "/" }, { name: "AI Tools", url: "/tools" }]}
            />

            <div className="space-y-6">
                {/* Header */}
                <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--neon-purple)] font-mono tracking-widest">AI_TOOLS_DIRECTORY</h1>
                        <p className="text-xs font-mono text-[var(--text-muted)] mt-1 tracking-widest">
                            CURATED NEURAL ARSENAL — {tools.length > 0 ? `${tools.length} TOOLS LOADED` : 'LOADING...'}
                        </p>
                    </div>
                    {user && (
                        <NeonButton variant="purple" size="sm" onClick={() => setShowAddModal(true)}>
                            <Plus size={14} className="inline mr-1" /> Add Tool
                        </NeonButton>
                    )}
                </header>

                {/* Search + Sort */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <NeonInput id="tool-search" placeholder="Search AI tools... (Enter)" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearch} icon={Search} />
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="sort-select" className="text-xs font-mono text-[var(--text-muted)] whitespace-nowrap">Sort by:</label>
                        <select
                            id="sort-select"
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                            className="neon-input text-xs py-2 px-3 cursor-pointer"
                            style={{ width: 'auto' }}
                        >
                            <option value="upvotes">Most Upvoted</option>
                            <option value="rating">Highest Rated</option>
                            <option value="newest">Newest</option>
                            <option value="name">A → Z</option>
                        </select>
                    </div>
                </div>

                {/* Category Tabs */}
                <nav aria-label="Tool categories" className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                            className={`neon-btn neon-btn-purple text-xs px-3 py-1 ${category === cat ? 'bg-[var(--neon-purple)] !text-[var(--cyber-black)]' : ''}`}
                            aria-pressed={category === cat}
                        >
                            <span>{cat}</span>
                        </button>
                    ))}
                </nav>

                {/* Tools Grid */}
                <section aria-label="AI tools" aria-live="polite">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-52 bg-[var(--cyber-panel)] rounded animate-pulse border border-[rgba(191,0,255,0.05)]" aria-hidden="true" />)}
                        </div>
                    ) : tools.length === 0 ? (
                        <div className="cyber-card text-center py-16">
                            <div className="scanlines" aria-hidden="true" />
                            <p className="font-mono text-[var(--text-muted)]">NO TOOLS IN THIS CATEGORY — <button onClick={() => setShowAddModal(true)} className="text-[var(--neon-purple)]">ADD ONE?</button></p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {tools.map((tool, i) => (
                                <motion.article key={tool._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}
                                    className="cyber-card flex flex-col h-full card-glow-purple group" aria-label={tool.name}
                                >
                                    <div className="scanlines" aria-hidden="true" />

                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h2 className="font-bold text-[var(--neon-purple)] text-sm">{tool.name}</h2>
                                            <span className="cyber-badge text-xs mt-1" style={{ color: PRICING_COLORS[tool.pricing] || 'var(--text-muted)' }}>{tool.pricing}</span>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            {tool.isFeatured && <span className="cyber-badge text-[var(--neon-yellow)]">⚡ FEATURED</span>}
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <span className="cyber-badge text-[var(--neon-cyan)] mb-3 self-start">{tool.category}</span>

                                    {/* Description */}
                                    <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4 flex-1 line-clamp-3">{tool.description}</p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {tool.tags?.slice(0, 3).map(tag => (
                                            <span key={tag} className="text-xs font-mono px-1.5 py-0.5 bg-[rgba(191,0,255,0.05)] border border-[rgba(191,0,255,0.15)] rounded text-[var(--text-muted)]">#{tag}</span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.04)]">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleUpvote(tool._id)}
                                                className={`flex items-center gap-1 text-xs font-mono transition-colors ${upvoted[tool._id] ? 'text-[var(--neon-purple)]' : 'text-[var(--text-muted)] hover:text-[var(--neon-purple)]'}`}
                                                aria-pressed={!!upvoted[tool._id]}
                                                aria-label={`Upvote ${tool.name}`}
                                            >
                                                <ThumbsUp size={13} /> {tool.upvotes}
                                            </button>
                                            <span className="flex items-center gap-1 text-xs font-mono text-[var(--neon-yellow)]">
                                                <Star size={13} fill="currentColor" /> {tool.rating}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleBookmark(tool._id)}
                                                className={`p-1.5 rounded border transition-colors ${bookmarked[tool._id] ? 'border-[var(--neon-cyan)] text-[var(--neon-cyan)]' : 'border-[rgba(255,255,255,0.1)] text-[var(--text-muted)] hover:text-[var(--neon-cyan)]'}`}
                                                aria-label={bookmarked[tool._id] ? "Remove bookmark" : "Add bookmark"}
                                                aria-pressed={!!bookmarked[tool._id]}
                                            >
                                                {bookmarked[tool._id] ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                                            </button>
                                            <a href={tool.url} target="_blank" rel="noopener noreferrer"
                                                className="p-1.5 rounded border border-[rgba(255,255,255,0.1)] text-[var(--text-muted)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)] transition-colors"
                                                aria-label={`Visit ${tool.name}`}
                                            >
                                                <ExternalLink size={14} />
                                            </a>
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
                        <NeonButton size="sm" variant="purple" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</NeonButton>
                        <span className="px-4 py-2 text-xs font-mono text-[var(--text-muted)]">{page} / {totalPages}</span>
                        <NeonButton size="sm" variant="purple" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</NeonButton>
                    </nav>
                )}
            </div>

            {/* Add Tool Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(2,4,10,0.85)]"
                        onClick={e => e.target === e.currentTarget && setShowAddModal(false)}
                        role="dialog" aria-modal="true" aria-labelledby="modal-title"
                    >
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="cyber-card w-full max-w-lg"
                        >
                            <div className="scanlines" aria-hidden="true" />
                            <div className="flex justify-between items-center mb-6">
                                <h2 id="modal-title" className="text-lg font-bold text-[var(--neon-purple)] font-mono tracking-widest">ADD AI TOOL</h2>
                                <button onClick={() => setShowAddModal(false)} className="text-[var(--text-muted)] hover:text-[var(--neon-red)]" aria-label="Close modal">
                                    <X size={18} />
                                </button>
                            </div>
                            <form onSubmit={handleAddTool} className="space-y-4">
                                <NeonInput id="name" label="Tool Name" value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} required placeholder="e.g. ChatGPT" />
                                <div className="neon-input-wrap">
                                    <label className="neon-label" htmlFor="description">Description</label>
                                    <textarea id="description" value={addForm.description} onChange={e => setAddForm(p => ({ ...p, description: e.target.value }))} required rows={3}
                                        className="neon-input resize-none" placeholder="What does this AI tool do?" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="neon-input-wrap">
                                        <label className="neon-label" htmlFor="tool-category">Category</label>
                                        <select id="tool-category" value={addForm.category} onChange={e => setAddForm(p => ({ ...p, category: e.target.value }))} className="neon-input">
                                            {["LLM","Image Gen","Code","Voice","Data","Productivity","Video","Research","Other"].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="neon-input-wrap">
                                        <label className="neon-label" htmlFor="pricing">Pricing</label>
                                        <select id="pricing" value={addForm.pricing} onChange={e => setAddForm(p => ({ ...p, pricing: e.target.value }))} className="neon-input">
                                            {["Free","Freemium","Paid","Open Source"].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <NeonInput id="tool-url" label="Tool URL" type="url" value={addForm.url} onChange={e => setAddForm(p => ({ ...p, url: e.target.value }))} required placeholder="https://tool.com" />
                                <NeonInput id="tags" label="Tags (comma-separated)" value={addForm.tags} onChange={e => setAddForm(p => ({ ...p, tags: e.target.value }))} placeholder="AI, LLM, Chatbot" />
                                <NeonButton type="submit" disabled={addLoading} fullWidth variant="purple" size="lg">
                                    {addLoading ? "SUBMITTING..." : "⚡ SUBMIT TOOL (+50 XP)"}
                                </NeonButton>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

export default AITools;
