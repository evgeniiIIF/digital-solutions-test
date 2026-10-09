import { API_URL } from '@/config/env';

const source = new EventSource(`${API_URL}/events`);

export const onEvent = <T>(event: string, handler: (data: T) => void): (() => void) => {
  const wrapped = (event_: Event) => handler(JSON.parse((event_ as MessageEvent).data) as T);
  source.addEventListener(event, wrapped);
  return () => source.removeEventListener(event, wrapped);
};
