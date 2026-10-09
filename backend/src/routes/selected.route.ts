import { Router } from 'express';

import { selectedController } from '../controllers/selected.controller';

const router = Router();

router.get('/', selectedController.getSelected);
router.post('/', selectedController.select);
router.delete('/', selectedController.deselect);
router.patch('/reorder', selectedController.reorder);

export const selectedRoute = router;
