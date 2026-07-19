import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/database.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
const app = express();
const requestedPort = Number(process.env.PORT || 5000);
const normalizeOrigin = (origin) => origin.trim().replace(/\/+$/, '');
const allowedOrigins = new Set([
    'http://localhost:3000',
    'https://nagar-seva-ai-agent-f7ap.vercel.app',
].map(normalizeOrigin));
if (process.env.CORS_ORIGIN) {
    process.env.CORS_ORIGIN.split(',')
        .map(normalizeOrigin)
        .filter(Boolean)
        .forEach((origin) => allowedOrigins.add(origin));
}
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.has(normalizeOrigin(origin))) {
            callback(null, true);
            return;
        }
        callback(null, false);
    },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});
app.use('/api', apiRoutes);
app.use(errorHandler);
const listenOnPort = (port) => {
    return new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
            console.log(`Server running on port ${port}`);
            resolve(port);
        });
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                const nextPort = port + 1;
                console.warn(`Port ${port} is busy. Trying ${nextPort} instead.`);
                server.close(() => {
                    listenOnPort(nextPort).then(resolve).catch(reject);
                });
                return;
            }
            reject(error);
        });
    });
};
const startServer = async () => {
    try {
        const dbConnected = await connectDB();
        if (!dbConnected) {
            console.warn('Continuing without MongoDB connection. Database-backed routes will be unavailable until MongoDB is reachable.');
        }
        await listenOnPort(requestedPort);
    }
    catch (error) {
        console.error('Failed to start server:', error);
    }
};
startServer();
//# sourceMappingURL=index.js.map