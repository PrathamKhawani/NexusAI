import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import aiToolRoutes from './routes/aiToolRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import { initNewsCron } from './services/newsCron.js';
import { initToolsCron } from './services/toolsCron.js';

// Initialize express app
const app = express();
// CORS middleware
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001", "https://client-nine-jade-79.vercel.app", "https://nexusai-mern.vercel.app"], credentials: true }));
// Middleware (to parse JSON and urlencoded data) (body-parser)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// dotenv config
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/nexusai_db';

// MongoDB connection
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('✅ NexusAI — Connected to MongoDB');
        // Only initialize in-memory crons if not on Vercel
        if (!process.env.VERCEL) {
            initNewsCron();
            initToolsCron();
        }
    })
    .catch((error) => {
        console.error('❌ Error connecting to MongoDB:', error);
    });

// Start local server if not running on Vercel
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 NexusAI Server running on Port: ${PORT}`);
    });
}

// Health check
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok', app: 'NexusAI', version: '2.0.0' }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/tools', aiToolRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

export default app;