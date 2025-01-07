import {RateLimitStrategy} from '../../utils/types';

export class FixedWindowStrategy implements RateLimitStrategy {
    /**
     * Determines if a request can proceed based on the current request count and max requests allowed.
     */
    canProceed(requestCount: number, maxRequests: number): boolean {
        // Validate inputs
        if (typeof requestCount !== 'number' || requestCount < 0) {
            throw new Error('Invalid request count: must be a non-negative number');
        }
        if (typeof maxRequests !== 'number' || maxRequests <= 0) {
            throw new Error('Invalid max requests: must be a positive number');
        }

        return requestCount < maxRequests;
    }

    /**
     * Determines if the time window has passed and needs to be reset.
     */
    resetWindow(currentTime: Date, timeWindow: number, windowStart: Date): boolean {
        // Validate inputs
        if (!(currentTime instanceof Date) || !(windowStart instanceof Date)) {
            throw new Error('Invalid time values: currentTime and windowStart must be Date objects');
        }
        if (typeof timeWindow !== 'number' || timeWindow <= 0) {
            throw new Error('Invalid time window: must be a positive number');
        }

        return currentTime.getTime() - windowStart.getTime() > timeWindow;
    }
}

export class SlidingWindowStrategy implements RateLimitStrategy {
    /**
     * Determines if a request can proceed based on the current request count and max requests allowed.
     */
    canProceed(requestCount: number, maxRequests: number): boolean {
        // Validate inputs
        if (typeof requestCount !== 'number' || requestCount < 0) {
            throw new Error('Invalid request count: must be a non-negative number');
        }
        if (typeof maxRequests !== 'number' || maxRequests <= 0) {
            throw new Error('Invalid max requests: must be a positive number');
        }

        return requestCount < maxRequests;
    }

    /**
     * Sliding windows don't reset entirely, so always return false.
     */
    resetWindow(): boolean {
        // No need to validate, as resetWindow logic for sliding window is fixed
        return false;
    }
}
