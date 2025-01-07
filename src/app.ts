import express from 'express';
import * as dotenv from 'dotenv';
import router from './routes';
import DatabaseService from './services/DatabaseService';
import { metricsMiddleware } from './middleware/metricsMiddleware';
import { analyticsMiddleware } from './middleware/analyticsMiddleware';



dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const dbService = new DatabaseService(process.env.MONGODB_URI || 'mongodb://localhost:27017/rate-limiter');

// Middleware
app.use(express.json());
app.use(metricsMiddleware);
app.use(analyticsMiddleware);

// Routes
app.use('/api', router);


// Start the application
(async () => {
    try {
        // Connect to the database
        await dbService.connect();

        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

        // Handle termination gracefully
        process.on('SIGINT', async () => {
            await dbService.disconnect();
            process.exit(0);
        });
    } catch (error) {
        console.error('Error starting the application:', error);
    }
})();

export default app;
