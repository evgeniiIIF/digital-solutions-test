import type { Request, Response } from 'express';

import { getItemsFilterSchema } from '../dto/get-items-filter.dto';
import { itemIdSchema } from '../dto/item-id.dto';
import { reorderSchema } from '../dto/reorder.dto';
import type { ResponseDto } from '../dto/response.dto';
import { selectedService } from '../services/selected.service';

class SelectedController {
  getSelected = (req: Request, res: Response) => {
    const parsed = getItemsFilterSchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ ok: false, reason: parsed.error.message });
    res.json(selectedService.getRightPage(parsed.data));
  };

  select = (req: Request, res: Response<ResponseDto>) => {
    const parsed = itemIdSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ ok: false, reason: parsed.error.message });
    const result = selectedService.select(parsed.data.id);
    if (result === 'not-found') return res.status(404).json({ ok: false, reason: 'not found' });
    res.status(202).json({ ok: true });
  };

  deselect = (req: Request, res: Response<ResponseDto>) => {
    const parsed = itemIdSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ ok: false, reason: parsed.error.message });
    const result = selectedService.deselect(parsed.data.id);
    if (result === 'not-found') return res.status(404).json({ ok: false, reason: 'not found' });
    res.status(202).json({ ok: true });
  };

  reorder = (req: Request, res: Response<ResponseDto>) => {
    const parsed = reorderSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ ok: false, reason: parsed.error.message });
    const ok = selectedService.reorder(parsed.data.order);
    if (!ok) return res.status(400).json({ ok: false, reason: 'cannot reorder' });
    res.status(202).json({ ok: true });
  };
}

export const selectedController = new SelectedController();
