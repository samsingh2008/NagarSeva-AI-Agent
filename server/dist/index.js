import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/database.js';
import complaintRoutes from './routes/complaints.js';
import safetyRoutes from './routes/safety.js';
import { errorHandler } from './middleware/errorHandler.js';
const app = express();
const requestedPort = Number(process.env.PORT || 5000);
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});
app.use('/api/complaints', complaintRoutes);
app.use('/api/safety', safetyRoutes);
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