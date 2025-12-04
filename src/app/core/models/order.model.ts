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
