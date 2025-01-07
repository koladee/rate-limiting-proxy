import mongoose, {Document} from "mongoose";
import {Request, Response, NextFunction} from 'express';

export interface IApp extends Document {
    name: string;
    baseUrl: string;
    rateLimit: {
        count: number;
        timeWindow: number;
        strategy: string;
    };
    user: mongoose.Types.ObjectId; // Reference to the User
}


export interface IRateLimit extends Document {
    appId: string;
    requestCount: number;
    timeWindowStart: Date;
}


export interface IUser extends Document {
    firstname: string;
    lastname: string;
    email: string;
    apiKey?: string;
}

export interface IRequestAnalytics extends Document {
  appId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number; // in ms
  timestamp: Date;
  userId?: string; // Optional, if available
}

export interface RateLimitStrategy {
    canProceed(
        requestCount?: number,
        maxRequests?: number,
        timeWindow?: number,
        currentTime?: Date,
        windowStart?: Date
    ): boolean;

    resetWindow(
        currentTime?: Date,
        timeWindow?: number,
        windowStart?: Date
    ): boolean;
}


export interface RateLimitConfig {
    count: number; // Maximum number of requests allowed
    timeWindow: number; // Time window in milliseconds
}


export type QueuedRequest = {
  req: Request;
  res: Response;
  next: NextFunction;
  priority: number; // 0 = highest priority, higher numbers = lower priority
};
