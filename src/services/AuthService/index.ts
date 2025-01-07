import crypto from 'crypto';
import {User} from '../../models/User';

export const AuthService = {
    /**
     * Generates a new API key.
     */
    generateApiKey: (): string => {
        try {
            return crypto.randomBytes(32).toString('hex');
        } catch (error) {
            console.error('Error generating API key:', error);
            throw new Error('Error generating API key. Please try again later.');
        }
    },

    /**
     * Validates if the given API key is associated with a valid user.
     */
    validateApiKey: async (apiKey: string): Promise<boolean> => {
        // Validate API key format
        if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
            throw new Error('API key is required and must be a non-empty string');
        }

        try {
            const user = await User.findOne({apiKey});
            return !!user; // Returns true if a user is found, otherwise false
        } catch (error) {
            console.error('Error validating API key:', error);
            throw new Error('Error validating API key. Please try again later.');
        }
    },
};
