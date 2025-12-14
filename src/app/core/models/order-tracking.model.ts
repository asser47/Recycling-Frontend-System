/**
 * Order Status Enum
 * Tracks the lifecycle of a collection request
 */
export enum OrderStatus {
  PENDING = 'PENDING',           // Citizen created request, waiting for collector
  ACCEPTED = 'ACCEPTED',         // Collector accepted the request
  IN_PROGRESS = 'IN_PROGRESS',   // Collector is on the way
  COLLECTED = 'COLLECTED',       // Collector collected the items from citizen
  TRANSFERRED = 'TRANSFERRED',   // Collector transferred items to admin
  COMPLETED = 'COMPLETED',       // Admin received and processed items
  CANCELLED = 'CANCELLED'        // Request cancelled
}

/**
 * Order (Collection Request)
 * Represents a collection request from citizen to collector to admin
 */
export interface Order {
  id: string;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  citizenAddress: string;

  collectorId?: string;
  collectorName?: string;
  collectorPhone?: string;

  adminId?: string;
  adminName?: string;

  materials: OrderMaterial[];
  totalQuantity: number;
  estimatedWeight?: number;

  status: OrderStatus;
  statusHistory: OrderStatusHistory[];

  notes?: string;
  collectorNotes?: string;
  adminNotes?: string;

  createdAt: Date;
  updatedAt: Date;
  collectedAt?: Date;
  transferredAt?: Date;
  completedAt?: Date;
}

/**
 * Order Status History
 * Track all status changes with timestamps
 */
export interface OrderStatusHistory {
  status: OrderStatus;
  changedAt: Date;
  changedBy: string;
  remarks?: string;
}

/**
 * Order Material
 * Individual item in an order
 */
export interface OrderMaterial {
  materialId: string;
  materialName: string;
  materialType: string;
  quantity: number;
  unit: string;
  estimatedWeight?: number;
  notes?: string;
}

/**
 * Collector Order View
 * What collector sees for their orders
 */
export interface CollectorOrderView {
  order: Order;
  action: 'ACCEPT' | 'REJECT' | 'COMPLETE' | 'TRANSFER';
}

/**
 * Admin Order View
 * What admin sees for received orders
 */
export interface AdminOrderView {
  order: Order;
  collectorDetails: {
    name: string;
    phone: string;
    completedDate: Date;
  };
  action: 'ACCEPT' | 'REJECT' | 'COMPLETE';
}

/**
 * Citizen Order View
 * What citizen sees for their orders
 */
export interface CitizenOrderView {
  order: Order;
  collectorInfo?: {
    name: string;
    phone: string;
    status: OrderStatus;
    estimatedArrival?: Date;
  };
}
