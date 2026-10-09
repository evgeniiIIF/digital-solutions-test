import { apiClient } from '@/api/apiClient';
import type { GetItemsFilterDto } from '@/dto/get-items-filter.dto';
import type { ItemIdDto } from '@/dto/item-id.dto';
import type { ItemsPageDto } from '@/dto/items-page.dto';
import type { ReorderDto } from '@/dto/reorder.dto';
import type { ResponseDto } from '@/dto/response.dto';

const BASE_URL = '/selected';

class SelectedService {
  getSelected(filter: GetItemsFilterDto): Promise<ItemsPageDto> {
    return apiClient.get<ItemsPageDto, GetItemsFilterDto>(BASE_URL, filter);
  }

  select(id: number): Promise<ResponseDto> {
    const body: ItemIdDto = { id };
    return apiClient.post<ResponseDto, ItemIdDto>(BASE_URL, body);
  }

  deselect(id: number): Promise<ResponseDto> {
    const body: ItemIdDto = { id };
    return apiClient.delete<ResponseDto, ItemIdDto>(BASE_URL, body);
  }

  reorder(order: number[]): Promise<ResponseDto> {
    const body: ReorderDto = { order };
    return apiClient.patch<ResponseDto, ReorderDto>(`${BASE_URL}/reorder`, body);
  }
}

export const selectedService = new SelectedService();
