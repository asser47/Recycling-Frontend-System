export interface Collector {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;

  // Address
  city?: string;
  street?: string;
  buildingNo?: string;
  apartment?: string;

  // Status
  isActive: boolean;
  createdAt: string;
}
