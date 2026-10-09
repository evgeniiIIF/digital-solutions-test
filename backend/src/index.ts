import cors from 'cors';
import express from 'express';

import { eventsRoute } from './routes/events.route';
import { itemsRoute } from './routes/items.route';
import { selectedRoute } from './routes/selected.route';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use('/items', itemsRoute);
app.use('/selected', selectedRoute);
app.use('/events', eventsRoute);

app.listen(PORT, () => {
  console.log(`Server run: http://localhost:${PORT}`);
});
