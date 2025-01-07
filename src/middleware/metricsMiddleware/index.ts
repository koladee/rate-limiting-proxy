import prometheusMiddleware from 'express-prometheus-middleware';

export const metricsMiddleware = prometheusMiddleware({
  metricsPath: '/metrics', // Expose metrics at this endpoint
  collectDefaultMetrics: true, // Default Node.js process metrics
  requestDurationBuckets: [0.1, 0.5, 1, 1.5], // Buckets for response time
});
