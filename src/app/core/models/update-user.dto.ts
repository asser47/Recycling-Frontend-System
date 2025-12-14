/**
 * UpdateUserDto - Used for updating user profile
 * Matches backend: BussinessLogicLayer.DTOs.AppUser.UpdateUserDto
 */
export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  avatar?: string;
  city?: string;
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  } | null;
}
