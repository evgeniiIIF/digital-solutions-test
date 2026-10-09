import type { Response } from 'express';

const clients = new Set<Response>();

export const addClient = (res: Response): void => {
  clients.add(res);
};

export const removeClient = (res: Response): void => {
  clients.delete(res);
};

export const broadcast = (event: string, data: unknown): void => {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of clients) client.write(payload);
};
