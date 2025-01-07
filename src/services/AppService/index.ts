import {App} from "../../models/App";
import {IApp} from "../../utils/types";

class AppServiceClass {
    /**
     * Registers a new app for a user.
     */
    async registerApp(appDetails: {
        name: string;
        baseUrl: string;
        rateLimit: { count: number; timeWindow: number; strategy: string };
        userId: string;
    }): Promise<IApp> {
        const {name, baseUrl, rateLimit, userId} = appDetails;

        // Validate input fields
        if (!name || typeof name !== 'string' || name.trim() === '') {
            throw new Error('App name is required and must be a non-empty string');
        }
        if (!baseUrl || typeof baseUrl !== 'string' || baseUrl.trim() === '') {
            throw new Error('Base URL is required and must be a non-empty string');
        }
        if (!userId || typeof userId !== 'string' || userId.trim() === '') {
            throw new Error('User ID is required and must be a non-empty string');
        }

        // Validate rate limit configuration
        if (typeof rateLimit.count !== 'number' || rateLimit.count <= 0) {
            throw new Error('Rate limit count must be a positive number');
        }
        if (typeof rateLimit.timeWindow !== 'number' || rateLimit.timeWindow <= 0) {
            throw new Error('Rate limit time window must be a positive number');
        }
        const validStrategies = ['FixedWindow', 'SlidingWindow'];
        if (!validStrategies.includes(rateLimit.strategy)) {
            throw new Error(`Invalid rate limit strategy. Valid options are: ${validStrategies.join(', ')}`);
        }

        // Create and save the new app
        const app = new App({
            name,
            baseUrl,
            rateLimit: {
                count: rateLimit.count,
                timeWindow: rateLimit.timeWindow,
                strategy: rateLimit.strategy || 'FixedWindow', // Default strategy
            },
            user: userId,
        });

        try {
            return await app.save();
        } catch (error) {
            console.error('Error saving app:', error);
            throw new Error('Error registering the app. Please try again later.');
        }
    }

    /**
     * Retrieves an app by its ID.
     */
    async getApp(appId: string): Promise<IApp> {
        // Validate appId
        if (!appId || typeof appId !== 'string' || appId.trim() === '') {
            throw new Error('App ID is required and must be a non-empty string');
        }

        try {
            const app = await App.findById(appId);
            if (!app) {
                throw new Error(`App with ID ${appId} not found`);
            }
            return app;
        } catch (error) {
            console.error('Error retrieving app:', error);
            throw new Error('Error retrieving app. Please try again later.');
        }
    }

    /**
     * Retrieves apps for a specific user.
     */
    async getAppsByUser(userId: string): Promise<IApp[]> {
        // Validate userId
        if (!userId || typeof userId !== 'string' || userId.trim() === '') {
            throw new Error('User ID is required and must be a non-empty string');
        }

        try {
            const apps = await App.find({user: userId});
            if (!apps || apps.length === 0) {
                throw new Error(`No apps found for user with ID ${userId}`);
            }
            return apps;
        } catch (error) {
            console.error('Error retrieving apps:', error);
            throw new Error('Error retrieving apps. Please try again later.');
        }
    }
}

export const AppService = new AppServiceClass();
