import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Globe, Github, Twitter, MapPin, Code, Save, Edit3, Zap, Flame } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/layout/PageTransition";
import CyberCard from "../components/ui/CyberCard";
import NeonButton from "../components/ui/NeonButton";
import NeonInput from "../components/ui/NeonInput";
import SEOHead from "../components/ui/SEOHead";

const SKILL_OPTIONS = ["Python", "JavaScript", "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Data Science", "LLMs", "PyTorch", "TensorFlow", "React", "Node.js", "MongoDB", "Docker", "Kubernetes", "AWS", "GCP", "Rust", "Go", "Web3"];

const Profile = () => {
    const navigate = useNavigate();
    const { user, setUser, loading } = useAuth();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ bio: "", location: "", website: "", githubUrl: "", twitterUrl: "", skills: [] });
    const [saving, setSaving] = useState(false);
    const [activity, setActivity] = useState([]);

    useEffect(() => { if (!loading && !user) navigate("/login"); }, [user, loading, navigate]);

    useEffect(() => {
        if (!user) return;
        setForm({
            bio: user.bio || "",
            location: user.location || "",
            website: user.website || "",
            githubUrl: user.githubUrl || "",
            twitterUrl: user.twitterUrl || "",
            skills: user.skills || [],
        });

        const token = localStorage.getItem("token");
        axios.get("http://localhost:5000/api/activity/me?limit=10", { headers: { Authorization: `Bearer ${token}` } })
            .then(({ data }) => setActivity(data.activities || []))
            .catch(console.error);
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem("token");
        try {
            const { data } = await axios.put("http://localhost:5000/api/users/update", form, { headers: { Authorization: `Bearer ${token}` } });
            setUser(data.user);
            toast.success("Profile updated! +10 XP");
            setEditing(false);
        } catch (e) { toast.error("Failed to save profile"); }
        finally { setSaving(false); }
    };

    const toggleSkill = (skill) => {
        setForm(prev => ({
            ...prev,
            skills: prev.skills.includes(skill) ? prev.skills.filter(s => s !== skill) : [...prev.skills, skill]
        }));
    };

    if (loading || !user) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-[var(--neon-cyan)] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const xpLevel = Math.floor((user.xpPoints || 0) / 100);
    const xpProgress = (user.xpPoints || 0) % 100;
    const initial = user.name?.charAt(0)?.toUpperCase() || "?";

    const actionLabels = {
        login: "🟢 Logged In", logout: "🔴 Logged Out", bookmark_add: "🔖 Bookmarked Item",
        tool_add: "⚡ Added AI Tool", tool_rate: "⭐ Rated Tool", upvote_tool: "👍 Upvoted Tool",
        post_view: "📰 Submitted Post", bookmark_remove: "🗑 Removed Bookmark",
    };

    return (
        <PageTransition>
            <SEOHead
                title="My Profile"
                description="Manage your NovaAI profile, skills, XP progress, streak, and activity timeline."
                canonicalPath="/profile"
                noIndex={true}
                breadcrumbs={[{ name: "Home", url: "/" }, { name: "Dashboard", url: "/dashboard" }, { name: "Profile", url: "/profile" }]}
            />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <header className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-[var(--neon-cyan)] font-mono tracking-widest">OPERATOR_PROFILE</h1>
                    <NeonButton size="sm" variant={editing ? "green" : "cyan"} onClick={() => setEditing(e => !e)}>
                        {editing ? <><Save size={14} className="inline mr-1" /> Cancel</> : <><Edit3 size={14} className="inline mr-1" /> Edit Profile</>}
                    </NeonButton>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Avatar + Stats */}
                    <div className="space-y-4">
                        <CyberCard className="text-center" delay={0.05}>
                            {/* Avatar */}
                            <div className="relative inline-flex items-center justify-center w-20 h-20 mx-auto mb-4 border-2 border-[var(--neon-cyan)] rounded-full"
                                style={{ boxShadow: "var(--glow-cyan)" }}
                                aria-label={`Avatar for ${user.name}`}
                            >
                                <span className="text-3xl font-black text-[var(--neon-cyan)] font-mono">{initial}</span>
                                <div className="neon-dot absolute bottom-1 right-1" title="Online" />
                            </div>
                            <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono">{user.name}</h2>
                            <p className="text-xs font-mono text-[var(--text-muted)] mb-1">{user.email}</p>
                            <span className="cyber-badge text-[var(--neon-purple)]">{user.role?.toUpperCase()}</span>
                        </CyberCard>

                        <CyberCard delay={0.1} glowColor="purple">
                            <h3 className="text-xs font-mono text-[var(--neon-purple)] tracking-widest mb-4">NEURAL STATS</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-mono mb-1">
                                        <span className="text-[var(--text-muted)]">XP — LVL {xpLevel}</span>
                                        <span className="text-[var(--neon-cyan)]">{user.xpPoints || 0} pts</span>
                                    </div>
                                    <div className="xp-bar-track">
                                        <motion.div className="xp-bar-fill" initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} transition={{ duration: 1.5, delay: 0.3 }} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Flame size={16} className="text-[var(--neon-yellow)]" aria-hidden="true" />
                                        <span className="text-xs font-mono text-[var(--text-muted)]">Streak</span>
                                    </div>
                                    <span className="text-lg font-bold font-mono text-[var(--neon-yellow)]">{user.streak || 0} 🔥</span>
                                </div>
                            </div>
                        </CyberCard>
                    </div>

                    {/* Right: Edit Form */}
                    <div className="lg:col-span-2 space-y-4">
                        <CyberCard delay={0.08}>
                            <h3 className="text-xs font-mono text-[var(--neon-cyan)] tracking-widest mb-5">PROFILE_DATA</h3>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="neon-input-wrap">
                                    <label className="neon-label" htmlFor="bio">Bio</label>
                                    <textarea id="bio" value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} disabled={!editing}
                                        className="neon-input resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="Tell the neural grid about yourself..." maxLength={300}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <NeonInput id="location" label="Location" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Neon City, Earth" icon={MapPin} />
                                    <NeonInput id="website" label="Website" type="url" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} placeholder="https://..." icon={Globe} />
                                    <NeonInput id="githubUrl" label="GitHub URL" type="url" value={form.githubUrl} onChange={e => setForm(p => ({ ...p, githubUrl: e.target.value }))} placeholder="https://github.com/..." icon={Github} />
                                    <NeonInput id="twitterUrl" label="Twitter URL" type="url" value={form.twitterUrl} onChange={e => setForm(p => ({ ...p, twitterUrl: e.target.value }))} placeholder="https://twitter.com/..." icon={Twitter} />
                                </div>

                                {/* Skills */}
                                <div>
                                    <label className="neon-label flex items-center gap-2"><Code size={12} /> Skills</label>
                                    <div className="flex flex-wrap gap-2 mt-2" role="group" aria-label="Skills selector">
                                        {SKILL_OPTIONS.map(skill => (
                                            <button key={skill} type="button" onClick={() => editing && toggleSkill(skill)}
                                                className={`cyber-badge transition-all cursor-pointer ${form.skills.includes(skill) ? 'text-[var(--neon-green)] border-[var(--neon-green)]' : 'text-[var(--text-muted)] border-[var(--text-muted)]'} ${!editing ? 'cursor-default opacity-60' : 'hover:text-[var(--neon-cyan)]'}`}
                                                aria-pressed={form.skills.includes(skill)}
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {editing && (
                                    <NeonButton type="submit" disabled={saving} fullWidth variant="green" size="lg">
                                        {saving ? "SAVING..." : "💾 SAVE PROFILE"}
                                    </NeonButton>
                                )}
                            </form>
                        </CyberCard>

                        {/* Activity Timeline */}
                        <CyberCard delay={0.12} glowColor="purple">
                            <h3 className="text-xs font-mono text-[var(--neon-purple)] tracking-widest mb-4">ACTIVITY_TIMELINE</h3>
                            {activity.length > 0 ? (
                                <ul className="space-y-2" aria-label="Recent activity">
                                    {activity.map((act, i) => (
                                        <motion.li key={act._id || i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}
                                            className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.03)] last:border-0 text-xs font-mono"
                                        >
                                            <span className="text-[var(--text-muted)]">{actionLabels[act.action] || act.action}</span>
                                            <div className="flex items-center gap-3">
                                                {act.xpEarned > 0 && <span className="text-[var(--neon-green)]">+{act.xpEarned}xp</span>}
                                                <span className="text-[var(--text-dim)]">{new Date(act.timestamp).toLocaleDateString()}</span>
                                            </div>
                                        </motion.li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs font-mono text-[var(--text-muted)] text-center py-6">No activity logged yet — start exploring!</p>
                            )}
                        </CyberCard>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Profile;
