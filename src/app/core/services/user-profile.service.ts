import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../config/api.config.service';
import { UpdateUserDto } from '../models/update-user.dto';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface UserProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phoneNumber: string;
  address?: string;
  avatar?: string;
  city?: string;
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  } | null;
  points?: number;
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfigService);

  // Signals for profile state
  private _userProfile = signal<UserProfileResponse | null>(null);
  userProfile = this._userProfile.asReadonly();

  private _isLoading = signal(false);
  isLoading = this._isLoading.asReadonly();

  private _error = signal<string | null>(null);
  error = this._error.asReadonly();

  private _isSaving = signal(false);
  isSaving = this._isSaving.asReadonly();

  // Computed
  isProfileLoaded = computed(() => this._userProfile() !== null);
  fullName = computed(() => {
    const profile = this._userProfile();
    if (profile) {
      return `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
    }
    return '';
  });

  constructor() {}

  /**
   * Fetch current user's profile from API
   */
  loadUserProfile() {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.get<UserProfileResponse>(
      `${this.apiConfig.apiUrl}/User/profile`
    ).pipe(
      tap((profile) => {
        this._userProfile.set(profile);
        this._isLoading.set(false);
      }),
      catchError((err) => {
        console.error('Failed to load user profile:', err);
        this._error.set('Failed to load profile data');
        this._isLoading.set(false);
        return of(null);
      })
    );
  }

  /**
   * Update user profile
   */
  updateUserProfile(data: UpdateUserDto) {
    this._isSaving.set(true);
    this._error.set(null);

    return this.http.put<{ success: boolean; message: string }>(
      `${this.apiConfig.apiUrl}/User/profile`,
      data
    ).pipe(
      tap((response) => {
        if (response.success) {
          // Update local profile with new data
          const current = this._userProfile();
          if (current) {
            this._userProfile.set({
              ...current,
              ...data
            });
          }
          this._isSaving.set(false);
        }
      }),
      catchError((err) => {
        console.error('Failed to update user profile:', err);
        const errorMsg = err?.error?.error || 'Failed to update profile';
        this._error.set(errorMsg);
        this._isSaving.set(false);
        return of(null);
      })
    );
  }

  /**
   * Get current profile value
   */
  getCurrentProfile(): UserProfileResponse | null {
    return this._userProfile();
  }

  /**
   * Clear profile data
   */
  clearProfile(): void {
    this._userProfile.set(null);
    this._error.set(null);
  }
}
