import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { OrderTrackingService } from './order-tracking.service';
import { ApiConfigService } from '../config/api.config.service';
import { OrderStatus, Order, OrderMaterial } from '../models/order-tracking.model';

describe('OrderTrackingService', () => {
  let service: OrderTrackingService;
  let httpMock: HttpTestingController;
  let apiConfig: ApiConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderTrackingService, ApiConfigService]
    });
    service = TestBed.inject(OrderTrackingService);
    httpMock = TestBed.inject(HttpTestingController);
    apiConfig = TestBed.inject(ApiConfigService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a new order', () => {
    return new Promise<void>((resolve) => {
      const materials: OrderMaterial[] = [
        {
          materialId: '1',
          materialName: 'Plastic Bottles',
          materialType: 'Plastic',
          quantity: 10,
          unit: 'pcs'
        }
      ];

      const mockOrder: Order = {
        id: '1',
        citizenId: 'citizen1',
        citizenName: 'John Doe',
        citizenPhone: '123456789',
        citizenAddress: 'Address 1',
        materials,
        totalQuantity: 10,
        status: OrderStatus.PENDING,
        statusHistory: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      service.createOrder(materials, 'Test notes').subscribe((order) => {
        expect(order?.status).toBe(OrderStatus.PENDING);
        resolve();
      });

      const req = httpMock.expectOne(`${apiConfig.apiUrl}/Order`);
      expect(req.request.method).toBe('POST');
      req.flush(mockOrder);
    });
  });

  it('should fetch user orders', () => {
    return new Promise<void>((resolve) => {
      const mockOrders: Order[] = [
        {
          id: '1',
          citizenId: 'citizen1',
          citizenName: 'John Doe',
          citizenPhone: '123456789',
          citizenAddress: 'Address 1',
          materials: [],
          totalQuantity: 10,
          status: OrderStatus.PENDING,
          statusHistory: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      service.getMyOrders().subscribe(() => {
        expect(service.myOrders().length).toBe(1);
        resolve();
      });

      const req = httpMock.expectOne(`${apiConfig.apiUrl}/Order`);
      expect(req.request.method).toBe('GET');
      req.flush(mockOrders);
    });
  });

  it('should accept order as collector', () => {
    return new Promise<void>((resolve) => {
      const mockOrder: Order = {
        id: '1',
        citizenId: 'citizen1',
        citizenName: 'John Doe',
        citizenPhone: '123456789',
        citizenAddress: 'Address 1',
        collectorId: 'collector1',
        collectorName: 'Jane Collector',
        materials: [],
        totalQuantity: 10,
        status: OrderStatus.ACCEPTED,
        statusHistory: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      service.acceptOrder('1').subscribe((order) => {
        expect(order?.status).toBe(OrderStatus.ACCEPTED);
        resolve();
      });

      const req = httpMock.expectOne(`${apiConfig.apiUrl}/Order/1/accept`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockOrder);
    });
  });

  it('should get status label', () => {
    const label = service.getStatusLabel(OrderStatus.PENDING);
    expect(label).toBe('Waiting for Collector');
  });

  it('should get status color', () => {
    const color = service.getStatusColor(OrderStatus.COMPLETED);
    expect(color).toBe('bg-green-600');
  });
});
