import {User} from '../../models/User';
import {IUser} from "../../utils/types";
import {AuthService} from "../AuthService";

class UserServiceClass {
    /**
     * Registers a new user.
     */
    async registerUser(userDetails: {
        firstname: string;
        lastname: string;
        email: string;
    }): Promise<IUser> {
        const {firstname, lastname, email} = userDetails;

        // Input validation
        if (!firstname || typeof firstname !== 'string' || firstname.trim() === '') {
            throw new Error('Invalid first name: must be a non-empty string');
        }
        if (!lastname || typeof lastname !== 'string' || lastname.trim() === '') {
            throw new Error('Invalid last name: must be a non-empty string');
        }
        if (!email || typeof email !== 'string' || email.trim() === '') {
            throw new Error('Invalid email: must be a non-empty string');
        }

        try {
            const existingUser = await User.findOne({email});
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            const user = new User({apiKey: AuthService.generateApiKey(), ...userDetails});
            return user.save();
        } catch (error) {
            console.error('Error registering user:', error);
            throw new Error('Failed to register user. Please try again later.');
        }
    }

    /**
     * Retrieves user by ID.
     */
    async getUserById(userId: string): Promise<IUser | null> {
        // Validate userId
        if (!userId || typeof userId !== 'string' || userId.trim() === '') {
            throw new Error('Invalid user ID: must be a non-empty string');
        }

        try {
            return await User.findById(userId);
        } catch (error) {
            console.error('Error retrieving user by ID:', error);
            throw new Error('Failed to retrieve user. Please try again later.');
        }
    }
}

export const UserService = new UserServiceClass();
