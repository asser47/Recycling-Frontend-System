import { Injectable, signal } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

/**
 * Loading Interceptor
 * Tracks loading state during HTTP requests
 * Useful for showing global loading indicators
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = signal(0);

  // Public accessor for loading state
  isLoading = () => this.activeRequests() > 0;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.activeRequests.update(count => count + 1);

    return next.handle(req).pipe(
      finalize(() => {
        this.activeRequests.update(count => Math.max(0, count - 1));
      })
    );
  }
}
