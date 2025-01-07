// src/controllers/appController
import {NextFunction, Request, Response} from 'express';
import {AppService} from '../../services/AppService';
import {IApp} from "../../utils/types";
import {App} from "../../models/App";

export class AppController {
    static async registerApp(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, baseUrl, rateLimit, userId} = req.body;

            // Validate input fields
            if (!name || typeof name !== 'string') {
                res.status(400).json({error: 'Invalid or missing "name".'});
            }

            if (!baseUrl || typeof baseUrl !== 'string') {
                res.status(400).json({error: 'Invalid or missing "baseUrl".'});
            }

            if (!rateLimit || typeof rateLimit !== 'object') {
                res.status(400).json({error: 'Invalid or missing "rateLimit".'});
            }

            const {strategy, count, timeWindow} = rateLimit;

            if (!strategy || typeof strategy !== 'string') {
                res.status(400).json({error: 'Invalid or missing "strategy" in rateLimit.'});
            }

            if (!count || typeof count !== 'number' || count <= 0) {
                res.status(400).json({error: '"count" in rateLimit must be a positive number.'});
            }

            if (!timeWindow || typeof timeWindow !== 'number' || timeWindow <= 0) {
                res.status(400).json({error: '"timeWindow" in rateLimit must be a positive number.'});
            }

            if (!userId || typeof userId !== 'string') {
                res.status(400).json({error: 'Invalid or missing "userId".'});
            }

            // Register the app
            const appId = await AppService.registerApp({
                name,
                baseUrl,
                rateLimit: {count, timeWindow, strategy},
                userId,
            });

            res.status(201).json({appId});
        } catch (err) {
            console.error('Error in registerApp:', err);

            // Return specific error if it originates from a known issue
            if (err instanceof Error && err.message.includes('duplicate')) {
                res.status(409).json({error: 'App with the given name or URL already exists.'});
            }

            res.status(500).json({error: 'Failed to register app. Please try again later.'});
        }
    }

    static async getAppsByUser(req: Request, res: Response, next: NextFunction) {
        try {
            const {userId} = req.params;

            // Validate userId
            if (!userId || typeof userId !== 'string') {
                res.status(400).json({error: 'Invalid or missing "userId".'});
            }

            const apps = await AppService.getAppsByUser(userId);

            if (!apps || apps.length === 0) {
                res.status(404).json({error: 'No apps found for the given user ID.'});
            }

            res.status(200).json(apps);
        } catch (err) {
            console.error('Error in getAppsByUser:', err);
            next(err); // Pass error to global error handler
        }
    }


    static async updateRateLimit(req: Request, res: Response) {
    try {
      const { appId } = req.params;
      const { strategy, count, timeWindow } = req.body;

      // Validate input data
      if (!strategy || !['FixedWindow', 'SlidingWindow'].includes(strategy)) {
        res.status(400).json({ error: 'Invalid or missing rate limit strategy' });
      }
      if (typeof count !== 'number' || count <= 0) {
        res.status(400).json({ error: 'Invalid rate limit count' });
      }
      if (typeof timeWindow !== 'number' || timeWindow <= 0) {
        res.status(400).json({ error: 'Invalid time window' });
      }

      // Find and update the app
      const app: IApp | null = await App.findById(appId);
      if (!app) {
        res.status(404).json({ error: 'App not found' });
      }else {

          app.rateLimit = {strategy, count, timeWindow};
          await app.save();

          res.status(200).json({message: 'Rate limit configuration updated successfully'});
      }
    } catch (err) {
      console.error('Error updating rate limit:', err);
      res.status(500).json({ error: 'Failed to update rate limit configuration' });
    }
  }
}
