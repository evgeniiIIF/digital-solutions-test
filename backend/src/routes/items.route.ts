import { Router } from 'express';

import { itemsController } from '../controllers/items.controller';

const router = Router();

router.get('/', itemsController.getItems);
router.post('/', itemsController.createItem);

export const itemsRoute = router;
