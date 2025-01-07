import { Counter, Gauge, Histogram } from 'prom-client';

// Total requests counter
export const requestCounter = new Counter({
  name: 'total_requests',
  help: 'Total number of requests received',
  labelNames: ['appId', 'status'],
});

// Rate-limited requests counter
export const rateLimitedCounter = new Counter({
  name: 'rate_limited_requests',
  help: 'Number of requests that were rate-limited',
  labelNames: ['appId', 'reason'],
});

// Queue length gauge
export const queueLengthGauge = new Gauge({
  name: 'queue_length',
  help: 'Number of requests in the queue',
});

// Response time histogram
export const responseTimeHistogram = new Histogram({
  name: 'response_time_seconds',
  help: 'Response time in seconds',
  labelNames: ['appId'],
  buckets: [0.1, 0.5, 1, 2, 5], // Buckets for response time
});
