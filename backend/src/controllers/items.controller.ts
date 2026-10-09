import type { Request, Response } from 'express';

import { getItemsFilterSchema } from '../dto/get-items-filter.dto';
import { itemIdSchema } from '../dto/item-id.dto';
import type { ResponseDto } from '../dto/response.dto';
import { itemsService } from '../services/items.service';

class ItemsController {
  getItems = (req: Request, res: Response) => {
    const parsed = getItemsFilterSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, reason: parsed.error.message });
    }
    res.json(itemsService.getLeftPage(parsed.data));
  };

  createItem = (req: Request, res: Response<ResponseDto>) => {
    const parsed = itemIdSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, reason: parsed.error.message });
    }
    const accepted = itemsService.addItem(parsed.data.id);
    if (!accepted) {
      return res.status(409).json({ ok: false, reason: 'already exists' });
    }
    res.status(202).json({ ok: true });
  };
}

export const itemsController = new ItemsController();
