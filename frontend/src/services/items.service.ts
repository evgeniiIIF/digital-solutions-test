import { apiClient } from '@/api/apiClient';
import type { ItemIdDto } from '@/dto/item-id.dto';
import type { GetItemsFilterDto } from '@/dto/get-items-filter.dto';
import type { ItemsPageDto } from '@/dto/items-page.dto';
import type { ResponseDto } from '@/dto/response.dto';

const BASE_URL = '/items';

class ItemsService {
  getItems(filter: GetItemsFilterDto): Promise<ItemsPageDto> {
    return apiClient.get<ItemsPageDto, GetItemsFilterDto>(BASE_URL, filter);
  }

  addItem(id: number): Promise<ResponseDto> {
    const body: ItemIdDto = { id };
    return apiClient.post<ResponseDto, ItemIdDto>(BASE_URL, body);
  }
}

export const itemsService = new ItemsService();
