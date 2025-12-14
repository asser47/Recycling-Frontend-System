import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { UserProfileService } from './user-profile.service';
import { ApiConfigService } from '../config/api.config.service';

describe('UserProfileService', () => {
  let service: UserProfileService;
  let httpMock: HttpTestingController;
  let apiConfig: ApiConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserProfileService, ApiConfigService]
    });
    service = TestBed.inject(UserProfileService);
    httpMock = TestBed.inject(HttpTestingController);
    apiConfig = TestBed.inject(ApiConfigService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load user profile', () => {
    return new Promise<void>((resolve) => {
      const mockProfile = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        address: 'Test Address'
      };

      service.loadUserProfile().subscribe(() => {
        expect(service.userProfile()).toEqual(mockProfile);
        expect(service.isProfileLoaded()).toBe(true);
        resolve();
      });

      const req = httpMock.expectOne(`${apiConfig.apiUrl}/User/profile`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProfile);
    });
  });

  it('should update user profile', () => {
    return new Promise<void>((resolve) => {
      const updateData = {
        firstName: 'Jane',
        phoneNumber: '0987654321'
      };

      service.updateUserProfile(updateData).subscribe((response) => {
        expect(response?.success).toBe(true);
        resolve();
      });

      const req = httpMock.expectOne(`${apiConfig.apiUrl}/User/profile`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush({ success: true, message: 'Profile updated' });
    });
  });

  it('should compute fullName correctly', () => {
    return new Promise<void>((resolve) => {
      const mockProfile = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890'
      };

      service.loadUserProfile().subscribe(() => {
        expect(service.fullName()).toBe('John Doe');
        resolve();
      });

      const req = httpMock.expectOne(`${apiConfig.apiUrl}/User/profile`);
      req.flush(mockProfile);
    });
  });

  it('should handle profile load error', () => {
    return new Promise<void>((resolve) => {
      service.loadUserProfile().subscribe({
        error: () => {
          expect(service.error()).toBeTruthy();
          expect(service.isLoading()).toBe(false);
          resolve();
        },
        complete: () => {
          expect(service.error()).toBeTruthy();
          expect(service.isLoading()).toBe(false);
          resolve();
        }
      });

      const req = httpMock.expectOne(`${apiConfig.apiUrl}/User/profile`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  it('should return null on getCurrentProfile when no profile loaded', () => {
    expect(service.getCurrentProfile()).toBeNull();
  });

  it('should clear profile data', () => {
    return new Promise<void>((resolve) => {
      const mockProfile = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890'
      };

      service.loadUserProfile().subscribe(() => {
        service.clearProfile();
        expect(service.userProfile()).toBeNull();
        resolve();
      });

      const req = httpMock.expectOne(`${apiConfig.apiUrl}/User/profile`);
      req.flush(mockProfile);
    });
  });
});
