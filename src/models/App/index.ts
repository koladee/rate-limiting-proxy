import mongoose, {Schema} from 'mongoose';
import {IApp} from "../../utils/types";


const AppSchema = new Schema<IApp>(
    {
        name: {type: String, required: true},
        baseUrl: {type: String, required: true},
        rateLimit: {
            count: {type: Number, required: true},
            timeWindow: {type: Number, required: true},
            strategy: {type: String, enum: ['FixedWindow', 'SlidingWindow'], default: 'FixedWindow'},
        },
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    },
    {timestamps: true}
);

export const App = mongoose.model<IApp>('App', AppSchema);

