import { ApplicationConfig, provideBrowserGlobalErrorListeners, ErrorHandler } from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { routes } from './app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { CustomPreloadingStrategy } from './core/utils/custom-preloading.strategy';

/**
 * Global Error Handler for uncaught errors
 */
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('Global error:', error);
    // You can send error to logging service here
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withPreloading(CustomPreloadingStrategy) // Smart preloading for performance
    ),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideCharts(withDefaultRegisterables())
  ]
};
