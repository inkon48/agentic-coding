import { Router } from 'express';

export const healthRouter = Router();

/**
 * GET /health — liveness check.
 * Responds 200 with a stable contract: { "status": "ok" }.
 */
healthRouter.get('/', (req, res) => {
  res.json({ status: 'ok' });
});