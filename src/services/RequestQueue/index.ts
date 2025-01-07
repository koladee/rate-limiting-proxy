import {Request, Response, NextFunction} from 'express';
import {QueuedRequest} from '../../utils/types'
import { queueLengthGauge } from '../../services/MonitoringService';


const requestQueue: QueuedRequest[] = [];
/**
 * Enqueues a request to be processed later.
 */
export const enqueueRequest = (req: Request, res: Response, next: NextFunction, priority: number = 1) => {
    // Validate inputs
    if (!req || !res || !next) {
        throw new Error('Invalid arguments: req, res, and next are required');
    }
     // Add request with priority
  const queuedRequest: QueuedRequest = { req, res, next, priority };
    // Insert request into the queue based on priority
  const index = requestQueue.findIndex(r => r.priority > priority);
   if (index === -1) {
    requestQueue.push(queuedRequest); // Add to the end if no lower-priority requests exist
       console.log('Request added to the end if no lower-priority requests exist for later processing');
  } else {
    requestQueue.splice(index, 0, queuedRequest); // Insert at the correct position
       console.log('Request enqueued at the correct position for later processing');
  }
  queueLengthGauge.set(requestQueue.length); // Update queue length metric
};

/**
 * Processes all requests in the queue.
 */
export const processQueue = () => {
    try {
        console.log('Processing the request queue...');
        while (requestQueue.length > 0) {
            const {req, res, next} = requestQueue.shift()!;
            if (!req || !res || !next) {
                console.error('Skipping invalid request in the queue');
                continue; // Skip invalid requests
            }

            try {
                console.log('Queue processed!');
                queueLengthGauge.set(requestQueue.length); // Update queue length metric
                next(); // Process the queued request
            } catch (err) {
                console.error('Error processing request:', err);
                res.status(500).json({error: 'Internal server error during request processing'});
            }
        }
    } catch (err) {
        console.error('Error processing the queue:', err);
        throw new Error('Error while processing the request queue');
    }
};
