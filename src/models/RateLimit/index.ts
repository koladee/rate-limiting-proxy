// models/RateLimit.ts
import mongoose, {Schema} from 'mongoose';
import {IRateLimit} from "../../utils/types";

const RateLimitSchema: Schema = new Schema({
    appId: {type: String, required: true},
    requestCount: {type: Number, default: 0},
    timeWindowStart: {type: Date, required: true},
});

export const RateLimit = mongoose.model<IRateLimit>('RateLimit', RateLimitSchema);
