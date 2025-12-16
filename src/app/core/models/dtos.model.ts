/**
 * DTOs Models - تطابق تماماً مع Backend DTOs
 */

// ===== User DTOs =====
export interface ApplicationUserDto {
  id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  points?: number;
}

export interface UpdateUserDto {
  fullName: string;
  email?: string;
  phoneNumber?: string;
}

// ===== Auth DTOs =====
export interface LoginUserDto {
  email: string;
  password: string;
}

export interface RegisterUserDto {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface HireCollectorDto {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}



// ===== Reward DTOs =====
export interface RewardDto {
  id: number;
  name: string;
  description: string;
  category: string;
  pointsRequired?: number;
  requiredPoints?: number;
  stock?: number;
  stockQuantity?: number;
  isAvailable?: boolean;
  imageUrl?: string;
}

export interface CreateRewardDto {
  name: string;
  description: string;
  pointsRequired: number;
  stock: number;
  category: string;
  image?: File;
}

export interface UpdateRewardDto {
  name?: string;
  description?: string;
  pointsRequired?: number;
  stock?: number;
  category?: string;
  image?: File;
}

export interface RedeemRewardDto {
  rewardId?: number;
  quantity?: number;
  reward_id?: number;
}

export interface UpdateRewardStockDto {
  stock?: number;
  quantity?: number;
}

// ===== History Reward DTOs =====
export interface CreateHistoryRewardDto {
  userId: string;
  rewardId: number;
  quantity: number;
}

export interface RedeemHistoryRewardDto {
  userId: string;
  rewardId: number;
  quantity: number;
}

// ===== Material DTOs =====
export interface MaterialDto {
  id: number;
  typeName: string;
  size?: number;
  price: number;
}

// ===== Factory DTOs =====
export interface CreateFactoryDto {
  name: string;
  location: string;
}

export interface UpdateFactoryDto {
  id: number;
  name: string;
  location: string;
}

// ===== API Response Wrapper =====
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// ===== Auth Response =====
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: ApplicationUserDto;
}
