import axios from 'axios';

const API_URL = 'http://localhost:3000';

class ApiClient {
  private readonly client = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
  });

  async get<T, P>(path: string, params?: P): Promise<T> {
    const res = await this.client.get<T>(path, { params });
    return res.data;
  }

  async post<T, B>(path: string, body: B): Promise<T> {
    const res = await this.client.post<T>(path, body);
    return res.data;
  }

  async patch<T, B>(path: string, body: B): Promise<T> {
    const res = await this.client.patch<T>(path, body);
    return res.data;
  }

  async delete<T, B>(path: string, body: B): Promise<T> {
    const res = await this.client.delete<T>(path, { data: body });
    return res.data;
  }
}

export const apiClient = new ApiClient();
