// ===== Order DTOs =====
import { MaterialType } from '../materials/material-type.enum';

export interface CreateOrderDto {
  email: string;
  typeOfMaterial: MaterialType;
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
  typeOfMaterial: MaterialType;
  quantity?: number;
  city?: string;
  street?: string;
  buildingNo?: string;
  apartment?: string;
  estimatedArrivalTime?: string;
  routeOrder?: number;
  userApartment?: string;
  userBuildingNo?: string;
  userCity?: string;
  userStreet?: string
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


export interface Order {
  id?: number;
  orderDate: string;
  status: string;
  userId: string;
  collectorId: string;
  factoryId: number;
  userName?: string;
  collectorName?: string;
  factoryName?: string;
}
