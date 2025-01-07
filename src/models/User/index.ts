import mongoose, {Schema} from 'mongoose';
import {IUser} from "../../utils/types";

const userSchema = new Schema<IUser>({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    apiKey: {type: String, required: true, unique: true},
});

export const User = mongoose.model<IUser>('User', userSchema);
