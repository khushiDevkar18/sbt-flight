import { apiClient } from "./apiClient";

export type InventoryDto = {
  id: string;
  name: string;
  qty: number;
};

export const inventoryService = {
  list: () => apiClient.get<InventoryDto[]>("/api/inventory"),
};

