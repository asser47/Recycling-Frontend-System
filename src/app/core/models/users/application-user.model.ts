export interface ApplicationUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  points: number;
  createdAt: string;
}

export interface ApplicationUserDto {
  id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  points?: number;
}
