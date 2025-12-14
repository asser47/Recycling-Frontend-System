import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

/**
 * Custom preloading strategy for Angular routes
 * Preloads certain routes for better performance
 */
export class CustomPreloadingStrategy implements PreloadingStrategy {
  /**
   * Routes to preload (high priority user paths)
   */
  private preloadableRoutes = [
    'dashboard',
    'citizen-dashboard',
    'collector-dashboard',
    'admin',
    'profile',
    'notifications'
  ];

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Check if route should be preloaded
    if (this.shouldPreload(route)) {
      return load();
    }
    return of(null);
  }

  /**
   * Determine if route should be preloaded
   */
  private shouldPreload(route: Route): boolean {
    const path = route.path;
    if (!path) return false;

    return this.preloadableRoutes.some(preloadablePath =>
      path.includes(preloadablePath)
    );
  }
}
