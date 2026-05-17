import Post from "../models/postModel.js";
import Activity from "../models/activityModel.js";

// Curated seed data — shown when DB is empty
const SEED_POSTS = [
    {
        title: "GPT-5 Arrives: OpenAI Claims 40% Jump in Reasoning Benchmarks",
        summary: "OpenAI's latest flagship model GPT-5 demonstrates dramatic improvements in multi-step reasoning, coding, and mathematical problem-solving, outperforming all known competitors on major benchmarks.",
        source: "The Verge", category: "AI", tags: ["GPT-5", "OpenAI", "LLM", "Reasoning"],
        isFeatured: true, url: "https://theverge.com", imageUrl: "", publishedAt: new Date("2026-05-15"),
    },
    {
        title: "Google DeepMind's AlphaFold 3 Predicts Protein Interactions with Record Accuracy",
        summary: "DeepMind releases AlphaFold 3, capable of predicting protein-DNA and protein-molecule interactions, a breakthrough that could accelerate drug discovery by decades.",
        source: "Nature", category: "Research", tags: ["AlphaFold", "DeepMind", "Biotech", "ML"],
        isFeatured: false, url: "https://nature.com", imageUrl: "", publishedAt: new Date("2026-05-10"),
    },
    {
        title: "Meta's Code Llama 3 Rivals GitHub Copilot in Developer Benchmarks",
        summary: "Meta's open-source Code Llama 3 reaches 78% accuracy on HumanEval, finally offering a credible free alternative to proprietary coding assistants.",
        source: "TechCrunch", category: "DevTools", tags: ["Meta", "Code Llama", "Open Source", "Coding AI"],
        isFeatured: false, url: "https://techcrunch.com", imageUrl: "", publishedAt: new Date("2026-05-08"),
    },
    {
        title: "NVIDIA Blackwell GPUs Slash AI Inference Costs by 70%",
        summary: "NVIDIA's next-gen Blackwell architecture is now shipping at scale, and early benchmarks show inference on LLMs is 70% cheaper per token than Hopper, reshaping cloud AI economics.",
        source: "Wired", category: "AI", tags: ["NVIDIA", "Blackwell", "GPU", "Inference"],
        isFeatured: false, url: "https://wired.com", imageUrl: "", publishedAt: new Date("2026-05-05"),
    },
    {
        title: "Mistral Releases Mixture-of-Experts Model Beating GPT-4 at Half the Cost",
        summary: "The French AI lab Mistral AI drops a 140B MoE model that benchmarks above GPT-4 on MMLU while requiring fewer active parameters per token — a major cost advantage.",
        source: "Ars Technica", category: "ML", tags: ["Mistral", "MoE", "Open Source", "Efficiency"],
        isFeatured: false, url: "https://arstechnica.com", imageUrl: "", publishedAt: new Date("2026-05-02"),
    },
    {
        title: "Autonomous AI Agents Can Now Operate Real Web Browsers Without Human Help",
        summary: "Startups like Cognition and Adept are shipping agents that browse the web, fill forms, write emails, and execute multi-step digital workflows fully autonomously.",
        source: "MIT Tech Review", category: "AI", tags: ["Agents", "Automation", "LLM", "AGI"],
        isFeatured: true, url: "https://technologyreview.com", imageUrl: "", publishedAt: new Date("2026-04-28"),
    },
    {
        title: "Stable Diffusion 4 Generates Photorealistic Video from Text Prompts",
        summary: "Stability AI's latest release supports full HD 60fps video generation from text, closing the gap with Sora and opening a new wave of AI-native creative workflows.",
        source: "Stability AI Blog", category: "AI", tags: ["Stable Diffusion", "Video AI", "Generative AI"],
        isFeatured: false, url: "https://stability.ai", imageUrl: "", publishedAt: new Date("2026-04-22"),
    },
    {
        title: "Web3 AI Convergence: Smart Contracts That Learn and Adapt",
        summary: "Researchers at ETH Zurich propose a new paradigm of on-chain AI inference, embedding lightweight ML models directly into Ethereum smart contracts.",
        source: "CoinDesk", category: "Web3", tags: ["Web3", "Smart Contracts", "On-chain AI", "Ethereum"],
        isFeatured: false, url: "https://coindesk.com", imageUrl: "", publishedAt: new Date("2026-04-18"),
    },
    {
        title: "Apple Enters the Fray with 'Apple Intelligence 2.0'",
        summary: "Apple'sWWDC 2026 keynote introduces fully on-device LLMs that process complex requests natively on the iPhone 17 without sending data to the cloud.",
        source: "Bloomberg", category: "AI", tags: ["Apple", "On-device AI", "Privacy"],
        isFeatured: true, url: "https://bloomberg.com", imageUrl: "", publishedAt: new Date("2026-05-16"),
    },
    {
        title: "Boston Dynamics' Atlas Now Fully Powered by End-to-End Neural Networks",
        summary: "The legendary humanoid robot Atlas has retired its hydraulic actuators and heuristic programming, moving to a fully electric, ML-driven control system.",
        source: "IEEE Spectrum", category: "Robotics", tags: ["Robotics", "Boston Dynamics", "Neural Networks"],
        isFeatured: false, url: "https://ieee.org", imageUrl: "", publishedAt: new Date("2026-05-12"),
    },
    {
        title: "Google Search Generative Experience Now Serves 80% of User Queries",
        summary: "Google's transition from traditional blue links to generative AI answers is almost complete, massively changing the SEO and digital marketing landscape.",
        source: "Search Engine Land", category: "Product", tags: ["Google", "Search", "SGE", "SEO"],
        isFeatured: false, url: "https://searchengineland.com", imageUrl: "", publishedAt: new Date("2026-05-09"),
    },
    {
        title: "DeepSeek Drops New V3 Model Outperforming Proprietary Counterparts",
        summary: "DeepSeek AI releases its highly anticipated V3 model, showing unparalleled coding and mathematical capabilities for an open-weight model.",
        source: "VentureBeat", category: "ML", tags: ["DeepSeek", "Open Source", "LLM"],
        isFeatured: true, url: "https://venturebeat.com", imageUrl: "", publishedAt: new Date("2026-05-17"),
    }
];

// GET /api/posts — list all posts with optional category/tag/search filters
export const getPosts = async (req, res) => {
    try {
        const { category, tag, search, page = 1, limit = 12, featured } = req.query;
        let query = {};

        if (category && category !== 'All') query.category = category;
        if (tag) query.tags = { $in: [tag] };
        if (featured === 'true') query.isFeatured = true;
        if (search) query.$text = { $search: search };

        // Seed if empty
        const count = await Post.countDocuments();
        if (count === 0) await Post.insertMany(SEED_POSTS);

        const total = await Post.countDocuments(query);
        const posts = await Post.find(query)
            .sort({ publishedAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .select('-content -__v');

        res.status(200).json({ posts, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

// GET /api/posts/:id — single post
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ errorMessage: "Post not found" });

        // Increment views
        post.views += 1;
        await post.save();

        res.status(200).json({ post });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

// POST /api/posts — create a post (auth required)
export const createPost = async (req, res) => {
    try {
        const { title, summary, content, source, url, imageUrl, category, tags } = req.body;
        if (!title || !summary) return res.status(400).json({ errorMessage: "Title and summary required" });

        const post = await Post.create({
            title, summary, content, source, url, imageUrl, category,
            tags: tags || [],
            submittedBy: req.user._id,
        });

        // Log activity + award XP
        await Activity.create({ userId: req.user._id, action: 'post_view', metadata: { postId: post._id }, xpEarned: 10 });

        res.status(201).json({ message: "Post created", post });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

// DELETE /api/posts/:id
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ errorMessage: "Post not found" });
        if (post.submittedBy?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ errorMessage: "Not authorized" });
        }
        await post.deleteOne();
        res.status(200).json({ message: "Post deleted" });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

// GET /api/posts/cron-update (Vercel serverless cron trigger)
import { fetchAndSaveNews } from "../services/newsCron.js";
export const triggerNewsCron = async (req, res) => {
    try {
        await fetchAndSaveNews();
        res.status(200).json({ success: true, message: "News cron executed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, errorMessage: error.message });
    }
};
