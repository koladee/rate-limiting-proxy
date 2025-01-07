import mongoose from 'mongoose';

class DatabaseService {
    private connectionString: string;

    constructor(connectionString: string) {
        // Validate connection string format
        if (!connectionString || typeof connectionString !== 'string' || connectionString.trim() === '') {
            throw new Error('A valid MongoDB connection string is required');
        }
        this.connectionString = connectionString;
    }

    /**
     * Connects to the MongoDB database.
     */
    async connect(): Promise<void> {
        try {
            console.log('Attempting to connect to MongoDB...');
            await mongoose.connect(this.connectionString, {});
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            // Exit the process with a non-zero status code if the connection fails
            process.exit(1);
        }
    }

    /**
     * Disconnects from the MongoDB database.
     */
    async disconnect(): Promise<void> {
        try {
            console.log('Attempting to disconnect from MongoDB...');
            await mongoose.disconnect();
            console.log('Disconnected from MongoDB');
        } catch (error) {
            console.error('Error disconnecting from MongoDB:', error);
            // Log and return, but don't terminate the process
        }
    }
}

export default DatabaseService;
