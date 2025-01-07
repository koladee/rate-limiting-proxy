import {Request, Response, NextFunction} from 'express';
import {AuthService} from '../../services/AuthService';

export const authenticateApiKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiKey: string | undefined = req.header('x-api-key');

        // Validate that the API key is present in the header
        if (!apiKey) {
            res.status(400).json({error: 'API key is required in the x-api-key header'});
        }else {

            // Validate the API key with the AuthService
            const isValidApiKey = await AuthService.validateApiKey(apiKey);
            if (!isValidApiKey) {
                res.status(401).json({error: 'Invalid API key'});
            }

            // Proceed to the next middleware if the API key is valid
            next();
        }
    } catch (error) {
        // Log the error and pass it to Express's default error handler
        console.error('Error in authenticateApiKey:', error);

        // Check if the error is known (e.g., AuthService error)
        if (error instanceof Error) {
            res.status(500).json({error: 'Internal server error: ' + error.message});
        }

        // Handle unexpected errors
        res.status(500).json({error: 'An unexpected error occurred'});
    }
};
