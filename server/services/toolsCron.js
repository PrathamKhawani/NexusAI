import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import AiTool from '../models/aiToolModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addUpcomingTool = async () => {
    console.log("🛠️  [Cron] Starting daily AI tool fetch...");
    try {
        const filePath = path.join(__dirname, '../data/upcomingTools.json');
        const toolsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Find a tool from the JSON that isn't in the DB yet
        for (const toolDef of toolsData) {
            const existing = await AiTool.findOne({ url: toolDef.url });
            if (!existing) {
                await AiTool.create({
                    name: toolDef.name,
                    description: toolDef.description,
                    category: toolDef.category,
                    url: toolDef.url,
                    pricing: toolDef.pricing,
                    rating: (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1), // Random high rating
                    reviewCount: Math.floor(Math.random() * 5000) + 100,
                    isVerified: true,
                    isFeatured: false,
                    upvotes: Math.floor(Math.random() * 2000) + 500,
                    tags: [toolDef.category, "AI", "New"],
                });
                console.log(`✅ [Cron] Added new AI tool: ${toolDef.name}`);
                return; // Only add one tool per run
            }
        }
        console.log("ℹ️  [Cron] No new AI tools to add from the upcoming list.");
    } catch (error) {
        console.error("Error in toolsCron:", error.message);
    }
};

// Schedule to run once a day at midnight
export const initToolsCron = () => {
    cron.schedule('0 0 * * *', () => {
        addUpcomingTool();
    });
    console.log("⏱️  [Cron] Tools updater scheduled (runs daily).");
    
    // Run an initial check immediately on startup asynchronously
    addUpcomingTool().catch(err => console.error("Error during initial tools check:", err));
};
