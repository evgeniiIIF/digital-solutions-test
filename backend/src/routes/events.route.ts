import { Router } from 'express';

import { addClient, removeClient } from '../sse/events';

const router = Router();

router.get('/', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders();

  addClient(res);
  req.on('close', () => removeClient(res));
});

export const eventsRoute = router;
