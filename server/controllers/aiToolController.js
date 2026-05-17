import AiTool from "../models/aiToolModel.js";
import Activity from "../models/activityModel.js";
import Users from "../models/userModel.js";

const SEED_TOOLS = [
    {
        name: "ChatGPT", description: "OpenAI's flagship conversational AI — the most widely used LLM in the world, powering millions of use cases from writing to coding to research.", category: "LLM",
        url: "https://chat.openai.com", tags: ["OpenAI", "Conversational", "GPT-4"], pricing: "Freemium", rating: 4.8, reviewCount: 18421, isVerified: true, isFeatured: true, upvotes: 9820
    },
    {
        name: "GitHub Copilot", description: "AI pair programmer trained on billions of lines of code. Suggests whole lines or entire functions right inside your editor.", category: "Code",
        url: "https://github.com/features/copilot", tags: ["Coding", "Microsoft", "VSCode"], pricing: "Freemium", rating: 4.7, reviewCount: 12055, isVerified: true, isFeatured: true, upvotes: 7650
    },
    {
        name: "Midjourney", description: "State-of-the-art image generation model producing stunning photorealistic and artistic visuals from text prompts via Discord.", category: "Image Gen",
        url: "https://midjourney.com", tags: ["Image Generation", "Art", "Creative"], pricing: "Paid", rating: 4.9, reviewCount: 22000, isVerified: true, isFeatured: true, upvotes: 11300
    },
    {
        name: "Claude", description: "Anthropic's safety-focused LLM with a 200K token context window. Excellent at long-document analysis, reasoning, and nuanced conversation.", category: "LLM",
        url: "https://claude.ai", tags: ["Anthropic", "Safety", "Long Context"], pricing: "Freemium", rating: 4.7, reviewCount: 9800, isVerified: true, isFeatured: false, upvotes: 6700
    },
    {
        name: "Perplexity AI", description: "AI-powered search engine that answers questions with real-time web citations, replacing traditional keyword search with conversational intelligence.", category: "Research",
        url: "https://perplexity.ai", tags: ["Search", "Research", "Citations"], pricing: "Freemium", rating: 4.6, reviewCount: 7300, isVerified: true, isFeatured: false, upvotes: 5200
    },
    {
        name: "ElevenLabs", description: "Ultra-realistic AI voice generation and cloning. Produces natural-sounding speech in 29 languages with millisecond latency.", category: "Voice",
        url: "https://elevenlabs.io", tags: ["Voice", "TTS", "Cloning"], pricing: "Freemium", rating: 4.8, reviewCount: 6100, isVerified: true, isFeatured: false, upvotes: 4800
    },
    {
        name: "Hugging Face", description: "The GitHub of AI — an open platform hosting 300,000+ models, datasets, and ML Spaces. The central hub for open-source AI development.", category: "Research",
        url: "https://huggingface.co", tags: ["Open Source", "Models", "Transformers"], pricing: "Open Source", rating: 4.9, reviewCount: 15000, isVerified: true, isFeatured: false, upvotes: 13400
    },
    {
        name: "Runway ML", description: "Professional-grade AI video editing and generation platform. Gen-3 model creates cinematic video from text and image inputs.", category: "Video",
        url: "https://runwayml.com", tags: ["Video", "Creative", "Gen-3"], pricing: "Freemium", rating: 4.6, reviewCount: 5400, isVerified: true, isFeatured: false, upvotes: 4100
    },
    {
        name: "Cursor", description: "AI-first code editor built on VSCode that writes, edits, and debugs entire codebases. The most advanced AI coding environment available.", category: "Code",
        url: "https://cursor.sh", tags: ["Coding", "IDE", "AI Editor"], pricing: "Freemium", rating: 4.9, reviewCount: 8900, isVerified: true, isFeatured: true, upvotes: 8200
    },
    {
        name: "Notion AI", description: "Notion's built-in AI assistant that writes, summarizes, translates, and auto-fills databases — productivity intelligence embedded in your workspace.", category: "Productivity",
        url: "https://notion.so/product/ai", tags: ["Productivity", "Writing", "Workspace"], pricing: "Freemium", rating: 4.4, reviewCount: 11200, isVerified: true, isFeatured: false, upvotes: 5600
    },
    {
        name: "Ollama", description: "Run powerful open-source LLMs (Llama 3, Mistral, Phi) locally on your laptop with zero cloud dependency. Simple CLI, powerful results.", category: "LLM",
        url: "https://ollama.ai", tags: ["Local", "Open Source", "Privacy", "Llama"], pricing: "Open Source", rating: 4.8, reviewCount: 4500, isVerified: true, isFeatured: false, upvotes: 6900
    },
    {
        name: "Replicate", description: "Run open-source ML models via a simple API. Deploy image, video, language, and audio models without managing any infrastructure.", category: "Data",
        url: "https://replicate.com", tags: ["API", "ML", "Deploy", "Open Source"], pricing: "Paid", rating: 4.5, reviewCount: 3200, isVerified: true, isFeatured: false, upvotes: 2900
    },
    {
        name: "Sora", description: "OpenAI's text-to-video model capable of generating up to one minute of high fidelity video while maintaining visual quality and adherence to the user's prompt.", category: "Video",
        url: "https://openai.com/sora", tags: ["Video", "OpenAI", "Generative AI"], pricing: "Paid", rating: 4.9, reviewCount: 8500, isVerified: true, isFeatured: true, upvotes: 9500
    },
    {
        name: "Gemini", description: "Google's most capable AI model, natively multimodal, designed to seamlessly understand, operate across, and combine different types of information including text, code, audio, image, and video.", category: "LLM",
        url: "https://gemini.google.com", tags: ["Google", "Multimodal", "Gemini 1.5 Pro"], pricing: "Freemium", rating: 4.7, reviewCount: 14200, isVerified: true, isFeatured: true, upvotes: 8100
    },
    {
        name: "LangChain", description: "A framework for developing applications powered by language models. It provides standard interfaces for chains, lots of integrations with other tools, and end-to-end chains for common applications.", category: "DevTools",
        url: "https://langchain.com", tags: ["Framework", "LLMOps", "Open Source"], pricing: "Open Source", rating: 4.6, reviewCount: 5200, isVerified: true, isFeatured: false, upvotes: 4300
    },
    {
        name: "AutoGPT", description: "An experimental open-source application showcasing the capabilities of the GPT-4 language model. It chains together LLM thoughts to autonomously achieve whatever goal you set.", category: "DevTools",
        url: "https://github.com/Significant-Gravitas/AutoGPT", tags: ["Agents", "Autonomous", "GPT-4"], pricing: "Open Source", rating: 4.5, reviewCount: 12000, isVerified: true, isFeatured: false, upvotes: 6100
    },
    {
        name: "Synthesia", description: "Create professional AI videos from text in 120+ languages. Synthesia allows you to generate videos with human avatars without cameras, microphones or studios.", category: "Video",
        url: "https://www.synthesia.io", tags: ["Video", "Avatars", "TTS"], pricing: "Paid", rating: 4.5, reviewCount: 3800, isVerified: true, isFeatured: false, upvotes: 3500
    },
    {
        name: "Krea AI", description: "Real-time AI image generation and upscaling tool for creatives. Krea allows you to sketch or control the generation process in real-time.", category: "Image Gen",
        url: "https://www.krea.ai", tags: ["Image Generation", "Real-time", "Design"], pricing: "Freemium", rating: 4.8, reviewCount: 2900, isVerified: true, isFeatured: false, upvotes: 4200
    },
    {
        name: "Vercel v0", description: "Generative UI system by Vercel. Describe a user interface in text and v0 generates copy-and-paste React code based on Shadcn UI and Tailwind CSS.", category: "Code",
        url: "https://v0.dev", tags: ["UI", "React", "Tailwind", "Vercel"], pricing: "Freemium", rating: 4.8, reviewCount: 4100, isVerified: true, isFeatured: true, upvotes: 7500
    },
    {
        name: "Canva Magic Studio", description: "All the power of AI, all in one place. Magic Studio brings together the best AI features to help you write, design, and create like never before.", category: "Productivity",
        url: "https://www.canva.com/magic", tags: ["Design", "Productivity", "Image Gen"], pricing: "Freemium", rating: 4.6, reviewCount: 15600, isVerified: true, isFeatured: false, upvotes: 6200
    }
];

// GET /api/tools
export const getTools = async (req, res) => {
    try {
        const { category, search, sort = 'upvotes', page = 1, limit = 12, featured } = req.query;
        let query = {};

        if (category && category !== 'All') query.category = category;
        if (featured === 'true') query.isFeatured = true;
        if (search) query.$text = { $search: search };

        // Seed if empty
        const count = await AiTool.countDocuments();
        if (count === 0) await AiTool.insertMany(SEED_TOOLS);

        const sortMap = {
            upvotes: { upvotes: -1 },
            rating: { rating: -1 },
            newest: { createdAt: -1 },
            name: { name: 1 },
        };

        const total = await AiTool.countDocuments(query);
        const tools = await AiTool.find(query)
            .sort(sortMap[sort] || { upvotes: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .select('-reviews -__v');

        res.status(200).json({ tools, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

// GET /api/tools/:id
export const getToolById = async (req, res) => {
    try {
        const tool = await AiTool.findById(req.params.id).populate('reviews.userId', 'name');
        if (!tool) return res.status(404).json({ errorMessage: "Tool not found" });
        res.status(200).json({ tool });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

// POST /api/tools — add new tool (auth required)
export const createTool = async (req, res) => {
    try {
        const { name, description, category, url, logoUrl, tags, pricing } = req.body;
        if (!name || !description || !url) return res.status(400).json({ errorMessage: "Name, description and URL required" });

        const existing = await AiTool.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existing) return res.status(400).json({ errorMessage: "Tool already exists" });

        const tool = await AiTool.create({
            name, description, category, url, logoUrl, tags: tags || [], pricing,
            addedBy: req.user._id,
        });

        // Award XP for adding a tool
        await Users.findByIdAndUpdate(req.user._id, { $inc: { xpPoints: 50 } });
        await Activity.create({ userId: req.user._id, action: 'tool_add', metadata: { toolId: tool._id, toolName: name }, xpEarned: 50 });

        res.status(201).json({ message: "Tool added", tool });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

// PUT /api/tools/:id/upvote
export const upvoteTool = async (req, res) => {
    try {
        const tool = await AiTool.findById(req.params.id);
        if (!tool) return res.status(404).json({ errorMessage: "Tool not found" });

        const userId = req.user._id;
        const alreadyUpvoted = tool.upvotedBy.includes(userId);

        if (alreadyUpvoted) {
            tool.upvotes -= 1;
            tool.upvotedBy = tool.upvotedBy.filter(id => id.toString() !== userId.toString());
            await Activity.create({ userId, action: 'upvote_remove', metadata: { toolId: tool._id }, xpEarned: -5 });
            await Users.findByIdAndUpdate(userId, { $inc: { xpPoints: -5 } });
        } else {
            tool.upvotes += 1;
            tool.upvotedBy.push(userId);
            await Activity.create({ userId, action: 'upvote_tool', metadata: { toolId: tool._id }, xpEarned: 5 });
            await Users.findByIdAndUpdate(userId, { $inc: { xpPoints: 5 } });
        }

        await tool.save();
        res.status(200).json({ upvotes: tool.upvotes, upvoted: !alreadyUpvoted });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

// PUT /api/tools/:id/rate
export const rateTool = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        if (!rating || rating < 1 || rating > 5) return res.status(400).json({ errorMessage: "Rating must be 1-5" });

        const tool = await AiTool.findById(req.params.id);
        if (!tool) return res.status(404).json({ errorMessage: "Tool not found" });

        // Remove existing review from this user
        tool.reviews = tool.reviews.filter(r => r.userId?.toString() !== req.user._id.toString());
        tool.reviews.push({ userId: req.user._id, rating, comment });

        // Recalculate average rating
        const total = tool.reviews.reduce((sum, r) => sum + r.rating, 0);
        tool.rating = Math.round((total / tool.reviews.length) * 10) / 10;
        tool.reviewCount = tool.reviews.length;
        await tool.save();

        await Activity.create({ userId: req.user._id, action: 'tool_rate', metadata: { toolId: tool._id, rating }, xpEarned: 10 });

        res.status(200).json({ message: "Rating submitted", rating: tool.rating });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

// GET /api/tools/cron-update (Vercel serverless cron trigger)
import { addUpcomingTool } from "../services/toolsCron.js";
export const triggerToolsCron = async (req, res) => {
    try {
        const addedTool = await addUpcomingTool();
        res.status(200).json({ success: true, message: "Tools cron executed successfully", addedTool });
    } catch (error) {
        res.status(500).json({ success: false, errorMessage: error.message });
    }
};
