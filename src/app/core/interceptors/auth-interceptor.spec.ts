import { TestBed } from '@angular/core/testing';
import { AuthInterceptor } from './auth-interceptor';
import { AuthService } from '../services/auth.service';
import { FlashMessageService } from '../services/flash-message.service';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        AuthService,
        FlashMessageService,
        provideRouter([]),
        provideHttpClient()
      ]
    });
    interceptor = TestBed.inject(AuthInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
