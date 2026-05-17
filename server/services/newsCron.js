import cron from 'node-cron';
import Parser from 'rss-parser';
import Post from '../models/postModel.js';

const parser = new Parser();

const RSS_FEEDS = [
    { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', source: 'TechCrunch AI' },
    { url: 'https://venturebeat.com/category/ai/feed/', source: 'VentureBeat AI' },
    { url: 'https://www.wired.com/feed/category/ai/latest/rss', source: 'Wired AI' }
];

export const fetchAndSaveNews = async () => {
    console.log("📰 [Cron] Starting daily AI news fetch...");
    let addedCount = 0;

    for (const feedConfig of RSS_FEEDS) {
        try {
            const feed = await parser.parseURL(feedConfig.url);
            
            for (const item of feed.items) {
                // Ensure unique URL
                if (!item.link) continue;

                // Check if already exists
                const existing = await Post.findOne({ url: item.link });
                if (!existing) {
                    await Post.create({
                        title: item.title,
                        summary: (item.contentSnippet || item.content || "Read more at the source.").substring(0, 497) + "...",
                        url: item.link,
                        source: feedConfig.source,
                        category: "AI",
                        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
                        author: item.creator || "Editorial",
                    });
                    addedCount++;
                }
            }
        } catch (error) {
            console.error(`Error fetching feed ${feedConfig.source}:`, error.message);
        }
    }
    
    console.log(`✅ [Cron] Added ${addedCount} new AI news articles.`);
};

// Schedule to run every 6 hours
export const initNewsCron = () => {
    cron.schedule('0 */6 * * *', () => {
        fetchAndSaveNews();
    });
    console.log("⏱️  [Cron] News updater scheduled (runs every 6 hours).");
    
    // Run an initial fetch immediately on startup asynchronously
    fetchAndSaveNews().catch(err => console.error("Error during initial news fetch:", err));
};
