// src/controllers/userController
import {Request, Response} from 'express';
import {UserService} from '../../services/UserService';
import sanitizeHtml from 'sanitize-html';

export class UserController {
    static async registerUser(req: Request, res: Response) {
        try {
            const {firstname, lastname, email} = req.body;

            // Custom validation
            if (!firstname || typeof firstname !== 'string' || firstname.trim() === '') {
                res.status(400).json({error: 'FirstName is required and must be a non-empty string'});
            }
            if (!lastname || typeof lastname !== 'string' || lastname.trim() === '') {
                res.status(400).json({error: 'LastName is required and must be a non-empty string'});
            }
            if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                res.status(400).json({error: 'A valid email address is required'});
            }

            // Input sanitization
            const sanitizedFirstName = sanitizeHtml(firstname.trim());
            const sanitizedLastName = sanitizeHtml(lastname.trim());
            const sanitizedEmail = sanitizeHtml(email.trim());

            // Register user
            const user = await UserService.registerUser({
                firstname: sanitizedFirstName,
                lastname: sanitizedLastName,
                email: sanitizedEmail,
            });

            res.status(201).json(user);
        } catch (err: any) {
            console.error('Error in registerUser:', err);
            res.status(err.statusCode || 500).json({error: err.message || 'Internal server error'});
        }
    }

    static async getUser(req: Request, res: Response) {
        try {
            const {id} = req.params;

            // Validate the ID format (e.g., MongoDB ObjectId)
            if (!/^[a-f\d]{24}$/i.test(id)) {
                res.status(400).json({error: 'Invalid user ID format'});
            }

            const user = await UserService.getUserById(id);
            if (!user) {
                res.status(404).json({error: 'User not found'});
            }

            res.status(200).json(user);
        } catch (err: any) {
            console.error('Error in getUser:', err);
            res.status(err.statusCode || 500).json
        }
    }
}
