import {enqueueRequest, processQueue} from '../../services/RequestQueue';
import {RateLimit} from "../../models/RateLimit";
import {Request, Response, NextFunction} from 'express';
import {App} from "../../models/App";
import {IApp} from "../../utils/types";
import {FixedWindowStrategy, SlidingWindowStrategy} from '../../services/RateLimitStrategies';
import {RateLimitStrategy} from '../../utils/types';
import { queueLengthGauge, rateLimitedCounter } from '../../services/MonitoringService';

const strategyMap: { [key: string]: RateLimitStrategy } = {
    FixedWindow: new FixedWindowStrategy(),
    SlidingWindow: new SlidingWindowStrategy(),
};

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const {appId} = req.params;

    try {
        // Validate appId parameter presence
        if (!appId) {
            res.status(400).json({error: 'App ID is required in the request parameters'});
        }

        const app: IApp | null = await App.findById(appId);

        // Check if the app was found
        if (!app) {
            res.status(404).json({error: 'App not found'});
        }else {

            // Ensure rateLimit exists in the app document
            const {rateLimit} = app;
            if (!rateLimit) {
                res.status(400).json({error: 'Rate limit configuration missing for this app'});
            }

            const {count: maxRequests, timeWindow, strategy} = rateLimit;

            // Validate rate limit configuration
            if (typeof maxRequests !== 'number' || maxRequests <= 0) {
                res.status(400).json({error: 'Invalid max request count in rate limit configuration'});
            }
            if (typeof timeWindow !== 'number' || timeWindow <= 0) {
                res.status(400).json({error: 'Invalid time window in rate limit configuration'});
            }
            if (!['FixedWindow', 'SlidingWindow'].includes(strategy)) {
                res.status(400).json({error: 'Invalid rate limit strategy'});
            }

            const now = new Date();

            // Fetch or initialize rate limit info
            let rateLimitInfo = await RateLimit.findOne({appId});
            if (!rateLimitInfo) {
                rateLimitInfo = new RateLimit({
                    appId,
                    requestCount: 0,
                    timeWindowStart: now,
                });
            }

            const rateLimitStrategy = strategyMap[strategy] || strategyMap['FixedWindow'];

            // Reset the window if needed
            if (rateLimitStrategy.resetWindow(now, timeWindow, rateLimitInfo.timeWindowStart)) {
                rateLimitInfo.requestCount = 0;
                rateLimitInfo.timeWindowStart = now;
            }

            // Check if the request can proceed immediately
            if (rateLimitStrategy.canProceed(rateLimitInfo.requestCount, maxRequests)) {
                rateLimitInfo.requestCount += 1;
                await rateLimitInfo.save();
                next();
            }else {

                // Handle queued requests if the limit is exceeded
                 rateLimitedCounter.labels(appId, 'limit_exceeded').inc(); // Increment rate-limited counter
                const priority = req.headers['x-priority'] ? parseInt(req.headers['x-priority'] as string, 10) : 1;
                enqueueRequest(req, res, next, priority);
                setTimeout(
                    processQueue,
                    timeWindow - (now.getTime() - rateLimitInfo.timeWindowStart.getTime())
                );

                res.status(202).json({
                    message: 'Request queued. Will be processed shortly.',
                });
            }
        }
    } catch (error) {
        console.error('Rate limiting error:', error);

        // Handle errors more specifically, if the error has a message
        if (error instanceof Error) {
            res.status(500).json({error: 'Internal server error: ' + error.message});
        }

        // Fallback error handler for unexpected issues
        res.status(500).json({error: 'An unexpected error occurred'});
    }
};
