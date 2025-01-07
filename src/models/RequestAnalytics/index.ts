import mongoose, { Schema } from 'mongoose';
import {IRequestAnalytics} from "../../utils/types";


const RequestAnalyticsSchema: Schema = new Schema({
  appId: { type: String, required: true },
  endpoint: { type: String, required: true },
  method: { type: String, required: true },
  statusCode: { type: Number, required: true },
  responseTime: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  userId: { type: String },
});

export const RequestAnalytics = mongoose.model<IRequestAnalytics>(
  'RequestAnalytics',
  RequestAnalyticsSchema
);
