import { environment } from '../../../environments/environment';

/**
 * API Configuration - Dynamic based on environment
 */
export const API_CONFIG = {
  baseUrl: environment.apiUrl,
  version: environment.apiVersion,
  timeout: environment.timeout
};

/**
 * API Endpoints - Centralized endpoint definitions
 */
export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/Auth/login',
    register: '/Auth/register',
    logout: '/Auth/logout',
    refresh: '/Auth/refresh',
    confirmEmail: '/Auth/confirm-email',
    forgotPassword: '/Auth/forgot-password',
    resetPassword: '/Auth/reset-password'
  },
  // Users
  users: {
    profile: '/User/profile',
    update: '/User/profile',
    getAll: '/User',
    getById: (id: string) => `/User/${id}`,
    delete: (id: string) => `/User/${id}`,
    getPoints: '/User/points'
  },
  // Orders
  orders: {
    getAll: '/Order',
    getById: (id: number) => `/Order/${id}`,
    create: '/Order',
    update: (id: number) => `/Order/${id}`,
    delete: (id: number) => `/Order/${id}`,
    getByUser: (userId: string) => `/Order/user/${userId}`,
    getByCollector: (collectorId: string) => `/Order/collector/${collectorId}`,
    getByFactory: (factoryId: number) => `/Order/factory/${factoryId}`,
    getByStatus: (status: string) => `/Order/status/${status}`,
    complete: (id: number) => `/Order/${id}/complete`
  },
  // Rewards
  rewards: {
    getAll: '/Reward',
    getById: (id: number) => `/Reward/${id}`,
    create: '/Reward',
    update: (id: number) => `/Reward/${id}`,
    delete: (id: number) => `/Reward/${id}`,
    redeem: '/Reward/redeem',
    available: '/Reward/available',
    getLowStock: (threshold?: number) => `/Reward/low-stock${threshold ? `?threshold=${threshold}` : ''}`
  },
  // Materials
  materials: {
    getAll: '/Material',
    getById: (id: number) => `/Material/${id}`,
    create: '/Material',
    update: (id: number) => `/Material/${id}`,
    delete: (id: number) => `/Material/${id}`,
    getByType: (typeName: string) => `/Material/type/${typeName}`
  },
  // Factories
  factories: {
    getAll: '/Factory',
    getById: (id: number) => `/Factory/${id}`,
    getDetails: (id: number) => `/Factory/${id}/details`,
    create: '/Factory',
    update: (id: number) => `/Factory/${id}`,
    delete: (id: number) => `/Factory/${id}`,
    search: (name: string) => `/Factory/type/${name}`
  },
  // Collectors
  collectors: {
    getAll: '/Collector',
    getById: (id: string) => `/Collector/${id}`,
    create: '/Collector',
    update: (id: string) => `/Collector/${id}`,
    delete: (id: string) => `/Collector/${id}`,
    hire: '/Collector/hire',
    fire: (id: string) => `/Collector/${id}/fire`,
    getProfile: '/User/profile',
    getOrders: '/Order',
    getMyOrders: '/Collector/Orders/my-orders',
    getAvailableOrders: '/Collector/Orders/available'
  },
  // Collector Orders (under collector endpoints)
  collectorOrders: {
    accept: (orderId: number) => `/collector/orders/${orderId}/accept`,
    updateStatus: (orderId: number) => `/collector/orders/${orderId}/status`,
    getAvailable: '/collector/orders/available',
    getMyOrders: '/collector/orders/my-orders'
  },
  // Points
  points: {
    getBalance: '/points',
    getHistory: '/points/history',
    getUserPoints: '/User/points'
  }
};
