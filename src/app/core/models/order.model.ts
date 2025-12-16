// ===== Order DTOs =====
export interface CreateOrderDto {
  email: string;
  typeOfMaterial: string;
  quantity: number;
  city: string;
  street: string;
  buildingNo: string;
  apartment?: string | null;
}

export interface OrderDto {
  id: number;
  status: string;
  orderDate: string;
  userId: string;
  collectorId?: string;
  factoryId?: number;
  userName?: string;
  email?: string;
  collectorName?: string;
  factoryName?: string;
  typeOfMaterial?: string;
  quantity?: number;
  city?: string;
  street?: string;
  buildingNo?: string;
  apartment?: string;
  estimatedArrivalTime?: string;
  routeOrder?: number;
}

export type RequestStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export interface UpdateOrderStatusRequest {
  newStatus?: string;
  status?: string;
}

export interface AssignOrderRequest {
  collectorId: string | number;
  orderId?: number;
}
