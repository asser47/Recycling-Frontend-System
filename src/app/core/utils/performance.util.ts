/**
 * Performance & Security utility functions
 */

/**
 * Debounce function to prevent rapid function calls
 * Useful for search, filter, and auto-save operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: any;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function execution frequency
 * Useful for scroll, resize, and mouse move events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Safe JSON parse with error handling
 */
export function safeJsonParse<T = any>(json: string, fallback?: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback as T;
  }
}

/**
 * Check if running in browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get value from localStorage safely
 */
export function getFromStorage<T = any>(key: string, fallback?: T): T | null {
  if (!isBrowser()) return fallback ?? null;

  try {
    const item = localStorage.getItem(key);
    return item ? safeJsonParse<T>(item) : fallback ?? null;
  } catch {
    return fallback ?? null;
  }
}

/**
 * Set value to localStorage safely
 */
export function setToStorage(key: string, value: any): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save to localStorage: ${key}`, error);
  }
}

/**
 * Remove value from localStorage safely
 */
export function removeFromStorage(key: string): void {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove from localStorage: ${key}`, error);
  }
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
