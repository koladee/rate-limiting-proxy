// src/controllers/proxyController
import {Request, Response} from 'express';
import {AppService} from '../../services/AppService';
import axios from 'axios';

export class ProxyController {
    static async proxyRequest(req: Request, res: Response) {
        const {appId} = req.params;
        const targetPath = req.params[0];

        // Validate input
        if (!appId || typeof appId !== 'string') {
            res.status(400).json({error: 'Invalid or missing "appId".'});
        }

        if (!targetPath || typeof targetPath !== 'string') {
            res.status(400).json({error: 'Invalid or missing target path in URL.'});
        }

        try {
            // Fetch the app configuration
            const app = await AppService.getApp(appId);

            if (!app) {
                res.status(404).json({error: 'App not found.'});
            }

            // Construct the target URL
            const targetUrl = `${app.baseUrl}/${targetPath}`;

            // Log the request for debugging
            console.log('Proxying request to:', targetUrl);

            // Proxy the request
            const response = await axios({
                method: req.method,
                url: targetUrl,
                headers: req.headers,
                data: req.body,
                validateStatus: () => true, // Allow handling of non-2xx statuses manually
            });

            console.log('Proxy Response:', response.data);
            if (!res.headersSent) {
                // Forward the response from the target API
                res.status(response.status).json(response.data);
            }
        } catch (err) {
            console.error('Error in proxyRequest:', err);

            if (axios.isAxiosError(err)) {
                // Handle Axios-specific errors
                res.status(err.response?.status || 500).json({
                    error: err.response?.data || 'Upstream service error.',
                });
            }

            // Handle other unexpected errors
            res.status(500).json({error: 'Failed to proxy request. Please try again later.'});
        }
    }
}
